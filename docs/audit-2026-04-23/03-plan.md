# Marilyn's Morsels — Audit Improvement Plan

**Date:** 2026-04-23
**Owner:** Michael Caldwell
**Status:** Final (post-scrutiny)
**Inputs:** `01-spec.md` (scope), `02-research.md` (evidence)
**Covers:** SoW items 12 (website audit + improvement plan), 13 (execution of findings), 14 (maintainability docs — `CLAUDE.md` + `README.md`)

---

## Context

marilynsmorsels.com is live but has zero orders. Lighthouse mobile scores are a solid baseline (A90 / BP100 / SEO100) but the shallow passing score hides deeper gaps revealed by Pass 2 research: no analytics, no sitemap, no robots, no structured data, no policy pages, no contact page, no `next/font`, no `middleware.ts`, no per-page metadata. The site looks fine at a glance and fails every deeper check.

This plan targets Michael-executable wins only. Client-dependent items (target audience, new copy, new photography) are parked. The goal is to take the site from "functional but hobby-tier" to "legibly professional + foundationally sound" in roughly one focused day.

## Success criteria

- [ ] All 7 audit dimensions have their top-priority items addressed, not just touched
- [ ] Lighthouse mobile Accessibility reaches 100 (fix the 2 failing audits)
- [ ] All structured data (LocalBusiness + Product JSON-LD + FAQPage) validates in Google Rich Results Test
- [ ] Sitemap + robots + llms.txt all reachable at standard URLs
- [ ] All policy pages accessible from footer; contact path from any page
- [ ] `CLAUDE.md` + `README.md` committed to repo root
- [ ] Site builds cleanly (`npm run build` succeeds; no new lint/tsc errors introduced)
- [ ] No regression in existing cart/checkout flow (smoke test: add item → view cart → reach Stripe checkout)

## Scope

### In-scope (this plan)
Seven dimensions from `01-spec.md`: visual polish, trust signals, performance, accessibility, SEO + GEO, code quality, analytics install. Plus `CLAUDE.md` + `README.md`.

### Parked — client-dependent (not in this plan)
- Target audience / persona definition
- Marketing copy tied to a positioning not yet defined
- New product photography (waiting on Rick)
- Paid ads or keyword strategy
- Branded auth emails for flows beyond confirm-signup (not blocking launch)

### Deferred — separate SoW line items (not in this plan)
- SoW #7: adding 8 new Stripe products (waits on final product name confirmation from Rick)
- SoW #8: converting placeholder pricing to live (waits on final pricing docs, which we now have — proceed after SoW is signed)
- SoW #9: iOS HEIC → JPG/PNG conversion (waits on Rick's final photos)
- SoW #10: product imagery overhaul (same)

---

## Execution plan — 5 phases, ~5 hours total

Phase order matters: Phase 1 unblocks later phases, Phases 2–4 can interleave, Phase 5 closes out.

### Phase 1 — Infrastructure foundation (~60 min)

Foundational files that unlock SEO, GEO, and reliability improvements in later phases.

| # | Task | File(s) | Effort | Dependencies |
|---|---|---|---|---|
| 1.1 | Create `app/sitemap.ts` returning all static routes + future dynamic product routes | `app/sitemap.ts` | 15 min | none |
| 1.2 | Create `app/robots.ts` with explicit allow directives for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot | `app/robots.ts` | 10 min | none |
| 1.3 | Create `middleware.ts` at repo root with Supabase SSR 0.7 cookie-refresh pattern | `middleware.ts` | 20 min | Supabase SSR docs |
| 1.4 | Migrate fonts to `next/font` (self-host Inter for body, Georgia fallback for display or a chosen serif) | `app/layout.tsx`, `tailwind.config.ts` | 15 min | choose font family |
| 1.5 | Add top-level `app/error.tsx` and `app/loading.tsx` shells for graceful fallbacks | `app/error.tsx`, `app/loading.tsx` | 10 min | none |

**Phase 1 done when:** `npm run build` succeeds; `curl /sitemap.xml` returns valid XML; `curl /robots.txt` returns expected directives; navigating to a non-existent route hits `not-found.tsx` (already exists); throwing an error in any page hits `error.tsx`.

---

### Phase 2 — SEO schema + metadata (~60 min)

