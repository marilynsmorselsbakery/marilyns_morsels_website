import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  stripeInstance = new Stripe(key, {
    apiVersion: "2025-11-17.clover" as Stripe.LatestApiVersion,
  });

  return stripeInstance;
}
