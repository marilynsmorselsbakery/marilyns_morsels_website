import { describe, expect, it } from "vitest";
import {
  FULFILLMENT_POLICY,
  checkoutFulfillmentSummary,
} from "./fulfillment";

describe("local delivery fulfillment policy", () => {
  it("does not offer or price nationwide shipping", () => {
    expect(FULFILLMENT_POLICY).toEqual({
      mode: "local_delivery",
      serviceArea: "Westerville, Ohio area",
      nationwideShipping: false,
      separateDeliveryFeeCents: 0,
      radiusMiles: null,
      preparationWindow: null,
    });
  });

  it("gives checkout a local-delivery disclosure", () => {
    expect(checkoutFulfillmentSummary()).toEqual({
      label: "Local delivery",
      detail: "Westerville-area delivery only",
    });
  });
});
