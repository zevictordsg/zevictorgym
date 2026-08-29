import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Cliente Stripe (server-side). Lança erro apenas quando efetivamente usado. */
export function getStripeClient() {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY ausente — configure o .env.local (ver .env.local.example)"
    );
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
}
