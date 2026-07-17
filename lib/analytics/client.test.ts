import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./client";

describe("track", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("clears stale ecommerce data before pushing an ecommerce event", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { dataLayer });

    track({
      event: "add_to_cart",
      ecommerce: {
        currency: "USD",
        value: 12,
        items: [
          {
            item_id: "chocolate_chip",
            item_name: "Old Fashion Chocolate Chip",
            item_category: "cookie",
            item_variant: "cc-6",
            price: 12,
            quantity: 1,
          },
        ],
      },
    });

    expect(dataLayer).toEqual([
      { ecommerce: null },
      {
        event: "add_to_cart",
        ecommerce: {
          currency: "USD",
          value: 12,
          items: [
            {
              item_id: "chocolate_chip",
              item_name: "Old Fashion Chocolate Chip",
              item_category: "cookie",
              item_variant: "cc-6",
              price: 12,
              quantity: 1,
            },
          ],
        },
      },
    ]);
  });

  it("pushes non-ecommerce events without an ecommerce reset", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { dataLayer });

    track({ event: "contact_click", contact_method: "email" });

    expect(dataLayer).toEqual([
      { event: "contact_click", contact_method: "email" },
    ]);
  });

  it("is a no-op during server rendering", () => {
    vi.stubGlobal("window", undefined);
    expect(() =>
      track({ event: "generate_lead", lead_type: "bulk_order" })
    ).not.toThrow();
  });
});
