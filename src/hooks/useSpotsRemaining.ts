"use client";

import { useEffect, useState } from "react";
import { useFunnelStore } from "@/store/funnel-store";

/**
 * Vagas/vouchers "restantes" — usado tanto na tela do WhatsApp (Screen05)
 * quanto na do voucher (Screen07). As duas telas precisam mostrar o MESMO
 * número (senão a urgência fica óbvia e falsa: cai pra 4 no chat e depois
 * volta pra 39 no voucher), então em vez de cada tela ter seu próprio
 * timer local, esse hook deriva o valor a partir de um único timestamp de
 * início compartilhado no funnel-store (`spotsSessionStartedAt`) — puro
 * cálculo de tempo decorrido, então qualquer tela que montar o hook em
 * qualquer momento cai no mesmo número.
 *
 * TODO: quando existir backend, trocar por uma leitura real da contagem
 * de vagas (ver /api/track e a tabela `funnel_events`).
 */
const INITIAL_SPOTS = 10;
const MIN_SPOTS = 4;
const DECREMENT_INTERVAL_MS = 15000;

export function useSpotsRemaining() {
  const spotsSessionStartedAt = useFunnelStore((s) => s.spotsSessionStartedAt);
  const ensureSpotsSessionStarted = useFunnelStore((s) => s.ensureSpotsSessionStarted);
  const [spots, setSpots] = useState(INITIAL_SPOTS);

  useEffect(() => {
    ensureSpotsSessionStarted();
  }, [ensureSpotsSessionStarted]);

  useEffect(() => {
    if (spotsSessionStartedAt == null) return;

    function tick() {
      const elapsed = Date.now() - (spotsSessionStartedAt as number);
      const dropped = Math.floor(elapsed / DECREMENT_INTERVAL_MS);
      setSpots(Math.max(MIN_SPOTS, INITIAL_SPOTS - dropped));
    }

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [spotsSessionStartedAt]);

  return spots;
}
