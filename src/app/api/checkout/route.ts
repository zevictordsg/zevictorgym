import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Cria uma Stripe Checkout Session para a oferta final do funil
 * (ex: "Entrar na ELITE Carbmaxxing" — R$47,90).
 *
 * Espera `{ priceId, email, leadId? }` no corpo. `email` é obrigatório —
 * é o que o webhook (/api/stripe/webhook) usa pra criar a conta na área de
 * membros depois do pagamento confirmado. Configure STRIPE_PRICE_ID_ELITE
 * (ou passe priceId explicitamente) e STRIPE_SECRET_KEY no .env.local.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const priceId = body.priceId ?? process.env.STRIPE_PRICE_ID_ELITE;
  // `leadId` pode chegar como null/"" (ex: leads/funnel_events ainda não
  // existem no Supabase do funil, então useLeadSync nunca setou um id) --
  // tratamos como "sem lead" em vez de mandar string vazia pro Stripe
  // (client_reference_id rejeita "").
  const leadId: string | undefined =
    typeof body.leadId === "string" && body.leadId.trim() ? body.leadId : undefined;
  const email: string | undefined =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;

  if (!priceId) {
    return NextResponse.json(
      { error: "priceId ausente (defina STRIPE_PRICE_ID_ELITE ou envie no corpo)" },
      { status: 400 }
    );
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "e-mail inválido" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${origin}/planilhadohack/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/planilhadohack`,
      ...(leadId ? { client_reference_id: leadId } : {}),
      metadata: { ...(leadId ? { leadId } : {}), email },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[api/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
