import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { sendGa4Purchase, type Ga4PurchaseItem } from "@/lib/analytics/server";
import { sendOrderEmails } from "@/lib/email/order";
import { createResendOrderEmailSender } from "@/lib/email/resend";
import { buildOrderEmailData } from "@/lib/email/stripe-order";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const orderEmailFrom =
  process.env.ORDER_EMAIL_FROM ??
  "Marilyn's Morsels <orders@marilynsmorsels.com>";
const orderNotificationTo =
  process.env.ORDER_NOTIFICATION_TO ?? "marilynsmorselsbakery@gmail.com";

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-11-17.clover" as Stripe.LatestApiVersion,
    })
  : null;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

async function handleCheckoutCompleted(
  stripeClient: Stripe,
  session: Stripe.Checkout.Session
) {
  const supabase = createSupabaseServiceRoleClient();
  const productIds = session.metadata?.skus ?? null;
  const supabaseUserId = session.metadata?.supabase_user_id ?? null;

  const { error } = await supabase.from("orders").upsert(
    {
      id: session.id,
      supabase_user_id: supabaseUserId,
      product_ids: productIds,
      amount_total: session.amount_total ?? null,
      currency: session.currency ?? null,
      payment_status: session.payment_status ?? session.status ?? null,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      created_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error("Order persistence failed");
  }

  const lineItems = await stripeClient.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });

  if (!resend) {
    throw new Error("Order email configuration is missing");
  }

  await sendOrderEmails(
    buildOrderEmailData(session, lineItems),
    createResendOrderEmailSender(resend),
    {
      from: orderEmailFrom,
      businessEmail: orderNotificationTo,
    }
  );

  const analyticsItems: Ga4PurchaseItem[] = lineItems.data.flatMap((lineItem) => {
    const quantity = lineItem.quantity ?? 1;
    const price = lineItem.price;
    const product = price?.product;
    const itemId =
      typeof product === "string"
        ? product
        : product?.id ?? price?.id ?? lineItem.id;

    if (!lineItem.description || !price) return [];
    return [
      {
        item_id: itemId,
        item_name: lineItem.description,
        item_variant: price.id,
        price: Number(((lineItem.amount_total ?? 0) / quantity / 100).toFixed(2)),
        quantity,
      },
    ];
  });

  await sendGa4Purchase({
    consent:
      session.payment_status === "paid" &&
      session.metadata?.analytics_consent === "granted",
    clientId: session.metadata?.ga_client_id,
    transactionId: session.id,
    valueCents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    items: analyticsItems,
  });
}

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error("Stripe webhook configuration is missing");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe webhook signature verification failed", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(stripe, session);
    }
  } catch (error) {
    console.error("Stripe webhook handler error", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

