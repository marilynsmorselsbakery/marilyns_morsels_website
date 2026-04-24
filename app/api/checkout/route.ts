import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProducts } from "@/lib/products";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type CartItemPayload = {
  sku: string;
  flavorId: string;
  quantity: number;
  priceCents: number;
  halfHalfChoices?: { first: string; second: string };
};

/**
 * Guest-checkout Stripe session creator.
 *
 * Auth is OPTIONAL. If the user happens to be signed in, we pass their email
 * to Stripe to prefill the checkout form; otherwise Stripe collects it. Either
 * way, Stripe Checkout collects the shipping address directly.
 *
 * No Supabase profile or Stripe customer is created here. Post-purchase
 * bookkeeping (order row, customer linkage) is handled by the Stripe webhook
 * at /api/webhooks/stripe, which is the correct place for side effects.
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();

    // Auth is optional — read it if present, but never block on it.
    const supabase = await createSupabaseRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { items } = (await request.json()) as { items: CartItemPayload[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Re-fetch products and build flavor → variant lookup so we pay the
    // current Stripe price, not whatever the client-side cart cached.
    const allProducts = await getProducts();
    const productByFlavor = new Map(allProducts.map((p) => [p.flavor, p]));

    // Collect H&H metadata entries to pass on the session.
    const halfHalfMeta: Record<string, string> = {};
    let halfHalfIdx = 0;

    const lineItems = items
      .map((item) => {
        const product = productByFlavor.get(item.flavorId);
        if (!product || item.quantity < 1) return null;

        const variant = product.variants.find((v) => v.sku === item.sku);
        if (!variant) {
          console.warn(
            `[checkout] variant not found: flavorId=${item.flavorId} sku=${item.sku}`
          );
          return null;
        }

        if (item.halfHalfChoices) {
          halfHalfMeta[`halfHalf_${halfHalfIdx}_sku`] = item.sku;
          halfHalfMeta[`halfHalf_${halfHalfIdx}_first`] =
            item.halfHalfChoices.first;
          halfHalfMeta[`halfHalf_${halfHalfIdx}_second`] =
            item.halfHalfChoices.second;
          halfHalfIdx++;
        }

        return {
          price: variant.stripePriceId,
          quantity: item.quantity,
        };
      })
      .filter(
        (item): item is { price: string; quantity: number } => item !== null
      );

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items in cart — product may have been archived" },
        { status: 400 }
      );
    }

    const skuList = items.map((item) => item.sku).join(",");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Prefill the email for logged-in users; Stripe collects it for guests.
      customer_email: user?.email ?? undefined,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      success_url: `${DOMAIN}/success`,
      cancel_url: `${DOMAIN}/cancel`,
      metadata: {
        skus: skuList,
        // Only set supabase_user_id for logged-in users — the orders table
        // has a UUID foreign key on this column, so passing "guest" would
        // violate the constraint. Missing metadata → null in the webhook.
        ...(user?.id ? { supabase_user_id: user.id } : {}),
        ...halfHalfMeta,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
