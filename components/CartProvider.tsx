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

export type CartItem = {
  sku: string;                  // variant SKU, e.g. "cc-6"
  flavorId: string;             // flavor slug, e.g. "chocolate_chip"
  name: string;                 // "Old Fashion Chocolate Chip — Half-Dozen"
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
      );
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
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback(
    (
      variant: ProductVariant,
      product: Product,
      quantity: number = 1,
      halfHalfChoices?: { first: string; second: string }
    ) => {
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
