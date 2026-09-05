import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { grantCarbbAccess } from "@/lib/carbb";

/**
 * Webhook do Stripe — chamado depois que o pagamento da oferta ELITE é
 * confirmado (evento `checkout.session.completed`). Cria a conta na área
 * de membros (carbb) liberando os dois produtos ("pdf" + "calculadora",
 * já que quem compra a Calculadora também recebe o PDF) e grava a senha
 * gerada em `checkout_credentials` pra tela de sucesso buscar via
 * /api/checkout/status — o redirect do Checkout de volta pro site acontece
 * antes desse webhook necessariamente terminar de rodar, então a senha não
 * dá pra vir só pela URL de sucesso.
 *
 * Configure o endpoint em Stripe > Developers > Webhooks apontando pra
 * `<seu domínio>/api/stripe/webhook`, evento `checkout.session.completed`,
 * e copie o "Signing secret" pra STRIPE_WEBHOOK_SECRET no .env.local.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("[api/stripe/webhook] STRIPE_WEBHOOK_SECRET ausente ou sem assinatura");
    return NextResponse.json({ error: "webhook não configurado" }, { status: 500 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "assinatura inválida";
    console.error("[api/stripe/webhook] assinatura inválida:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    (typeof session.metadata?.email === "string" ? session.metadata.email : undefined);

  if (!email) {
    console.error("[api/stripe/webhook] sessão sem e-mail:", session.id);
    return NextResponse.json({ error: "sessão sem e-mail" }, { status: 400 });
  }

  const leadId = session.metadata?.leadId;
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;

  try {
    const result = await grantCarbbAccess({
      email,
      products: ["pdf", "calculadora"],
      stripeCustomerId: customerId,
      stripeCheckoutSessionId: session.id,
    });

    // Best effort: se o Supabase do funil (não o do carbb) não estiver
    // configurado, a conta já foi criada normalmente — só não conseguimos
    // relayar a senha pra tela de sucesso via polling (ela cai no fallback
    // "verifique seu e-mail" / "fale com o suporte").
    try {
      const supabase = getSupabaseAdminClient();
      await supabase.from("checkout_credentials").upsert({
        session_id: session.id,
        email: result.email,
        password: result.password ?? null,
      });

      if (leadId) {
        await supabase
          .from("leads")
          .update({
            converted: true,
            converted_at: new Date().toISOString(),
            email: result.email,
            stripe_customer_id: customerId ?? null,
            stripe_checkout_session_id: session.id,
          })
          .eq("id", leadId);
      }
    } catch (relayError) {
      console.error("[api/stripe/webhook] falha ao relayar credenciais:", relayError);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[api/stripe/webhook]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