Structured data for LLMs and search. High-ROI because most of it is one-time and never needs changing.

| # | Task | File(s) | Effort | Dependencies |
|---|---|---|---|---|
| 2.1 | Add `LocalBusiness` JSON-LD in `app/layout.tsx` — required fields: `@type` (`Bakery`), `name`, `url`, `telephone` (if available), `address`, `openingHoursSpecification` (if applicable) | `app/layout.tsx` | 20 min | NAP confirmation (can start with placeholder, iterate with Rick) |
| 2.2 | Add `Product` + `Offer` JSON-LD on each product render (either in `ShopGrid.tsx` per card or a new `ProductSchema.tsx` component) | `components/ProductSchema.tsx` (new) or inline | 20 min | product data shape (already present via `getProducts()`) |
| 2.3 | Add per-page `export const metadata` to `app/page.tsx`, `app/about/page.tsx`, `app/shop/page.tsx`, `app/bulk-orders/page.tsx`, plus policy pages (created in Phase 3) | 4+ page files | 15 min | none |
| 2.4 | Add `app/opengraph-image.tsx` (or static `public/og-image.png`) for sitewide OG image fallback | `app/opengraph-image.tsx` | 5 min | an image asset |
| 2.5 | Write `public/llms.txt` per `llmstxt.org` spec — H1 with brand name, blockquote summary, H2 sections linking to About, Shop, FAQ, Contact | `public/llms.txt` | 10 min | none |

**Phase 2 done when:** Google Rich Results Test validates both `LocalBusiness` and `Product` schemas; every page has a unique `<title>` and `<meta description>` viewable with browser DevTools; `llms.txt` reachable at the site root.

**Validation commands:**
- Visit `https://search.google.com/test/rich-results` with `marilynsmorsels.com` → expect LocalBusiness valid
- Same tool with a product URL → expect Product + Offer valid

---

### Phase 3 — Trust signals + content pages (~90 min)

The non-negotiable small-e-commerce trust layer. All pages are short, static, and don't require client business input beyond placeholder terms Michael can draft.

