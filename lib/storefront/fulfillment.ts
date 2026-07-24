export const FULFILLMENT_POLICY = {
  mode: "local_delivery",
  serviceArea: "Westerville, Ohio area",
  nationwideShipping: false,
  separateDeliveryFeeCents: 0,
  radiusMiles: null,
  preparationWindow: null,
} as const;

export function checkoutFulfillmentSummary() {
  return {
    label: "Local delivery",
    detail: "Westerville-area delivery only",
  } as const;
}
