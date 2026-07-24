# Marilyn's Morsels Local-Delivery-Only Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unconfirmed nationwide-shipping promises and make the storefront consistently describe Westerville-area local delivery.

**Architecture:** Add one typed fulfillment-policy module as the source of truth for checkout-facing delivery behavior. Update the existing pages, metadata, and public business description to consume or match that contract without adding carrier rates, distance enforcement, or new fulfillment features.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest

## Global Constraints

- The storefront accepts orders for local delivery in the Westerville, Ohio area only.
- Do not advertise or offer nationwide shipping.
- Do not promise an exact mileage radius or preparation window.
- Do not add a separate delivery fee.
- Direct customers outside the Westerville area to contact Marilyn before ordering.
- Preserve the two existing unrelated modified analytics documents.

---

### Task 1: Define the Fulfillment Contract

**Files:**
- Create: `lib/storefront/fulfillment.ts`
- Create: `lib/storefront/fulfillment.test.ts`

**Interfaces:**
- Produces: `FULFILLMENT_POLICY`, a readonly object with `mode`, `serviceArea`, `nationwideShipping`, `separateDeliveryFeeCents`, `radiusMiles`, and `preparationWindow`.
- Produces: `checkoutFulfillmentSummary(): { label: string; detail: string }`.

- [ ] **Step 1: Write the failing policy test**

```ts
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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- lib/storefront/fulfillment.test.ts`

Expected: FAIL because `lib/storefront/fulfillment.ts` does not exist.

- [ ] **Step 3: Implement the minimal policy module**

```ts
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
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm test -- lib/storefront/fulfillment.test.ts`

Expected: PASS with 2 tests.

- [ ] **Step 5: Commit the fulfillment contract**

```powershell
git add -- lib/storefront/fulfillment.ts lib/storefront/fulfillment.test.ts
git commit -m "feat: define local delivery fulfillment policy"
```

### Task 2: Align Storefront Copy and Checkout

**Files:**
- Modify: `app/checkout/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/shop/page.tsx`
- Modify: `app/shipping/page.tsx`
- Modify: `app/faq/page.tsx`
- Modify: `app/success/page.tsx`
- Modify: `public/llms.txt`
- Consume: `lib/storefront/fulfillment.ts`

**Interfaces:**
- Consumes: `checkoutFulfillmentSummary()` in the checkout order summary.
- Consumes: `FULFILLMENT_POLICY.serviceArea` where a programmatic service-area value prevents copy drift.

- [ ] **Step 1: Update checkout behavior**

Import `checkoutFulfillmentSummary`, call it once inside the checkout component,
and replace:

```tsx
<span>Shipping</span>
<span>Calculated at checkout</span>
```

with:

```tsx
<span>{fulfillment.label}</span>
<span>{fulfillment.detail}</span>
```

Add this disclosure immediately below the order totals:

```tsx
<p>
  Orders are currently available for delivery in the Westerville area only.
  Outside the area? Contact us before ordering.
</p>
```

- [ ] **Step 2: Replace metadata and structured descriptions**

In `app/layout.tsx`, `app/page.tsx`, and `app/shop/page.tsx`, replace nationwide
shipping language with:

```text
Order online for local delivery in the Westerville, Ohio area.
```

- [ ] **Step 3: Rewrite the shipping policy**

Keep the page title and contact link. Replace the operating claims with these
customer-facing facts:

```text
Marilyn's Morsels is currently accepting orders for local delivery in the
Westerville, Ohio area.

After an order is placed, Marilyn will contact the customer by email to
coordinate delivery.

Customers outside the Westerville area should contact the bakery before
ordering. Nationwide shipping is not currently available.
```

Remove the 10-mile radius, USPS/UPS, tracking-number, calculated-rate, and
preparation-window promises.

- [ ] **Step 4: Align FAQ, success copy, and public business description**

Update the FAQ to say the bakery has no walk-in storefront, currently offers
Westerville-area delivery, and does not currently offer nationwide shipping.
Remove the unconfirmed 10-mile radius and exact standard-order window.

Replace the success-page shipping promise with:

```text
We'll contact you by email to coordinate local delivery.
```

Update `public/llms.txt` to describe Westerville-area local delivery only.

- [ ] **Step 5: Verify prohibited active promises are gone**

Run:

```powershell
rg -n -i "nationwide shipping|ship baked|shipping rates|calculated at checkout|shipped within|USPS|UPS|tracking number|10 miles|1–3 business days|2–4 business days" app components public lib
```

Expected: no active customer-facing matches. Matches in tests that describe the
disabled policy are acceptable.

- [ ] **Step 6: Run complete verification**

Run:

```powershell
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all tests and typechecking pass; lint has no errors; build completes.

- [ ] **Step 7: Commit the storefront alignment**

```powershell
git add -- app/checkout/page.tsx app/layout.tsx app/page.tsx app/shop/page.tsx app/shipping/page.tsx app/faq/page.tsx app/success/page.tsx public/llms.txt
git commit -m "fix: align storefront with local delivery"
```

- [ ] **Step 8: Deploy and verify production**

Push `main`, wait for the production deployment to succeed, then verify the
live checkout, shipping policy, FAQ, success page, metadata, and `llms.txt`
display only the approved local-delivery wording.

