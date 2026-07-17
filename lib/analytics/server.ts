export type Ga4PurchaseItem = {
  item_id: string;
  item_name: string;
  item_variant: string;
  price: number;
  quantity: number;
};

export type Ga4Purchase = {
  consent: boolean;
  clientId: string | null | undefined;
  transactionId: string;
  valueCents: number;
  currency: string;
  items: Ga4PurchaseItem[];
};

type FetchLike = (
  input: string,
  init: RequestInit
) => Promise<{ ok: boolean; status?: number }>;

const CLIENT_ID_PATTERN = /^[A-Za-z0-9._-]{8,128}$/;

export function buildGa4PurchasePayload(purchase: Ga4Purchase) {
  if (
    !purchase.consent ||
    !purchase.clientId ||
    !CLIENT_ID_PATTERN.test(purchase.clientId) ||
    !purchase.transactionId.trim() ||
    !Number.isFinite(purchase.valueCents) ||
    purchase.valueCents < 0 ||
    purchase.items.length === 0
  ) {
    return null;
  }

  return {
    client_id: purchase.clientId,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: purchase.transactionId,
          value: Number((purchase.valueCents / 100).toFixed(2)),
          currency: purchase.currency.toUpperCase(),
          items: purchase.items,
        },
      },
    ],
  };
}

export async function sendGa4Purchase(
  purchase: Ga4Purchase,
  request: FetchLike = fetch
): Promise<"sent" | "skipped"> {
  const payload = buildGa4PurchasePayload(purchase);
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!payload || !measurementId || !apiSecret) return "skipped";

  const response = await request(
    `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
      measurementId
    )}&api_secret=${encodeURIComponent(apiSecret)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`GA4 purchase delivery failed (${response.status ?? "unknown"})`);
  }

  return "sent";
}
