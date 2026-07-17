# Marilyn's Morsels Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install a client-owned, consent-aware GTM measurement system that sends a privacy-safe ecommerce funnel to GA4 and behavioral signals to Microsoft Clarity, including Stripe-verified purchase events.

**Architecture:** The Next.js application loads one GTM container and exposes a typed `dataLayer` interface. A first-party consent component defaults Google consent signals to denied and lets the visitor accept or decline analytics. GTM owns the GA4 and Clarity tags; the Stripe webhook sends consented purchases directly to GA4 Measurement Protocol using the Checkout Session ID as the deduplicating transaction ID.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.9, Google Tag Manager, GA4, GA4 Measurement Protocol, Microsoft Clarity, Stripe Checkout/webhooks, Vitest.

## Global Constraints

- Permanent property ownership stays with `marilynsmorselsbakery@gmail.com`.
- GA4 measurement ID is `G-BRH7YWV7C6`; Clarity project ID is `x0egiy5fhb`.
- GTM is the only browser tag loader; do not install direct GA4 or Clarity snippets/packages.
- No name, email, phone, address, inquiry text, card data, or other PII enters `dataLayer`, GA4, or Clarity.
- Analytics failure must never block browsing, cart, checkout, payment, webhook persistence, or customer messaging.
- `purchase` fires only after a verified Stripe webhook and uses the Checkout Session ID as `transaction_id`.
- GA4 and Clarity tags require granted `analytics_storage`; advertising consent remains denied.
- Existing Vercel Analytics and Speed Insights remain installed.

---

### Task 1: Test Harness and Typed Analytics Core

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `lib/analytics/types.ts`
- Create: `lib/analytics/client.ts`
- Create: `lib/analytics/items.ts`
- Test: `lib/analytics/client.test.ts`
- Test: `lib/analytics/items.test.ts`

**Interfaces:**
- Produces: `track(event: AnalyticsEvent): void`, `analyticsItem(...)`, `getAnalyticsContext(): AnalyticsCheckoutContext | null`.
- `AnalyticsEvent` is a discriminated union for `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `checkout_error`, `generate_lead`, and `contact_click`.

- [ ] Install `vitest` as a development dependency and add `"test": "vitest run"`.
- [ ] Write tests proving `track` pushes the exact ecommerce object to `window.dataLayer`, does nothing outside the browser, and never accepts free-form contact fields in its TypeScript interface.
- [ ] Run `npm test -- lib/analytics/client.test.ts` and confirm failure because the modules do not exist.
- [ ] Implement the minimal typed client layer. Every ecommerce push must begin with `{ ecommerce: null }`, followed by `{ event, ecommerce }`, to prevent stale GTM ecommerce values.
- [ ] Implement `analyticsItem` so prices are dollars, currency is `USD`, and item fields are limited to `item_id`, `item_name`, `item_category`, `item_variant`, `price`, and `quantity`.
- [ ] Run `npm test`, `npm run lint`, and `npx tsc --noEmit`; all must pass.
- [ ] Commit with `feat(analytics): add typed data layer`.

### Task 2: GTM Loader, Consent Controls, and Privacy Disclosure

**Files:**
- Create: `components/analytics/ConsentDefaults.tsx`
- Create: `components/analytics/AnalyticsConsent.tsx`
- Create: `lib/analytics/consent.ts`
- Test: `lib/analytics/consent.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: `window.dataLayer` from Task 1.
- Produces: `getConsentChoice()`, `setConsentChoice(choice)`, `hasAnalyticsConsent()`, and `NEXT_PUBLIC_GTM_ID` integration.

- [ ] Write tests proving the consent parser accepts only `granted` or `denied`, defaults to `unset`, and produces Google Consent Mode fields with `analytics_storage` granted only after acceptance while all ad fields stay denied.
- [ ] Run `npm test -- lib/analytics/consent.test.ts` and confirm the missing-module failure.
- [ ] Implement consent storage under `mm_analytics_consent`, an accessible fixed banner with equally visible Accept and Decline actions, and a footer-accessible “Cookie settings” reopening control.
- [ ] Add a `beforeInteractive` default-consent command before GTM and mount `GoogleTagManager` from `@next/third-parties/google` only when `NEXT_PUBLIC_GTM_ID` is present.
- [ ] Update Privacy Policy language to disclose GA4, GTM, Clarity recordings/heatmaps, Vercel Analytics, consent behavior, masking, and the no-PII rule; change the displayed update date to July 17, 2026.
- [ ] Run unit tests, lint, typecheck, and build.
- [ ] Commit with `feat(analytics): add consent-aware GTM loader`.

### Task 3: Browser Funnel Instrumentation

