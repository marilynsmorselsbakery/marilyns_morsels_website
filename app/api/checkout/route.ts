import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import {
  createSupabaseRouteHandlerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type CartItem = {
  productId: string;
  quantity: number;
  priceCents: number;
};

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      console.error("Stripe secret key is not configured");
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const supabase = await createSupabaseRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { items } = (await request.json()) as { items: CartItem[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const userId = user.id;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle<Database["public"]["Tables"]["profiles"]["Row"]>();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Failed to load profile", profileError);
      return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
    }

    const serviceSupabase = createSupabaseServiceRoleClient();

    let profile = profileData ?? null;

    if (!profile) {
      const { data: newProfile, error: createProfileError } = await serviceSupabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: user.user_metadata?.full_name ?? null,
          stripe_customer_id: null,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single<Database["public"]["Tables"]["profiles"]["Row"]>();

      if (createProfileError) {
        console.error("Failed to create profile record", createProfileError);
        return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
      }

      profile = newProfile;
    }

    let stripeCustomerId = profile?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: profile?.full_name ?? user.email ?? undefined,
        phone: profile?.phone ?? undefined,
        address:
          profile?.address_line1 || profile?.city || profile?.state || profile?.postal_code
            ? {
                line1: profile?.address_line1 ?? undefined,
                line2: profile?.address_line2 ?? undefined,
                city: profile?.city ?? undefined,
                state: profile?.state ?? undefined,
                postal_code: profile?.postal_code ?? undefined,
                country: "US",
              }
            : undefined,
        metadata: {
          supabase_user_id: userId,
        },
      });

      stripeCustomerId = customer.id;

      const { data: updatedProfile, error: updateProfileError } = await serviceSupabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: profile?.full_name ?? user.email ?? null,
          phone: profile?.phone ?? null,
          address_line1: profile?.address_line1 ?? null,
          address_line2: profile?.address_line2 ?? null,
          city: profile?.city ?? null,
          state: profile?.state ?? null,
          postal_code: profile?.postal_code ?? null,
          stripe_customer_id: stripeCustomerId,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single<Database["public"]["Tables"]["profiles"]["Row"]>();

      if (updateProfileError) {
        console.error("Failed to persist Stripe customer ID", updateProfileError);
        return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
      }

      profile = updatedProfile;
    }

    const lineItems = items
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product || item.quantity < 1) {
          return null;
        }
        return {
          price: product.stripePriceId,
          quantity: item.quantity,
        };
      })
      .filter((item): item is { price: string; quantity: number } => item !== null);

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    const productIds = items.map((item) => item.productId).join(",");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId ?? undefined,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      customer_update: {
        shipping: "auto",
        address: "auto",
      },
      success_url: `${DOMAIN}/success`,
      cancel_url: `${DOMAIN}/cancel`,
      metadata: {
        productIds: productIds,
        supabase_user_id: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
