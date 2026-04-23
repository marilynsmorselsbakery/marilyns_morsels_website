# Marilyn's Morsels — Claude Code Context

Small-business e-commerce site for **Marilyn's Morsels Bakery** (https://marilynsmorsels.com). Next.js 15 storefront with Supabase auth + Stripe checkout, deployed on Vercel.

## Business overview

- **Business type:** home bakery (not a brick-and-mortar storefront; no walk-in hours)
- **Location:** Westerville, Ohio
- **Owner:** Marilyn; primary business contact / decision-maker is Rick Tonelli (Marilyn's son)
- **Product lines:** cookies (5 varieties × 3 pack sizes) + cookie dough (3 flavors × multiple sizes). See `AutomatonicBusiness\Clients\marilynsmorsels\product-notes-from-rick-2026-04-23.md` for exact pricing and final product names.
- **Stage:** live, zero orders to date. Not actively promoted yet.

These facts are load-bearing for: `LocalBusiness` schema subtype (`Bakery`), local-SEO keywords, FAQ content (shipping radius, pickup availability, home-kitchen allergen handling), and copy tone.

## Stack

- **Framework:** Next.js 15.5.7 (App Router, RSC-default)
- **Runtime:** React 19.2.1, TypeScript 5.9
- **Styling:** Tailwind CSS 3.4 (custom `morsel*` palette in `tailwind.config`)
- **Auth:** Supabase SSR 0.7 (`@supabase/ssr`)
- **Payments:** Stripe 16 (runtime catalog via `unstable_cache`, tag `products`)
- **Hosting:** Vercel (Marilyn's Morsels team, Hobby tier)
- **Toasts:** `react-hot-toast`

## Key paths

- `app/` — App Router routes: `/`, `/about`, `/shop`, `/checkout`, `/bulk-orders`, `/account`, `/(auth)/login`, `/(auth)/signup`, `/success`, `/cancel`
- `components/` — shared UI (`Footer`, `Navbar`, `ProductCard`, `ProductDetailModal`, `CartDrawer`, `CartProvider`, `BestSellers`, `Hero`, `QuantitySelector`, `SupabaseSessionProvider`)
- `lib/stripe.ts` — Stripe SDK singleton
- `lib/products.ts` — runtime Stripe catalog fetch + `unstable_cache` (1h) — **`import "server-only"` enforced**
- `lib/product-images.ts` — consolidated image map (single source of truth)
- `lib/flavors.ts` — flavor label + pack-size display helpers
- `lib/supabase/client.ts` + `server.ts` — SSR-aware Supabase clients
- `app/api/checkout/route.ts` — builds Stripe Checkout session
- `docs/audit-2026-04-23/` — audit artifacts (spec, research, plan). Read these before non-trivial work on this repo.

## Environment variables

**Supabase (via Vercel integration, `SB_` prefix — DO NOT rename):**
- `NEXT_PUBLIC_SB_SUPABASE_URL`
- `NEXT_PUBLIC_SB_SUPABASE_PUBLISHABLE_KEY`
- `SB_SUPABASE_SECRET_KEY`

**Stripe + URL (manual):**
- `STRIPE_SECRET_KEY` (sk_live_…)
- `STRIPE_WEBHOOK_SECRET` (whsec_…)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_…)
- `NEXT_PUBLIC_BASE_URL` (https://marilynsmorsels.com in prod)

The Vercel-Supabase integration rotates `SB_*` variables automatically on secret changes. Do not hardcode Supabase URLs/keys; read from these env names.

## Git commit identity (critical)

Local repo config is locked to `marilynsmorselsbakery@gmail.com` (NOT the default `mbcaldwell77@gmail.com`). This matches the Vercel team owner so Hobby-tier deploys don't get flagged as "not a team member."

**Do not change this.** Set via `git config user.email marilynsmorselsbakery@gmail.com` in this repo. If commits ever get rejected from Vercel, first check `git log -1 --format='%ae'` — wrong author is the most common cause.

## Deploy notes

- **Vercel team:** Marilyn's Morsels (not Michael's personal `eldern-tomes` team)
- **Tier:** Hobby (free)
- **Production branch:** `main` → auto-deploys on push
- **Origin:** `marilynsmorselsbakery/marilyns_morsels_website` (GitHub, org-owned)
- **Personal mirror:** `mbcaldwell77/marilynsmorsels` (backup only, `personal` remote)

## Architecture quick notes

- **Runtime Stripe catalog:** `lib/products.ts` fetches products from Stripe at runtime, caches 1h via `unstable_cache` with tag `products`. Price/product changes happen in the Stripe dashboard only — no code change, no redeploy needed. To force a cache bust, call `revalidateTag('products')`.
- **Cart snapshot pattern:** `CartItem` stores `productId` (slug), `name`, `description`, `priceCents`, `quantity`. Cart renders from this snapshot alone — no lookup during drawer rendering. Protects against mid-session catalog mutations (e.g., if a product is archived, the cart still works).
- **Checkout re-fetch:** `app/api/checkout/route.ts` re-fetches `getProducts()` server-side to get the current `stripePriceId` before building the Stripe Checkout session. Ensures latest prices are used even if the cart was built from stale cached data.
- **Server-only boundary:** `lib/products.ts` has `import "server-only"` — it throws at build time if imported from a client component. Client components import `type { ProductOption }` only (types are erased at build).

## Build + run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
npx tsc --noEmit  # type check (not in package.json as a script)
```

## What NOT to put in this repo

- **Client business documents** — SoWs, invoices, proposals, contracts, emails about Marilyn's Morsels as a business. Those live in `C:\Users\MBC\AutomatonicBusiness\Clients\marilynsmorsels\`, never here.
- **Product pricing spreadsheets / client reference data** — same reason (Automatonic business data, not repo data).
- **`.env*` files** — gitignored already; never commit.

## Active audit (2026-04-23)

A full audit + improvement plan is in progress. See `docs/audit-2026-04-23/`:
- `01-spec.md` — audit scope (what's in/out, methodology)
- `02-research.md` — 2026 best-practices research + code recon + Lighthouse findings
- `03-plan.md` — 5-phase execution plan (infrastructure → SEO schema → trust pages → a11y → analytics/docs)

Before touching this codebase in ways that intersect the audit dimensions (SEO, a11y, schema, trust pages, analytics), read `03-plan.md` first. The plan is the contract for what changes are in scope.

## Pending client-dependent items

Tracked in SoW (separate file in `AutomatonicBusiness/Clients/marilynsmorsels/`). Blocked on:

- Rick confirming final product name for "Reese's PB Deluxe (?)"
- Rick's final pricing documents (received — see `AutomatonicBusiness/.../product-notes-from-rick-2026-04-23.md`)
- Rick's real product photos (HEIC currently; need JPG/PNG conversion + upload)
- Marilyn/Rick reviewing draft FAQ content + policy pages after the audit ships
