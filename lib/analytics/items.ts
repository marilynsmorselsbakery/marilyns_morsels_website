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

export function ecommerceValue(items: AnalyticsItem[]): number {
  return Number(
    items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2)
  );
}
