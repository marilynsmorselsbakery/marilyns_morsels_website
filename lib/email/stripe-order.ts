import type Stripe from "stripe";
import type { OrderEmailData } from "./order";

const PACK_LABELS: Record<string, string> = {
  "6": "Half-Dozen",
  "12": "Dozen",
  "24": "2-Dozen",
  pint: "Pint",
  quart: "Quart",
  half_gallon: "Half-Gallon",
  test: "Test",
};

type ShippingDetails = {
  name?: string | null;
  address?: Stripe.Address | null;
};

type CurrentCheckoutSession = Stripe.Checkout.Session & {
  collected_information?: {
    shipping_details?: ShippingDetails | null;
  } | null;
};

function customizationsBySku(metadata: Stripe.Metadata | null): Map<string, string[]> {
  const result = new Map<string, string[]>();
  if (!metadata) return result;

  for (const key of Object.keys(metadata)) {
    const match = /^halfHalf_(\d+)_sku$/.exec(key);
    if (!match) continue;

    const index = match[1];
    const sku = metadata[key];
    const first = metadata[`halfHalf_${index}_first`];
    const second = metadata[`halfHalf_${index}_second`];
    if (!sku || !first || !second) continue;

    const existing = result.get(sku) ?? [];
    existing.push(`${first} + ${second}`);
    result.set(sku, existing);
  }

  return result;
}

function productFromLineItem(lineItem: Stripe.LineItem): Stripe.Product | null {
  const product = lineItem.price?.product;
  if (!product || typeof product === "string" || "deleted" in product) return null;
  return product;
}

export function buildOrderEmailData(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.ApiList<Stripe.LineItem>
): OrderEmailData {
  const currentSession = session as CurrentCheckoutSession;
  const customer = session.customer_details;
  const shipping =
    currentSession.collected_information?.shipping_details ??
    session.shipping_details ??
    (customer?.address ? { name: customer.name, address: customer.address } : null);
  const address = shipping?.address;

  if (
    !customer?.email ||
    !customer.name ||
    !address?.line1 ||
    !address.city ||
    !address.state ||
    !address.postal_code ||
    !address.country ||
    lineItems.data.length === 0
  ) {
    throw new Error("Checkout is missing fulfillment details");
  }

  const customizationMap = customizationsBySku(session.metadata);
  const items = lineItems.data.map((lineItem) => {
    const product = productFromLineItem(lineItem);
    const sku = product?.metadata.slug ?? lineItem.price?.id ?? lineItem.id;
    const packSize = product?.metadata.pack_size;
    const selections = customizationMap.get(sku) ?? [];
    const customization =
      selections.length <= 1
        ? selections[0]
        : selections.map((selection, index) => `Pack ${index + 1}: ${selection}`).join("; ");
    const quantity = lineItem.quantity ?? 1;
    const lineAmountCents = lineItem.amount_total ?? 0;

    return {
      sku,
      name: lineItem.description || product?.name || sku,
      variant: packSize ? PACK_LABELS[packSize] ?? packSize : "Standard",
      quantity,
      unitAmountCents:
        lineItem.price?.unit_amount ?? Math.round(lineAmountCents / quantity),
      lineAmountCents,
      ...(customization ? { customization } : {}),
    };
  });

  return {
    orderId: session.id,
    placedAt: new Date(session.created * 1000).toISOString(),
    customer: {
      name: customer.name,
      email: customer.email,
    },
    shippingAddress: {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postal_code,
      country: address.country,
    },
    items,
    amountTotalCents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
  };
}
