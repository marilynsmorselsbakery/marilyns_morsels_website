import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { buildOrderEmailData } from "./stripe-order";

describe("Stripe checkout to order email data", () => {
  it("extracts fulfillment details from a completed checkout", () => {
    const session = {
      id: "cs_live_order_123",
      created: 1_784_322_547,
      amount_total: 2199,
      currency: "usd",
      customer_details: {
        name: "Cookie Customer",
        email: "customer@example.com",
        address: {
          line1: "123 Main St",
          line2: "Apt 2",
          city: "Westerville",
          state: "OH",
          postal_code: "43081",
          country: "US",
        },
      },
      collected_information: {
        shipping_details: {
          name: "Cookie Customer",
          address: {
            line1: "123 Main St",
            line2: "Apt 2",
            city: "Westerville",
            state: "OH",
            postal_code: "43081",
            country: "US",
          },
        },
      },
      metadata: {
        halfHalf_0_sku: "half-half-6",
        halfHalf_0_first: "Chocolate Chip",
        halfHalf_0_second: "Peanut Butter Cup",
      },
    } as unknown as Stripe.Checkout.Session;

    const lineItems = {
      data: [
        {
          id: "li_123",
          description: "Half & Half",
          quantity: 1,
          amount_total: 2199,
          price: {
            id: "price_123",
            unit_amount: 2199,
            product: {
              id: "prod_123",
              metadata: {
                slug: "half-half-6",
                pack_size: "6",
              },
            },
          },
        },
      ],
    } as unknown as Stripe.ApiList<Stripe.LineItem>;

    expect(buildOrderEmailData(session, lineItems)).toEqual({
      orderId: "cs_live_order_123",
      placedAt: "2026-07-17T21:09:07.000Z",
      customer: {
        name: "Cookie Customer",
        email: "customer@example.com",
      },
      shippingAddress: {
        line1: "123 Main St",
        line2: "Apt 2",
        city: "Westerville",
        state: "OH",
        postalCode: "43081",
        country: "US",
      },
      items: [
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
      amountTotalCents: 2199,
      currency: "usd",
    });
  });

  it("rejects a checkout that lacks customer or shipping details", () => {
    const session = {
      id: "cs_incomplete",
      created: 1_784_322_547,
      amount_total: 100,
      currency: "usd",
      customer_details: null,
      metadata: {},
    } as unknown as Stripe.Checkout.Session;
    const lineItems = { data: [] } as unknown as Stripe.ApiList<Stripe.LineItem>;

    expect(() => buildOrderEmailData(session, lineItems)).toThrow(
      "Checkout is missing fulfillment details"
    );
  });
});
