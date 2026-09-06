import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const VALID_PATHS = new Set(["pdf", "elite"]);

/**
 * Loga a INTENÇÃO de clique nos dois botões da oferta final — chamado no
 * exato momento do clique (antes de saber se `/api/enroll` ou `/api/checkout`
 * vão dar certo), pra medir abandono no meio do caminho (ex: clicou em
 * "comprar" mas desistiu do Stripe, ou clicou e caiu num erro de config).
 *
 * Reaproveita a tabela `funnel_events` (mesma usada pelo `useLeadSync` pra
 * navegação entre telas) com step_id `cta-pdf-click` / `cta-elite-click` —
 * sem migração nova, e esses dois valores já aparecem de graça na view
 * `funnel_retention`, dando o comparativo "chegou na oferta final" x
 * "clicou em cada opção" x "completou" (esse último via `subscriptions`
 * no carbb).
 *
 * Best-effort, igual ao `/api/track`: se o Supabase do funil não estiver
 * configurado ou a chamada falhar, não deve travar o clique real do
 * usuário — o front-end dispara isso e ignora o resultado.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "corpo inválido" }, { status: 400 });
  }

  const { leadId, path } = body as { leadId?: string; path?: string };

  if (!path || !VALID_PATHS.has(path)) {
    return NextResponse.json({ error: "path inválido (use 'pdf' ou 'elite')" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch {
    // Supabase do funil ainda não configurado — não derruba o clique real.
    return NextResponse.json({ ok: false, persisted: false });
  }

  const { error } = await supabase
    .from("funnel_events")
    .insert({ lead_id: leadId ?? null, step_id: `cta-${path}-click` });

  if (error) {
    console.error("[api/cta-click]", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
