# Marilyn's Morsels Local-Delivery-Only Design

**Date:** July 24, 2026  
**Status:** Approved for planning

## Purpose

Align the storefront with the bakery's current operating reality. Marilyn's
Morsels has not established a nationwide shipping process or pricing model, so
the site must not promise nationwide fulfillment or shipping charges that the
checkout does not collect.

## Decision

The storefront will temporarily accept orders for local delivery in the
Westerville, Ohio area only.

- No nationwide shipping will be advertised or offered.
- No exact mileage radius will be promised until Rick confirms one.
- No exact preparation or delivery window will be promised until Rick confirms
  one.
- No separate delivery fee will be added at checkout. This preserves the
  checkout's current behavior and is not a permanent pricing commitment.
- Customers outside the Westerville area will be directed to contact Marilyn
  before ordering.

## Customer-Facing Changes

Remove or replace nationwide-shipping statements in:

- global, home, and shop metadata
- structured home-page descriptions
- the shipping policy
- the FAQ
- the checkout order summary
- the order-success page
- public machine-readable business copy

The checkout summary will say that orders are for Westerville-area delivery
rather than claiming that shipping is calculated later. Stripe will continue
collecting a delivery address so Marilyn has the information needed to fulfill
an accepted local order.

The shipping policy will state:

- local delivery is currently available in the Westerville area
- Marilyn will contact the customer to coordinate delivery
- customers outside the area should contact the bakery before ordering
- nationwide shipping is not currently offered

## Out of Scope

- carrier-rate calculations
- postal-code or mileage enforcement
- nationwide fulfillment
- a permanent delivery-fee policy
- pickup logistics
- confirmed preparation-time guarantees

These require an operating decision from Rick and can be added later.

## Verification

Add a regression test that fails while customer-facing source still contains
the active nationwide-shipping promises, carrier promises, the unconfirmed
10-mile radius, exact shipping windows, or “Calculated at checkout.”

Then verify:

- the regression test passes
- the complete test suite passes
- TypeScript passes
- lint has no new errors
- the production build passes
- the live checkout and policy pages display the local-delivery-only wording

