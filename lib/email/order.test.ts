import { describe, expect, it, vi } from "vitest";
import {
  buildOrderEmailContent,
  sendOrderEmails,
  type OrderEmailData,
} from "./order";

const order: OrderEmailData = {
  orderId: "cs_live_order_123",
  placedAt: "2026-07-17T21:09:07.000Z",
  customer: {
    name: "Michael & Co.",
    email: "customer@example.com",
  },
  shippingAddress: {
    line1: "5014 <Blendon> Ravine Ct",
    line2: null,
    city: "Columbus",
    state: "OH",
    postalCode: "43230",
    country: "US",
  },
  items: [
    {
      sku: "cc-12",
      name: "Old Fashion Chocolate Chip",
      variant: "Dozen",
      quantity: 2,
      unitAmountCents: 2325,
      lineAmountCents: 4650,
    },
    {
      sku: "half-half-6",
      name: "Half & Half",
      variant: "Half-Dozen",
      quantity: 1,
      unitAmountCents: 2199,
      lineAmountCents: 2199,
      customization: "Chocolate Chip + Peanut Butter Cup",
    },
  ],
  amountTotalCents: 6849,
  currency: "usd",
};

describe("order notification emails", () => {
  it("builds an actionable bakery ticket and a customer confirmation", () => {
    const content = buildOrderEmailContent(order);

    expect(content.business.subject).toContain("NEW PAID ORDER");
    expect(content.business.text).toContain("2 × Old Fashion Chocolate Chip — Dozen");
    expect(content.business.text).toContain(
      "1 × Half & Half — Half-Dozen (Chocolate Chip + Peanut Butter Cup)"
    );
    expect(content.business.text).toContain("Michael & Co.");
    expect(content.business.text).toContain("customer@example.com");
    expect(content.business.text).toContain("5014 <Blendon> Ravine Ct");
    expect(content.business.text).toContain("$68.49 USD");

    expect(content.customer.subject).toContain("We received your order");
    expect(content.customer.text).toContain("2 × Old Fashion Chocolate Chip — Dozen");
    expect(content.customer.text).toContain("5014 <Blendon> Ravine Ct");
  });

  it("escapes customer-provided values in HTML", () => {
    const content = buildOrderEmailContent(order);

    expect(content.business.html).toContain("Michael &amp; Co.");
    expect(content.business.html).toContain("5014 &lt;Blendon&gt; Ravine Ct");
    expect(content.business.html).not.toContain("5014 <Blendon> Ravine Ct");
  });

  it("sends both messages with retry-safe idempotency keys", async () => {
    const send = vi.fn().mockResolvedValue({ id: "email_123" });

    await sendOrderEmails(order, send, {
      from: "Marilyn's Morsels <orders@marilynsmorsels.com>",
      businessEmail: "marilynsmorselsbakery@gmail.com",
    });

    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: "marilynsmorselsbakery@gmail.com",
        replyTo: "customer@example.com",
      }),
      { idempotencyKey: "order-business/cs_live_order_123" }
    );
    expect(send).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: "customer@example.com",
        replyTo: "marilynsmorselsbakery@gmail.com",
      }),
      { idempotencyKey: "order-customer/cs_live_order_123" }
    );
  });
});
