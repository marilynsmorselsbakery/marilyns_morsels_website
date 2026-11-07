"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ProductVariant, Product } from "@/lib/products";
import { track } from "@/lib/analytics/client";
import { ecommerceValue, productAnalyticsItem } from "@/lib/analytics/items";

export type CartItem = {
  sku: string;                  // variant SKU, e.g. "cc-6"
  flavorId: string;             // flavor slug, e.g. "chocolate_chip"
  name: string;                 // "Old Fashion Chocolate Chip — Half-Dozen"
  analyticsName: string;        // flavor-level name without pack-size snapshot
  category?: "cookie" | "dough";
  priceCents: number;
  quantity: number;
  stripePriceId: string;        // used at checkout
  halfHalfChoices?: { first: string; second: string }; // flavor slugs, only for half_half
};

/** Composite row key: same sku + same H&H picks → stack qty, different picks → new row */
export function cartRowKey(item: Pick<CartItem, "sku" | "halfHalfChoices">): string {
  return `${item.sku}|${item.halfHalfChoices?.first ?? ""}|${item.halfHalfChoices?.second ?? ""}`;
}

type CartContextValue = {
  items: CartItem[];
  hasRestoredCart: boolean;
  itemCount: number;
  totalCents: number;
  addItem: (
    variant: ProductVariant,
    product: Product,
    quantity?: number,
    halfHalfChoices?: { first: string; second: string }
  ) => void;
  removeItem: (rowKey: string) => void;
  updateQuantity: (rowKey: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "marilyns-morsels-cart-v2";

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.sku === "string" &&
          typeof item.flavorId === "string" &&
          typeof item.name === "string" &&
          typeof item.quantity === "number" &&
          typeof item.priceCents === "number" &&
          typeof item.stripePriceId === "string" &&
          item.quantity > 0
      ).map((item) => ({
        ...item,
        analyticsName:
          typeof item.analyticsName === "string"
            ? item.analyticsName
            : item.name.split(" — ")[0],
        category:
          item.category === "cookie" || item.category === "dough"
            ? item.category
            : undefined,
      }));
    }
    return [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  // Server and first client render must agree, even when a saved cart exists.
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasRestoredCart, setHasRestoredCart] = useState(false);

  useEffect(() => {
    // localStorage is an external, browser-only source. One post-mount render
    // is intentional so hydration uses the server's empty cart snapshot.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadCartFromStorage());
    setHasRestoredCart(true);
  }, []);

  useEffect(() => {
    // Use state, not a ref: mount effects (including Strict Mode replay) still
    // see false, so the initial empty render cannot overwrite the saved cart.
    if (hasRestoredCart) saveCartToStorage(items);
  }, [items, hasRestoredCart]);

  const addItem = useCallback(
    (
      variant: ProductVariant,
      product: Product,
      quantity: number = 1,
      halfHalfChoices?: { first: string; second: string }
    ) => {
      const analyticsProduct = productAnalyticsItem(product, variant, quantity);
      track({
        event: "add_to_cart",
        ecommerce: {
          currency: "USD",
          value: ecommerceValue([analyticsProduct]),
          items: [analyticsProduct],
        },
      });
      setItems((prev) => {
        const newItemKey = cartRowKey({ sku: variant.sku, halfHalfChoices });
        const existing = prev.find((item) => cartRowKey(item) === newItemKey);
        if (existing) {
          return prev.map((item) =>
            cartRowKey(item) === newItemKey
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        const newItem: CartItem = {
          sku: variant.sku,
          flavorId: product.flavor,
          name: `${product.name} — ${variant.packLabel}`,
          analyticsName: product.name,
          category: product.category,
          priceCents: variant.priceCents,
          quantity,
          stripePriceId: variant.stripePriceId,
          halfHalfChoices,
        };
        return [...prev, newItem];
      });
    },
    []
  );

  const removeItem = useCallback((rowKey: string) => {
    setItems((prev) => prev.filter((item) => cartRowKey(item) !== rowKey));
  }, []);

  const updateQuantity = useCallback(
    (rowKey: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(rowKey);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          cartRowKey(item) === rowKey ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  const value: CartContextValue = {
    items,
    hasRestoredCart,
    itemCount,
    totalCents,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