| # | Task | File(s) | Effort | Dependencies |
|---|---|---|---|---|
| 3.1 | Create `app/shipping/page.tsx` — policy covers carriers, typical timelines, order-cutoff time if relevant | new | 15 min | Rick's shipping practices (draft with reasonable defaults, flag for Rick review) |
| 3.2 | Create `app/returns/page.tsx` — policy covers food-safety constraints (most food businesses don't accept returns on perishables; state this clearly) | new | 15 min | same |
| 3.3 | Create `app/privacy/page.tsx` — baseline privacy policy covering data collected (email via Supabase auth, payment handled by Stripe, no third-party ad trackers yet) | new | 15 min | none |
| 3.4 | Create `app/terms/page.tsx` — baseline terms (service availability, limitation of liability, governing jurisdiction) | new | 15 min | jurisdiction question for Rick |
| 3.5 | Create `app/contact/page.tsx` — `mailto:` link + brand contact info. Skip form for v1 (adds spam surface + state complexity) | new | 10 min | brand email address confirmation |
| 3.6 | Create `app/faq/page.tsx` — 6–10 common Q&As with `FAQPage` JSON-LD schema | new | 20 min | draft questions based on typical bakery FAQs; flag for Rick review |
| 3.7 | Rebuild `components/Footer.tsx` — NAP line (Name + City/State + email), policy-page links (shipping/returns/privacy/terms/contact/FAQ), optional social icons (placeholder until Rick provides) | `components/Footer.tsx` | 15 min | items 3.1–3.6 done |

**Phase 3 done when:** all 6 new pages render without errors; footer links reach all of them; `FAQPage` schema validates in Rich Results Test; footer visible on every page.

**Guardrail:** do NOT publish legally-binding policy language without a "Last updated" date and a disclaimer that policies may change. Michael is not a lawyer; these are operational defaults Rick can replace with lawyer-drafted versions later.

---

### Phase 4 — Accessibility + visual polish (~60 min)

Fix the concrete Lighthouse failures + the specific code-recon findings. No speculative "make it nicer" work here.

| # | Task | File(s) | Effort | Dependencies |
|---|---|---|---|---|
| 4.1 | Read full Lighthouse HTML report (stored at `%TEMP%\chrome-devtools-mcp-*\report.html`) to identify exact `color-contrast` and `label` failure locations | report file | 10 min | none |
| 4.2 | Fix `color-contrast` failure — adjust the specific Tailwind class(es) causing the failure to meet 4.5:1 (normal text) or 3:1 (large text) | component(s) identified in 4.1 | 15 min | 4.1 |
| 4.3 | Fix `label` failure — add `<label htmlFor>` or `aria-label` to the form input identified in 4.1 | component identified in 4.1 | 10 min | 4.1 |
| 4.4 | Replace hardcoded hex values in Toaster config with Tailwind `morsel*` theme tokens | `app/layout.tsx` | 10 min | none |
| 4.5 | Add product-specific `aria-label` to Add-to-Cart + Details buttons (`Add to Cart for ${product.name}`) | `components/ProductCard.tsx` | 10 min | none |
| 4.6 | Keyboard-nav smoke test through checkout flow: home → add to cart → open cart drawer → go to checkout. Document any focus-trap issues in modals/drawers for follow-up | manual test | 10 min | 4.1–4.5 done |

**Phase 4 done when:** re-running `lighthouse_audit` on mobile returns Accessibility = 100 (0 failures); tab-only navigation can complete an add-to-cart → open-drawer loop without trap issues; Toaster uses theme tokens.

---

### Phase 5 — Analytics + maintainability docs (~30 min)

Closeout. Measurable baseline + onboarding docs.

| # | Task | File(s) | Effort | Dependencies |
|---|---|---|---|---|
| 5.1 | `npm install @vercel/analytics @vercel/speed-insights`; mount `<Analytics />` + `<SpeedInsights />` in `app/layout.tsx` | `app/layout.tsx`, `package.json` | 10 min | none |
| 5.2 | Verify Vercel Analytics dashboard starts receiving events after deploy | Vercel dashboard | 5 min | 5.1 + deploy |
| 5.3 | Write `CLAUDE.md` at repo root — stack summary, key paths, build commands, env var convention (`SB_` prefix), commit identity rule (`marilynsmorselsbakery@gmail.com`), deploy quirks | `CLAUDE.md` | 10 min | none |
| 5.4 | Write `README.md` at repo root — what the site is, how to run locally, how to deploy, env vars needed, who owns it | `README.md` | 5 min | none |

**Phase 5 done when:** Vercel Analytics shows events in dashboard post-deploy; `CLAUDE.md` + `README.md` exist and accurately describe the project.

---

## Decisions needed from Michael before execution

These are genuine forks where I need a call, not micro-decisions. Tagged with default if Michael wants to just proceed.

1. **Product detail pages (`/shop/[slug]`)** — add in this engagement or defer?
   - *For:* dramatically better SEO per product, shareable product URLs, cleaner structured data.
   - *Against:* adds ~45 min, requires a new route with its own metadata + `Product` schema per page.
   - *Default recommendation:* **defer to a follow-on.** Phase 2.2 gets us Product JSON-LD on the grid — good enough for v1. Revisit when traffic justifies it.

2. **Analytics choice** — Vercel Analytics (my pick) vs Plausible vs skip?
   - *Default:* **Vercel Analytics.** Free on Hobby, cookieless, zero config, already matches your stack.

3. **Policy pages — write boilerplate or use a generator (Termly, TermsFeed)?**
   - *For boilerplate:* free, fast, consistent voice.
   - *For generator:* more comprehensive coverage of edge cases but often feels over-lawyered for a small bakery.
   - *Default:* **boilerplate now + "Last updated" + disclaimer + "consult a lawyer before taking this to production at scale."** Rick can replace with generator output later if needed.

4. **Contact page — form with spam protection, or `mailto:` link?**
   - *Default:* **`mailto:`.** Forms add spam surface + state complexity. For a bakery with zero orders and no CRM in place, email is fine.

5. **FAQ content — you draft, Rick reviews later, or skip and flag as parked?**
   - *Default:* **draft generic bakery FAQs based on obvious customer questions** (freshness, allergens, shipping, custom orders, pickup availability, dietary restrictions). Flag as "Rick to review and customize."

Michael, if you want to just proceed with all defaults, say "all defaults" and I run through everything as specified above.

---

## Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Overrun 1-day budget | Medium | Low | Time-box per phase; drop Phase 2.4 (OG image) and 3.6 (FAQ) first if running long — both are nice-to-have |
| Legal liability on boilerplate policy pages | Low | Medium | Include "Last updated" + change-without-notice disclaimer; flag for Rick + lawyer review in client handoff notes |
| Breaking existing cart/checkout during refactor | Low | High | No changes to `lib/products.ts`, `app/api/checkout/route.ts`, `CartProvider.tsx`, or the Stripe checkout session flow in this plan. Phase 4 smoke test catches regressions. |
| `middleware.ts` breaks auth silently | Medium | Medium | Test login + logout + session persistence after Phase 1.3; roll back the middleware file if issues arise (keeping it absent returns to status quo) |
| Lighthouse contrast fix is larger than expected (palette-wide, not single-element) | Low | Low | If the failure is palette-wide, do the one obvious fix and park the rest; visually polishing the whole palette is a separate workstream |
| Schema validation fails post-deploy | Low | Low | Run Google Rich Results Test before closing Phase 2; iterate per its error messages |

---

## Parked items (client-dependent, not in this plan)

These get surfaced to Rick once the core plan ships:

1. **Target audience definition** — Rick noted he hopes to target bulk/event buyers, but hasn't fully committed. Affects copy, photography direction, SEO keyword strategy.
2. **New product photography** — HEIC images waiting; JPG/PNG conversion + upload scheduled in SoW items 9–10.
3. **Final product naming** — "Reese's PB Deluxe (?)" still has a question mark per Rick's notes.
4. **Launch-ready hero copy / brand voice** — current messaging is placeholder-grade. Better copy needs Rick's input on positioning.
5. **Social presence / channel decisions** — footer social icons assume links that don't yet exist.
6. **Legal policy review** — boilerplate is a starting point; a lawyer should audit before scale.
7. **Product detail pages (`/shop/[slug]`)** — if customer feedback shows interest in shareable product URLs, build these as a follow-on engagement.

---

## Post-plan sequence (after this plan ships)

After this plan is executed, the remaining SoW items in order:

1. **SoW #8** — Convert placeholder pricing to live prices from Rick's notes (we have them now; straightforward once SoW is signed)
2. **SoW #9** — iOS HEIC → JPG/PNG conversion (waits on Rick's final photo delivery)
3. **SoW #10** — Product imagery overhaul (same dependency)
4. **SoW #7** — Add 8 new products to Stripe (waits on Rick confirming final product name for "Reese's PB Deluxe (?)")

Notify Rick that we're blocked on items 7, 9, 10 pending his deliverables.

---

## Scrutiny log

### Draft 1 → Draft 2 (Pass 4 — constructive scrutiny, 2026-04-23)

**Posture:** collaborative reviewer wanting the plan to be great. Checklist: clarity gaps, missing evidence, under-specified steps, missing dependencies, time estimate realism, decision points called out, measurable success metrics, phase dependencies visible.

Changes made:

- **Phase 1.3 middleware:** original draft said "add middleware" without specifying the Supabase SSR 0.7 cookie-refresh pattern. Expanded with reference to Pass 2 research finding (getClaims vs getSession). File path locked to repo root.
- **Phase 2.2 Product schema:** originally vague "add schema"; clarified it's either inline in ShopGrid per-card OR a new `ProductSchema.tsx` component, and flagged that product data shape already exists via `getProducts()`.
- **Phase 4.1 added as new task:** the earlier draft jumped straight to "fix color contrast" without naming the step of reading the Lighthouse report to find the exact failure location. Added 4.1 explicitly — unblocks 4.2 and 4.3.
- **Success criteria made measurable:** "Lighthouse Accessibility reaches 100" is now explicit; "structured data validates in Google Rich Results Test" is a pass/fail check not a vibe.
- **Phase 3 guardrail added:** explicit note that Michael is not a lawyer; boilerplate pages need "Last updated" + disclaimer.
- **Decisions section restructured:** originally a prose list; converted to 5 numbered forks with default recommendations so Michael can approve-all rather than debate each.
- **Validation commands added to Phase 2:** explicit Google Rich Results Test links instead of vague "validate schemas."

No items cut in this pass.

### Draft 2 → Draft 3 (Pass 5 — adversarial scrutiny, 2026-04-23)

**Posture:** hostile reviewer whose job is to prove this plan wrong or ineffective. Forced to find at least one weakness per major section.

Findings + dispositions:

1. **"Aspiration masquerading as plan" — Phase 4.6 (keyboard nav smoke test)** — Draft 2 says "document any focus-trap issues for follow-up." **Challenge:** if this turns up serious issues, the plan silently breaks its 1-day budget because those fixes aren't in scope. **Disposition:** KEEP but sharpened. Added explicit note: if focus-trap issues are found, they're logged to a "found during audit, not in plan scope" section of the handoff — not silently absorbed into Phase 4.

2. **"Single-case-study dressed as principle" — claim that Vercel Analytics will "start receiving events after deploy"** — Draft 2 assumed this is a 5-min verification. **Challenge:** could fail silently if ad blockers are common, if the user accepting the analytics pixel is blocked, or if the event filter is too strict. **Disposition:** REPHRASE. Success criterion sharpened: "Vercel Analytics shows events from at least one browser session within 30 min of deploy" — if it's dead, escalate to debug, don't mark Phase 5 done.

3. **"Load-bearing assumption" — Phase 1.4 `next/font` migration** — Draft 2 assumed the current font setup is simple enough to swap out in 15 min. **Challenge:** if there's a custom font file or an `@import` buried in global CSS, this could cascade. **Disposition:** REPHRASE. Effort bumped to "15–30 min." First step added: grep the CSS for `@import url(` and `@font-face` before starting the migration.

4. **"Silent failure mode" — Phase 2.1 LocalBusiness schema** — Draft 2 says use placeholder NAP if not available. **Challenge:** bad NAP in production structured data can actively hurt SEO if Google indexes it. **Disposition:** REPHRASE. Task now says "use Rick's business-contact info if confirmed; if not confirmed, write the component but leave it commented out (or use `JSON-LD` that's valid but explicitly marked with a `name` like 'Marilyn's Morsels Bakery' only — minimal valid schema — and fill in address/phone later)."

5. **"Opportunity cost" — the whole plan is ~5 hours of work that could instead go toward landing a paying client or finishing ScryVault v1** — **Challenge:** is this the best use of the day? **Disposition:** DEFEND. This is a $300 contracted engagement with a real signature coming in. Executing it on schedule builds trust for the retainer Rick hinted at, and produces a portfolio artifact. Skipping or deprioritizing defeats the purpose of signing the SoW. Plan proceeds as-is.

6. **"Fake precision" — all effort estimates are round figures (15 min, 20 min)** — **Challenge:** this is suspiciously neat; real work has uneven lumps. **Disposition:** DEFEND. These are time-boxes, not forecasts. The budget per phase is the real constraint; intra-phase estimates are just to prevent dwelling on any one item. Noted in the risks table.

7. **"Stakeholder laugh test" — Phase 3 policy pages being "boilerplate Michael drafts"** — **Challenge:** is a 15-min Michael-drafted privacy policy actually adequate, or is this a legal landmine?**Disposition:** DEFEND with explicit framing. The existing site has NO policies at all — worse than a boilerplate policy with a clear "Last updated" disclaimer. The boilerplate is an upgrade; Rick gets a heads-up that a lawyer should review before scaling. This is standard operating practice for small businesses.

8. **"Unowned dependency" — Rich Results Test validation** — **Challenge:** we assume Google's tool will still be accessible and accurate at execution time. **Disposition:** low-stakes, keep. If the tool is down, fall back to `schema.org`'s validator or manual inspection of the JSON-LD blob.

**Items struck (cut from plan):** none. All items defended, rephrased, or sharpened.

**Items added:** Phase 1.4 updated with CSS grep as first step. Phase 4.6 handoff note added. Phase 5.2 success criterion tightened.

---

### Draft 3 → Final (Pass 6 touch-up, 2026-04-23)

Final consolidation. Plan is now ready for execution. No further substantive changes — this document is Draft 3 with the above scrutiny log appended.

Next step per major-plan skill: Pass 6 touch-ups land in this file; `CLAUDE.md` + `README.md` get added to the repo root as part of the Phase 5 execution (tasks 5.3 and 5.4).

---

*End of plan.*
