import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

/**
 * Cria uma Stripe Checkout Session para a oferta final do funil
 * (ex: "Entrar na ELITE Carbmaxxing" — R$47,90).
 *
 * Espera `{ priceId, leadId? }` no corpo. Configure STRIPE_PRICE_ID_ELITE
 * (ou passe priceId explicitamente) e STRIPE_SECRET_KEY no .env.local.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const priceId = body.priceId ?? process.env.STRIPE_PRICE_ID_ELITE;
  const leadId: string | undefined = body.leadId;

  if (!priceId) {
    return NextResponse.json(
      { error: "priceId ausente (defina STRIPE_PRICE_ID_ELITE ou envie no corpo)" },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      client_reference_id: leadId,
      metadata: leadId ? { leadId } : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[api/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
