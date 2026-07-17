import { afterEach, describe, expect, it, vi } from "vitest";
import { buildGa4PurchasePayload, sendGa4Purchase } from "./server";

const purchase = {
  consent: true as const,
  clientId: "client-123456",
  transactionId: "cs_live_order_123",
  valueCents: 4650,
  currency: "usd",
  items: [
    {
      item_id: "cc-12",
      item_name: "Old Fashion Chocolate Chip",
      item_variant: "cc-12",
      price: 23.25,
      quantity: 2,
    },
  ],
};

describe("GA4 verified purchase measurement", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("builds a recommended purchase event with a deduplicating transaction id", () => {
    expect(buildGa4PurchasePayload(purchase)).toEqual({
      client_id: "client-123456",
      events: [
        {
          name: "purchase",
          params: {
            transaction_id: "cs_live_order_123",
            value: 46.5,
            currency: "USD",
            items: purchase.items,
          },
        },
      ],
    });
  });

  it("rejects missing consent, invalid client ids, and empty transaction ids", () => {
    expect(buildGa4PurchasePayload({ ...purchase, consent: false })).toBeNull();
    expect(buildGa4PurchasePayload({ ...purchase, clientId: "x" })).toBeNull();
    expect(buildGa4PurchasePayload({ ...purchase, transactionId: "" })).toBeNull();
  });

  it("posts the event only when both server credentials are present", async () => {
    vi.stubEnv("GA4_MEASUREMENT_ID", "G-BRH7YVV7C6");
    vi.stubEnv("GA4_API_SECRET", "secret-value");
    const request = vi.fn().mockResolvedValue({ ok: true });

    await expect(sendGa4Purchase(purchase, request)).resolves.toBe("sent");
    expect(request).toHaveBeenCalledWith(
      "https://www.google-analytics.com/mp/collect?measurement_id=G-BRH7YVV7C6&api_secret=secret-value",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildGa4PurchasePayload(purchase)),
      }
    );
  });

  it("skips cleanly when analytics is not configured", async () => {
    const request = vi.fn();
    await expect(sendGa4Purchase(purchase, request)).resolves.toBe("skipped");
    expect(request).not.toHaveBeenCalled();
  });

  it("throws on a failed Measurement Protocol response so Stripe can retry", async () => {
    vi.stubEnv("GA4_MEASUREMENT_ID", "G-BRH7YVV7C6");
    vi.stubEnv("GA4_API_SECRET", "secret-value");
    const request = vi.fn().mockResolvedValue({ ok: false, status: 503 });

    await expect(sendGa4Purchase(purchase, request)).rejects.toThrow(
      "GA4 purchase delivery failed (503)"
    );
  });
});
