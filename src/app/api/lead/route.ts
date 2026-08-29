import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

/**
 * Cria ou atualiza um lead com as respostas do quiz coletadas até aqui.
 * Chamada pelo funil (via `useLeadSync`, a implementar) sempre que o usuário
 * responde uma pergunta importante — assim nada se perde se ele abandonar
 * no meio do caminho.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "corpo inválido" }, { status: 400 });
  }

  const { leadId, answers, funnelStep } = body as {
    leadId?: string;
    answers?: Record<string, unknown>;
    funnelStep?: string;
  };

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch {
    // Supabase ainda não configurado — não derruba o funil, só não persiste.
    return NextResponse.json({ ok: false, persisted: false });
  }

  const { data, error } = await supabase
    .from("leads")
    .upsert(
      {
        id: leadId ?? undefined,
        answers: answers ?? {},
        funnel_step: funnelStep ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select("id")
    .single();

  if (error) {
    console.error("[api/lead]", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, leadId: data.id, persisted: true });
}
