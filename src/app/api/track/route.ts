import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

/**
 * Registra a chegada de um lead numa etapa do funil — chamada pelo
 * `useLeadSync` a cada troca de tela. Faz duas coisas:
 *
 *  1. Upsert em `leads`: garante o registro (cria se `leadId` não vier),
 *     atualiza `funnel_step` (última etapa conhecida) e `answers`, e — só
 *     na primeiríssima chamada de cada sessão — grava os dados de entrada
 *     (referrer, UTM, user-agent) vindos em `entry`.
 *  2. Insert em `funnel_events`: uma linha por (lead, etapa) — é o que dá
 *     o funil de conversão completo (retenção/abandono por etapa), já que
 *     `funnel_step` sozinho só guarda a ÚLTIMA etapa, não o caminho todo.
 *
 * Ver `supabase/schema.sql` pras tabelas e a view `funnel_retention`
 * (leads únicos por etapa, pronta pra consultar no Supabase).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "corpo inválido" }, { status: 400 });
  }

  const { leadId, stepId, answers, entry } = body as {
    leadId?: string;
    stepId?: string;
    answers?: Record<string, unknown>;
    entry?: {
      referrer?: string;
      landingPath?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmTerm?: string;
      utmContent?: string;
    };
  };

  if (!stepId || typeof stepId !== "string") {
    return NextResponse.json({ error: "stepId é obrigatório" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch {
    // Supabase ainda não configurado — não derruba o funil, só não persiste.
    return NextResponse.json({ ok: false, persisted: false });
  }

  const userAgent = request.headers.get("user-agent") ?? null;

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .upsert(
      {
        id: leadId ?? undefined,
        answers: answers ?? {},
        funnel_step: stepId,
        updated_at: new Date().toISOString(),
        ...(entry
          ? {
              referrer: entry.referrer ?? null,
              landing_path: entry.landingPath ?? null,
              utm_source: entry.utmSource ?? null,
              utm_medium: entry.utmMedium ?? null,
              utm_campaign: entry.utmCampaign ?? null,
              utm_term: entry.utmTerm ?? null,
              utm_content: entry.utmContent ?? null,
              user_agent: userAgent,
            }
          : {}),
      },
      { onConflict: "id" }
    )
    .select("id")
    .single();

  if (leadError) {
    console.error("[api/track] lead upsert", leadError.message);
    return NextResponse.json({ ok: false, error: leadError.message }, { status: 500 });
  }

  const { error: eventError } = await supabase
    .from("funnel_events")
    .insert({ lead_id: lead.id, step_id: stepId });

  if (eventError) {
    // O lead já foi salvo — um evento de retenção a menos não deve derrubar
    // a resposta inteira pro cliente.
    console.error("[api/track] event insert", eventError.message);
  }

  return NextResponse.json({ ok: true, leadId: lead.id, persisted: true });
}
