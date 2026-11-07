import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { cart, effects, push } = vi.hoisted(() => ({
  cart: { items: [] as { sku: string; flavorId: string; name: string; priceCents: number; quantity: number }[], totalCents: 0, hasRestoredCart: false, clearCart: vi.fn() },
  effects: [] as (() => void)[],
  push: vi.fn(),
}));

// No DOM dependency is installed. Capture and run the actual page effect after
// rendering to exercise its redirect decision independently of the browser.
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void) => { effects.push(effect); },
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/image", () => ({ default: () => null }));
vi.mock("next/link", () => ({ default: () => null }));
vi.mock("@/components/CartProvider", () => ({ useCart: () => cart }));
vi.mock("@/lib/product-images", () => ({ getProductImage: () => "/cookie.jpg" }));
vi.mock("@/lib/analytics/client", () => ({ track: vi.fn() }));
vi.mock("@/lib/analytics/consent", () => ({ getAnalyticsContext: vi.fn() }));
vi.mock("@/lib/analytics/items", () => ({ cartAnalyticsItem: vi.fn(), ecommerceValue: vi.fn() }));
vi.mock("@/lib/storefront/fulfillment", () => ({ checkoutFulfillmentSummary: () => ({ label: "Delivery", detail: "Local" }) }));

import CheckoutPage from "./page";

function renderAndRunEffects() {
  renderToString(<CheckoutPage />);
  effects.splice(0).forEach((effect) => effect());
}

beforeEach(() => {
  cart.items = [];
  cart.hasRestoredCart = false;
  effects.length = 0;
  push.mockClear();
});

describe("checkout saved-cart restoration", () => {
  it("does not redirect before storage restoration, including effect replay", () => {
    renderAndRunEffects();
    renderAndRunEffects();
    expect(push).not.toHaveBeenCalled();
  });

  it("redirects an empty cart only after storage restoration", () => {
    cart.hasRestoredCart = true;
    renderAndRunEffects();
    expect(push).toHaveBeenCalledExactlyOnceWith("/shop");
  });

  it("stays on checkout when saved items finish restoring", () => {
    renderAndRunEffects();
    cart.items = [{ sku: "cc-6", flavorId: "chocolate_chip", name: "Chocolate Chip", priceCents: 1200, quantity: 3 }];
    cart.hasRestoredCart = true;
    renderAndRunEffects();
    expect(push).not.toHaveBeenCalled();
  });
});
