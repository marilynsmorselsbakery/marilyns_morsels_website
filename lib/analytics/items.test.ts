import { describe, expect, it } from "vitest";
import { analyticsItem, ecommerceValue } from "./items";

describe("analyticsItem", () => {
  it("maps cents to a GA4 item without PII or free-form fields", () => {
    expect(
      analyticsItem({
        itemId: "half_half",
        name: "Half & Half",
        category: "cookie",
        variant: "hh-12",
        priceCents: 2400,
        quantity: 2,
      })
    ).toEqual({
      item_id: "half_half",
      item_name: "Half & Half",
      item_category: "cookie",
      item_variant: "hh-12",
      price: 24,
      quantity: 2,
    });
  });

  it("calculates the ecommerce value from price and quantity", () => {
    expect(
      ecommerceValue([
        {
          item_id: "half_half",
          item_name: "Half & Half",
          item_category: "cookie",
          item_variant: "hh-12",
          price: 24,
          quantity: 2,
        },
        {
          item_id: "dough",
          item_name: "Cookie Dough",
          item_category: "dough",
          item_variant: "dough-pint",
          price: 14.5,
          quantity: 1,
        },
      ])
    ).toBe(62.5);
  });
});
