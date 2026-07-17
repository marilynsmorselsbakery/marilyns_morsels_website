export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category: "cookie" | "dough" | "unknown";
  item_variant: string;
  price: number;
  quantity: number;
};

type Ecommerce = {
  currency: "USD";
  value: number;
  items: AnalyticsItem[];
  item_list_id?: "shop_catalog";
  item_list_name?: "Shop catalog";
};

type EcommerceEventName =
  | "view_item_list"
  | "select_item"
  | "view_item"
  | "add_to_cart"
  | "view_cart"
  | "begin_checkout";

export type CheckoutErrorCode =
  | "request_failed"
  | "invalid_response"
  | "network_error";

export type AnalyticsEvent =
  | { event: EcommerceEventName; ecommerce: Ecommerce }
  | { event: "checkout_error"; error_code: CheckoutErrorCode }
  | { event: "generate_lead"; lead_type: "bulk_order" }
  | { event: "contact_click"; contact_method: "email" | "phone" };

export type AnalyticsCheckoutContext = {
  consent: true;
  clientId: string;
};
