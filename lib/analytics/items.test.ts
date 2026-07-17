import { describe, expect, it } from "vitest";
import {
  analyticsItem,
  cartAnalyticsItem,
  ecommerceValue,
  productAnalyticsItem,
} from "./items";

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

  it("maps a catalog product and selected variant", () => {
    expect(
      productAnalyticsItem(
        {
          id: "chocolate_chip",
          name: "Old Fashion Chocolate Chip",
          category: "cookie",
        },
        { sku: "cc-12", priceCents: 2200 },
        3
      )
    ).toEqual({
      item_id: "chocolate_chip",
      item_name: "Old Fashion Chocolate Chip",
      item_category: "cookie",
      item_variant: "cc-12",
      price: 22,
      quantity: 3,
    });
  });

  it("maps a persisted cart item without exposing its display snapshot", () => {
    expect(
      cartAnalyticsItem({
        sku: "dough-pint",
        flavorId: "chocolate_chip_dough",
        analyticsName: "Chocolate Chip Cookie Dough",
        category: "dough",
        priceCents: 1450,
        quantity: 1,
      })
    ).toEqual({
      item_id: "chocolate_chip_dough",
      item_name: "Chocolate Chip Cookie Dough",
      item_category: "dough",
      item_variant: "dough-pint",
      price: 14.5,
      quantity: 1,
    });
  });
});
