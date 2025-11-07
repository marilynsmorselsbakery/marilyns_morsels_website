import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      console.error("Stripe secret key is not configured");
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const { productId, quantity } = await request.json();
    const product = getProductById(productId);

    if (!product || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: product.stripePriceId,
          quantity,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      success_url: `${DOMAIN}/success`,
      cancel_url: `${DOMAIN}/cancel`,
      metadata: {
        productId: product.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}

