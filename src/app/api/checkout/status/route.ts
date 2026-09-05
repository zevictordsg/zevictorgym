import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

/**
 * Polling da tela de sucesso (/planilhadohack/obrigado) pro caminho pago:
 * o webhook (/api/stripe/webhook) grava a senha gerada em
 * `checkout_credentials` assim que confirma o pagamento — essa rota lê por
 * `session_id` e APAGA o registro no mesmo request (senha em texto plano,
 * não fica esperando indefinidamente no banco).
 *
 * `ready: false` também é a resposta normal enquanto o webhook ainda não
 * rodou (ou se o Supabase do funil não estiver configurado) — o front faz
 * polling curto até `ready: true` ou desiste depois de um tempo.
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id ausente" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch {
    return NextResponse.json({ ready: false });
  }

  const { data, error } = await supabase
    .from("checkout_credentials")
    .select("email, password")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) {
    console.error("[api/checkout/status]", error.message);
    return NextResponse.json({ ready: false });
  }

  if (!data) {
    return NextResponse.json({ ready: false });
  }

  await supabase.from("checkout_credentials").delete().eq("session_id", sessionId);

  return NextResponse.json({ ready: true, email: data.email, password: data.password });
}