**Files:**
- Modify: `app/shop/ShopGrid.tsx`
- Modify: `components/ProductCard.tsx`
- Modify: `components/ProductDetailModal.tsx`
- Modify: `components/CartProvider.tsx`
- Modify: `components/CartDrawer.tsx`
- Modify: `app/checkout/page.tsx`
- Modify: `app/bulk-orders/BulkOrdersContent.tsx`
- Modify: `components/Footer.tsx`
- Test: `lib/analytics/items.test.ts`

**Interfaces:**
- Consumes: `track`, `analyticsItem`, and `getAnalyticsContext` from Task 1.
- Produces: standardized ecommerce pushes consumed by GTM custom-event triggers.

- [ ] Extend item tests for product-list, cart, and half-and-half variants; run them and confirm the new expectations fail.
- [ ] Emit `view_item_list` once when the shop catalog is displayed and `select_item` when Details is activated.
- [ ] Emit `view_item` when the product modal opens and centralize `add_to_cart` inside `CartProvider.addItem` so card and modal additions cannot double-fire.
- [ ] Emit `view_cart` when the drawer transitions closed-to-open.
- [ ] Emit `begin_checkout` immediately before the checkout request and `checkout_error` for non-OK responses, missing redirect URLs, and caught exceptions. Error parameters are fixed codes, never raw exception or server text.
- [ ] Emit `generate_lead` only after the bulk-inquiry endpoint returns a successful response. Until storage/delivery is verified, keep this event classified as a supporting event rather than a GA4 key event.
- [ ] Emit `contact_click` for mail and telephone links without including the address or number.
- [ ] Run tests, lint, typecheck, and build; then commit with `feat(analytics): instrument bakery funnel`.

### Task 4: Stripe-Verified Purchase Measurement

**Files:**
- Create: `lib/analytics/server.ts`
- Test: `lib/analytics/server.test.ts`
- Modify: `app/api/checkout/route.ts`
- Modify: `app/api/webhooks/stripe/route.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: checkout JSON field `analytics: { consent: true, clientId: string }` only when consent was granted.
- Produces: `sendGa4Purchase({ clientId, transactionId, value, currency, items }): Promise<void>`.

- [ ] Write tests proving Measurement Protocol payloads use `purchase`, contain a non-empty unique `transaction_id`, express value in currency units, contain only product fields, and skip transmission without explicit consent, a valid client ID, or required server environment variables.
- [ ] Run `npm test -- lib/analytics/server.test.ts` and confirm failure because `server.ts` is absent.
- [ ] Add `analytics_consent` and `ga_client_id` to Stripe Checkout metadata only after validating the client payload; never place contact or user account data in analytics metadata.
- [ ] In the verified `checkout.session.completed` webhook, retrieve line items, build the GA4 purchase payload, and send it only after order persistence. Use `session.id` as `transaction_id`; GA4 web-stream transaction-ID deduplication protects webhook retries.
- [ ] Log only fixed analytics failure messages and allow Stripe to retry transient GA4 failures without exposing the secret.
- [ ] Document server-only `GA4_MEASUREMENT_ID` and `GA4_API_SECRET` variables.
- [ ] Run tests, lint, typecheck, and build; commit with `feat(analytics): track verified purchases`.

### Task 5: Client-Owned Platform Configuration and Production Verification

**Files:**
- Modify: `.vercelignore` only if local environment files are not already excluded.
- Modify: `docs/superpowers/plans/2026-07-17-marilyns-morsels-analytics-implementation.md` to check completed steps.

**Interfaces:**
- Produces: a published GTM web container ID, GA4 API secret stored only in Vercel, published GTM container version, and verified production events.

- [ ] In the client Google account, create a GTM Web container for `marilynsmorsels.com`, add Michael as administrator where supported, and store the returned `GTM-...` ID in Vercel as `NEXT_PUBLIC_GTM_ID` for Production, Preview, and Development.
- [ ] In GTM, create the Google tag with `G-BRH7YWV7C6` on Initialization — All Pages, requiring analytics consent.
- [ ] Install Clarity project `x0egiy5fhb` through Microsoft's GTM integration or official template and require `analytics_storage` consent.
- [ ] Create GA4 Event tags for every approved `dataLayer` event, with ecommerce data enabled and custom error/contact parameters restricted to the allowlist.
- [ ] In GA4, create a Measurement Protocol API secret; store it in Vercel as `GA4_API_SECRET`, and store `G-BRH7YWV7C6` as server-only `GA4_MEASUREMENT_ID`.
- [ ] Use GTM Preview/Tag Assistant to verify denied consent blocks GA4 and Clarity, acceptance fires both, decline keeps both blocked, and no event contains PII.
- [ ] Publish a named GTM container version and deploy the code through the repository's `main` branch.
- [ ] Verify production page views and funnel events in GA4 Realtime/DebugView, verify Clarity `collect` requests and dashboard activity, and perform one authorized live Stripe purchase/refund to verify deduplicated `purchase`.
- [ ] Run final `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `git status --short`, and a production smoke test.
- [ ] Commit any verification-only documentation with `docs: record analytics verification`.

