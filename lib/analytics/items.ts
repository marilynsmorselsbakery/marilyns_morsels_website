import type { AnalyticsItem } from "./types";

type AnalyticsItemSource = {
  itemId: string;
  name: string;
  category: AnalyticsItem["item_category"];
  variant: string;
  priceCents: number;
  quantity: number;
};

export function analyticsItem(source: AnalyticsItemSource): AnalyticsItem {
  return {
    item_id: source.itemId,
    item_name: source.name,
    item_category: source.category,
    item_variant: source.variant,
    price: source.priceCents / 100,
    quantity: source.quantity,
  };
}

type CatalogProduct = {
  id: string;
  name: string;
  category: "cookie" | "dough";
};

type CatalogVariant = {
  sku: string;
  priceCents: number;
};

type CartAnalyticsSource = {
  sku: string;
  flavorId: string;
  analyticsName: string;
  category?: "cookie" | "dough";
  priceCents: number;
  quantity: number;
};

export function productAnalyticsItem(
  product: CatalogProduct,
  variant: CatalogVariant,
  quantity = 1
): AnalyticsItem {
  return analyticsItem({
    itemId: product.id,
    name: product.name,
    category: product.category,
    variant: variant.sku,
    priceCents: variant.priceCents,
    quantity,
  });
}

export function cartAnalyticsItem(item: CartAnalyticsSource): AnalyticsItem {
  return analyticsItem({
    itemId: item.flavorId,
    name: item.analyticsName,
    category: item.category ?? "unknown",
    variant: item.sku,
    priceCents: item.priceCents,
    quantity: item.quantity,
  });
}

export function ecommerceValue(items: AnalyticsItem[]): number {
  return Number(
    items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2)
  );
}
