# Marilyn's Morsels — Audit Research (Pass 2)

**Date:** 2026-04-23
**Feeds into:** `03-plan.md`

Pass 2 combines three independent inputs: (a) 2026 best-practices web research scoped to the stack; (b) code recon of the repo; (c) Lighthouse audits of the live site on mobile + desktop.

---

## A. Live-site Lighthouse audit — marilynsmorsels.com

Measured 2026-04-23 via Chrome DevTools Lighthouse, navigation mode, both device profiles.

| Category | Mobile | Desktop |
|---|---|---|
| Accessibility | 90 | 90 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

**Failed audits (both profiles, 2 each):**

1. **`color-contrast`** — Background and foreground colors do not have sufficient contrast ratio (WCAG 1.4.3). [Axe rule](https://dequeuniversity.com/rules/axe/4.11/color-contrast)
2. **`label`** — Form elements without associated labels (WCAG 1.3.1 / 3.3.2). [Axe rule](https://dequeuniversity.com/rules/axe/4.11/label)

**Interpretation:** Lighthouse's SEO/Best-Practices checks are shallow (has `<title>`, HTTPS, alt attributes, crawlable, etc.). Scoring 100 does **not** mean the site is SEO-complete — it means basics are in place. Deeper gaps (schema, sitemap, structured data) live outside Lighthouse's ruleset and are covered in sections B and C below.

**Performance score** was not computed in this run (Chrome DevTools MCP lighthouse excludes performance; would need `performance_start_trace`). Inferring from other signals: likely fine but not audited numerically. Field Core Web Vitals data would need to come from Vercel Analytics (not installed) or Google CrUX (low/no data at zero orders).

---

## B. Code recon findings (Explore agent, very thorough)

Full catalog: 32 findings across 7 dimensions. Abridged + deduplicated + severity-normalized below.

### Visual polish
- `[MEDIUM]` `app/layout.tsx` — Toaster uses hardcoded hex values (`#fff`, `#5C3D2E`, `#D09B45`, `#dc2626`) instead of Tailwind theme tokens (`morselBrown`, `morselGold`, `morselCocoa`). Inconsistent with design-system palette.
- `[LOW]` `components/Footer.tsx` — minimal; copyright only. Missing NAP, policy links, social.

### Trust signals
- `[HIGH]` **No policy pages** — verified via Glob: no `/privacy`, `/terms`, `/refunds`, `/shipping` routes exist.
- `[HIGH]` **No contact page / contact form** — no visible customer communication channel.
- `[MEDIUM]` No customer reviews, testimonials, or social proof components.
- `[LOW]` No NAP (Name / Address / Phone) anywhere in header or footer.
- `[MEDIUM]` `/bulk-orders` content not yet examined — UX + trust elements unknown.

### Performance
- `[MEDIUM]` `lib/products.ts` — `unstable_cache` 1-hour revalidation, no HTTP cache headers or CDN layer.
- `[LOW]` Font loading uses Tailwind config fallbacks (Georgia serif, system-ui); **no `next/font` integration** — verified via Grep.
- `[LOW]` No evidence of dynamic imports for below-fold components (`BestSellers`, `Hero`).
- `[LOW]` `components/ProductCard.tsx` — responsive `sizes` correct; raw images from `/public` (no transformation pipeline beyond `<Image>`).

### Accessibility (matches Lighthouse findings + more)
- `[MEDIUM]` `components/ProductCard.tsx:68-77` — buttons lack `aria-label` beyond visible text (no product-name context for screen readers: e.g., "Add to Cart for {product.name}").
- `[MEDIUM]` `QuantitySelector` component not examined — unknown if keyboard nav + ARIA are correct.
- `[LOW]` `app/(auth)/login/page.tsx:45-46` — `outline-none` on form inputs; `focus:border-morselGold` present but outline removal may reduce keyboard visibility.
- `[LOW]` Color contrast on custom palette (`morselBrown #3F2A1C` on `morselCream #FFF7ED`, etc.) — **one homepage instance failing per Lighthouse**; full palette audit needed.

### SEO
- `[HIGH]` **No `app/sitemap.ts` or `public/sitemap.xml`** — verified via Glob.
- `[HIGH]` **No `app/robots.ts` or `public/robots.txt`** — verified via Glob.
- `[HIGH]` **No `metadata` exports per page** on `/`, `/about`, `/shop`. All pages inherit from root only.
- `[MEDIUM]` **No schema.org JSON-LD anywhere** — verified via Grep (`application/ld\+json` returns zero matches).
- `[MEDIUM]` No product detail pages (`/shop/[slug]`) — products only display in grid + modal; individual product URLs cannot be indexed or shared.
- `[MEDIUM]` No canonical tags.
- `[LOW]` No OG image in root metadata.
- `[LOW]` `alt={product.name}` in `ProductCard.tsx` — dependent on Stripe product name quality.

### Code quality
- `[MEDIUM]` No `error.tsx` / React error boundary — unhandled component errors will blank the page.
- `[MEDIUM]` `lib/products.ts:57` — Stripe fetch errors only `console.error`; no error-tracking service integration.
- `[MEDIUM]` No `loading.tsx` for async server components — blank page while fetching.
- `[LOW]` `lib/products.ts:27-35` — `FLAVOR_ORDER` and `PACK_ORDER` arrays lack `as const` (minor type safety loss).
- `[LOW]` `components/BestSellers.tsx` — `FEATURED_SLUGS` + `FEATURED_TAGS` hardcoded; no config-driven approach for non-technical edits.

### Analytics
- `[HIGH]` **No analytics package installed anywhere** — verified via Grep (`@vercel/analytics`, `plausible`, `posthog` return zero matches).
- `[HIGH]` No conversion tracking (add-to-cart, product view, checkout, purchase).
- `[HIGH]` No error tracking service (Sentry, LogRocket, etc.).
- `[MEDIUM]` No performance / Core Web Vitals field monitoring.

### Positive findings
- Stack is current (Next.js 15.5.7, React 19.2.1, Tailwind 3.4).
- Runtime Stripe catalog with `unstable_cache` tag `products` — clean pattern for catalog changes without redeploys.
- `lib/products.ts` uses `import "server-only"` — good enforcement boundary.
- Cart uses snapshot pattern (`CartItem` carries `productId`, `name`, `description`, `priceCents`, `quantity`) — robust against mid-session catalog changes.
- Vercel–Supabase integration rotates `SB_*` env vars automatically.
- Git commit identity locked to `marilynsmorselsbakery@gmail.com` for team-member deploy posture.

### Caveats on code-recon scope
The Explore agent did not examine: `/bulk-orders`, full checkout flow, signup page, account page, QuantitySelector component, middleware (verified: no `middleware.ts` exists at repo root). Findings about those are "not examined" rather than "examined and clean." Adding them to deeper-cut tasks in Pass 3.

---

## C. 2026 best-practices research — key findings per dimension

Full research brief available in subagent output; priorities distilled below with inline citations.

### Typography / visual
- Body 16px minimum; line-height 1.4–1.6; line length 50–75ch.
- Pick one type scale ratio (1.25 or 1.333); apply across headings. Amateur signature: arbitrary sizes per component.
- Font loading: always `next/font` (self-hosted, auto `font-display: swap`, zero layout shift). Never `<link>` to Google Fonts. [next.js docs](https://nextjs.org/docs/app/getting-started/fonts)

### Trust signals
- **Baymard:** 19% of shoppers abandon when they don't trust the site with payment info. [baymard.com](https://baymard.com/learn/ecommerce-cro)
- Non-negotiables for first-time buyer: contact info visible, return/refund policy linked from footer, shipping policy, SSL, about page with a real human story, FAQ addressing top objections.
- **FTC** requires shipping timelines be conspicuously disclosed; return policies must be accessible before purchase. [ftc.gov](https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule)

### Performance (Core Web Vitals, unchanged since 2024)
| Metric | Good | Poor |
|---|---|---|
| LCP | <2.5s | >4.0s |
| INP | <200ms | >500ms |
| CLS | <0.1 | >0.25 |
Measured at p75 real-user data. [web.dev/vitals](https://web.dev/articles/vitals)

- Single highest-ROI LCP fix on image-heavy pages: `priority` prop on the above-the-fold hero `<Image>`.
- Don't mark a component `'use client'` just to fetch data — fetch in RSC, pass as props.
- Load Stripe.js lazily (`loadStripe` called at checkout, not page load).

### Accessibility
- Automated tools catch 30–57% of WCAG violations; rest requires manual testing. [levelaccess.com](https://www.levelaccess.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/)
- Top failures: color contrast (1.4.3), non-text contrast (1.4.11), missing/wrong alt text (1.1.1), form labels (1.3.1/3.3.2), keyboard nav breakages.
- WCAG 2.2 worth adopting early: Focus Not Obscured (2.4.11), Target Size 24×24 (2.5.8), Accessible Authentication (3.3.8).

### SEO + GEO
- **Schema:** `LocalBusiness` (subtype `Bakery` / `FoodEstablishment`) on root; `Product` + `Offer` on each product; `Organization` sitewide. Implement as JSON-LD `<script>` in server components. [developers.google.com](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- **`app/sitemap.ts`** — Next.js 15 built-in, returns `MetadataRoute.Sitemap`. Auto-served at `/sitemap.xml`. [next.js docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- **AI-crawler robots posture (2026):** default allow for small businesses — AI-referred traffic often converts higher than standard organic. Explicit directives for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot. [openshadow.io](https://www.openshadow.io/guides/robots-txt-ai-bots)
- **`llms.txt`** — community proposal (not a W3C standard) at [llmstxt.org](https://llmstxt.org). Adopted by Anthropic, Stripe, Zapier, Cloudflare. No major AI platform reads it as first-class input yet (April 2026), but zero-risk addition. ~30 min to write. [linkbuildinghq.com](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/)
- **FAQPage schema** — Google restricted visual FAQ rich results in 2023 for most domains, but the structured data still provides LLM-readable context. Worth implementing anyway.

### Code quality — Next.js 15 mature patterns
- Default to Server Components; add `'use client'` only when needed (`useState`, `useEffect`, browser APIs, event handlers with local state).
- Server Actions (`'use server'`) handle mutations — no manual API route needed.
- Supabase SSR 0.7: use `createServerClient` in RSC/Route Handlers/Actions; `createBrowserClient` in client components. **Use `supabase.auth.getClaims()` server-side, NOT `getSession()`** — `getClaims()` validates JWT signature; `getSession()` is not safe for server-side auth decisions. [next.js docs](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- `middleware.ts` refreshes auth tokens via cookie proxy pattern. **Verified absent from this repo — silent-session-expiry bug waiting to happen.**

### Analytics platform comparison (April 2026)

| Platform | Free tier | Paid starts | Privacy | Next.js | Funnels | Ownership |
|---|---|---|---|---|---|---|
| **Vercel Analytics** | Hobby plan, ~2.5k events/mo | Pro $20/mo includes | Cookieless, GDPR-friendly | Native (`@vercel/analytics`) | Basic | Vercel-hosted, CSV export |
| **Plausible** | 30-day trial | $9/mo Starter (10k pageviews) | Cookieless | `@next-plausible` | Funnels on Business $19+ | EU servers |
| **Umami** | Free self-hosted | Cloud ~$9/mo | Cookieless | Script or `@umami/nextjs` | All plans | Full if self-hosted |
| **GA4** | Free | Free | Cookies + consent banner | `next/third-parties` | Explorations | Google-hosted |

Sources: [plausible.io/docs/subscription-plans](https://plausible.io/docs/subscription-plans), [vercel.com/docs/analytics](https://vercel.com/docs/analytics)

**Recommendation:** **Vercel Analytics** as the default — free at Hobby, zero-config, cookieless. Add Plausible Starter if funnel/goal visibility becomes the priority question. GA4 is heavier ongoing work (consent banner mgmt) than the bakery warrants today.

---

## Top cross-dimension priorities (impact-per-hour)

Ranked for a 1-day execution plan. Feeds directly into Pass 3.

1. **Hero image `priority` prop** — 5-min LCP fix
2. **Lighthouse `color-contrast` + `label` failures** — fix the 2 specific failures to get Lighthouse Acc to 100
3. **`app/sitemap.ts` + `app/robots.ts` with AI-crawler directives** — ~30 min; major SEO+GEO table-stakes gap
4. **`LocalBusiness` + `Product` JSON-LD** — highest-ROI structured data for a bakery
5. **Footer rebuild with NAP + policy links + contact** — trust-signal non-negotiable
6. **Policy pages: shipping, returns, privacy, terms** — 4 short static pages; legal + trust requirement
7. **Contact page or mailto link** — currently zero customer communication channel visible
8. **`next/font` migration** — visual + performance win; replaces Tailwind font-stack fallbacks
9. **Vercel Analytics install** — `@vercel/analytics` + one-line mount in `layout.tsx`
10. **`'use client'` audit** — remove from any component that only renders data
11. **`middleware.ts` for Supabase auth token refresh** — silent bug prevention
12. **Per-page `metadata` exports** on `/`, `/about`, `/shop`, all policy pages
13. **`error.tsx` + `loading.tsx` top-level** — graceful fallbacks
14. **`llms.txt` at site root** — 20 min, zero risk, LLM discoverability
15. **Toaster color tokens** — replace hex with Tailwind design tokens
16. **`CLAUDE.md` + `README.md` in repo root** — maintainability docs (Pass 6 deliverable)

## Open questions (resolve in Pass 3 or flag as parked)

- Does the bakery want product detail pages (`/shop/[slug]`) or stay with grid+modal? Product pages = better SEO; grid+modal = simpler UX. **Decision: recommend adding `/shop/[slug]`** — cheap to add and unlocks per-product indexability + sharing.
- Should the `robots.txt` AI-crawler posture default to allow? **Recommend yes** — bakery has no proprietary data, stands to gain from LLM citation.
- Analytics choice: Vercel Analytics vs Plausible? **Recommend Vercel** for Day 1 (free, zero-config). Revisit at traffic.
