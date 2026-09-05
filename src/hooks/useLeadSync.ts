"use client";

import { useEffect, useRef } from "react";
import { FUNNEL_STEPS } from "@/data/funnel-steps";
import { useFunnelStore } from "@/store/funnel-store";

/**
 * Sincroniza cada troca de etapa do funil com o backend (POST /api/track):
 * garante um `leadId`, grava um evento em `funnel_events` (é o que dá o
 * funil de conversão — quantos leads chegaram em cada etapa e onde
 * abandonam) e atualiza `leads.funnel_step` + `leads.answers`. Dispara uma
 * vez por mudança real de etapa (idas E voltas contam), e manda os dados
 * de "entrada" (referrer, UTM) só na primeiríssima chamada da sessão.
 *
 * Se o Supabase ainda não estiver configurado (variáveis de ambiente
 * vazias), a rota responde `{ ok: false, persisted: false }` sem erro — o
 * funil continua funcionando normalmente, só não persiste nada. Chame uma
 * vez, no componente que já conhece `currentIndex` (ver FunnelEngine).
 */
export function useLeadSync() {
  const currentIndex = useFunnelStore((s) => s.currentIndex);
  const hasHydrated = useFunnelStore((s) => s.hasHydrated);
  const leadId = useFunnelStore((s) => s.leadId);
  const answers = useFunnelStore((s) => s.answers);
  const setLeadId = useFunnelStore((s) => s.setLeadId);

  const hasSentEntry = useRef(false);
  const lastSyncedStepId = useRef<string | null>(null);
  // `answers`/`leadId` só são lidos no momento do disparo (via ref), não
  // entram nas deps do efeito de sync — senão disparariam um POST a cada
  // resposta do quiz, não só a cada troca de tela. Atualizados em efeitos
  // próprios (nunca durante o render, que o React 19 não permite mais pra
  // refs).
  const answersRef = useRef(answers);
  const leadIdRef = useRef(leadId);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    leadIdRef.current = leadId;
  }, [leadId]);

  useEffect(() => {
    if (!hasHydrated) return;

    const step = FUNNEL_STEPS[currentIndex];
    if (!step || lastSyncedStepId.current === step.id) return;
    lastSyncedStepId.current = step.id;

    const params = new URLSearchParams(window.location.search);
    const entry = hasSentEntry.current
      ? undefined
      : {
          referrer: document.referrer || undefined,
          landingPath: window.location.pathname,
          utmSource: params.get("utm_source") ?? undefined,
          utmMedium: params.get("utm_medium") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
          utmTerm: params.get("utm_term") ?? undefined,
          utmContent: params.get("utm_content") ?? undefined,
        };
    hasSentEntry.current = true;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: leadIdRef.current ?? undefined,
        stepId: step.id,
        answers: answersRef.current,
        entry,
      }),
    })
      .then((res) => res.json())
      .then((data: { ok?: boolean; leadId?: string }) => {
        if (data?.leadId && data.leadId !== leadIdRef.current) {
          setLeadId(data.leadId);
        }
      })
      .catch(() => {
        // Falha de rede não deve travar o funil — só não registra o evento.
      });
  }, [hasHydrated, currentIndex, setLeadId]);
}
