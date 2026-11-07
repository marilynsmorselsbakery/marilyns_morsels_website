import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics/client", () => ({ track: vi.fn() }));
vi.mock("@/lib/analytics/items", () => ({
  ecommerceValue: vi.fn(),
  productAnalyticsItem: vi.fn(),
}));

import { CartProvider, useCart } from "./CartProvider";

const savedCart = JSON.stringify([{
  sku: "cc-6",
  flavorId: "chocolate_chip",
  name: "Chocolate Chip - Half-Dozen",
  analyticsName: "Chocolate Chip",
  category: "cookie",
  priceCents: 1200,
  quantity: 2,
  stripePriceId: "price_test",
}]);

function CartSummary() {
  const { itemCount, totalCents, hasRestoredCart } = useCart();
  return <span>{`${itemCount} items: ${totalCents}; restored: ${hasRestoredCart}`}</span>;
}

function renderCart() {
  return renderToString(<CartProvider><CartSummary /></CartProvider>);
}

afterEach(() => vi.unstubAllGlobals());

describe("cart hydration", () => {
  it("matches the server markup on the first render even with a saved cart", () => {
    const serverMarkup = renderCart();
    expect(serverMarkup).toContain("restored: false");
    const storage = { getItem: vi.fn(() => savedCart), setItem: vi.fn() };
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", storage);

    expect(renderCart()).toBe(serverMarkup);
    // Storage must be restored after mount, never read or overwritten in render.
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(renderCart()).toBe(serverMarkup);
  });
});
