---
name: Stripe Setup Guide
overview: Complete Stripe integration setup for Marilyn's Morsels, including account configuration, product/price creation, environment variables, and optional webhook handling for order fulfillment.
todos:
  - id: stripe-account
    content: Set up Stripe account and obtain API keys (test mode for development)
    status: pending
  - id: create-products
    content: Create 6 products and prices in Stripe Dashboard matching lib/products.ts
    status: pending
  - id: update-price-ids
    content: Update stripePriceId values in lib/products.ts with real Stripe price IDs
    status: pending
  - id: env-variables
    content: Configure STRIPE_SECRET_KEY and NEXT_PUBLIC_BASE_URL in .env.local
    status: pending
  - id: webhook-handler
    content: Create webhook handler at app/api/webhooks/stripe/route.ts for order fulfillment
    status: pending
  - id: webhook-endpoint
    content: Configure webhook endpoint in Stripe Dashboard and test with Stripe CLI
    status: pending
  - id: test-checkout
    content: Test complete checkout flow with Stripe test cards
    status: pending
---

# Stripe Setup for Marilyn's Morsels

## Current State

- Stripe package (`stripe@^16.0.0`) is already installed
- Checkout API route exists at `app/api/checkout/route.ts` and creates Stripe Checkout sessions
- Products in `lib/products.ts` have placeholder `stripePriceId` values (e.g., "price_cc_6", "price_cc_12")
- No webhook handler exists for processing completed payments
- Environment variables need to be configured

## Setup Steps

### 1. Stripe Account Setup

- Create a Stripe account at https://stripe.com (if not already done)
- Get API keys from Dashboard → Developers → API keys
- Use test mode keys (`sk_test_...` and `pk_test_...`) for development

### 2. Create Products and Prices in Stripe Dashboard

For each product in `lib/products.ts`, create:

- **Product**: Name and description matching the product
- **Price**: One-time payment, amount in cents, currency USD

Products to create:

- Chocolate Chip 6-Pack ($12.00) → Get price ID
- Chocolate Chip 12-Pack ($22.00) → Get price ID
- Butterscotch Chip 6-Pack ($13.00) → Get price ID
- Butterscotch Chip 12-Pack ($24.00) → Get price ID
- Half & Half 6-Pack ($13.00) → Get price ID
- Half & Half 12-Pack ($24.00) → Get price ID

### 3. Update Product Price IDs

Update `lib/products.ts` to replace placeholder `stripePriceId` values with real Stripe price IDs from step 2.

### 4. Environment Variables

Create/update `.env.local` with:

- `STRIPE_SECRET_KEY` - Secret key from Stripe Dashboard
- `NEXT_PUBLIC_BASE_URL` - Your app URL (http://localhost:3000 for dev)
- Optionally: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (if needed for client-side Stripe)

### 5. Webhook Handler (Optional but Recommended)

Create `app/api/webhooks/stripe/route.ts` to:

- Verify webhook signatures
- Handle `checkout.session.completed` events
- Store order data in Supabase or send confirmation emails
- This ensures orders are recorded even if users don't complete the redirect

### 6. Configure Stripe Webhook Endpoint

- In Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://your-domain.com/api/webhooks/stripe`
- Select events: `checkout.session.completed`
- For local testing, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### 7. Testing

- Test checkout flow with Stripe test cards
- Verify customer creation in Stripe Dashboard
- Test webhook delivery (if implemented)
- Verify order data is stored correctly

## Files to Modify

- `lib/products.ts` - Update `stripePriceId` values with real Stripe price IDs
- `.env.local` - Add Stripe secret key and base URL
- `app/api/webhooks/stripe/route.ts` - Create new webhook handler (optional)

## Notes

- The checkout route already handles customer creation and linking to Supabase profiles
- Shipping address collection is configured for US only
- Success/cancel pages exist at `/success` and `/cancel`
- For production, switch to live mode keys and update webhook endpoint URL