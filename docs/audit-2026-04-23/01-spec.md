# Marilyn's Morsels — Audit Plan Brainstorm Spec

**Date:** 2026-04-23
**Owner:** Michael Caldwell
**Client:** Marilyn's Morsels
**Site:** https://marilynsmorsels.com
**Repo:** `marilynsmorselsbakery/marilyns_morsels_website`

This is Pass 1 (brainstorming) of a six-pass `major-plan` run. It locks scope, methodology, and deliverables for a focused audit + improvement plan. Research (Pass 2), drafting (Pass 3), scrutiny (Passes 4–5), and the final plan (Pass 6) all flow from this spec.

---

## Context

- Site is live; **zero orders to date**.
- One of MBC's earlier builds. Not a deep refactor target — a pragmatic audit + polish pass.
- **No analytics installed**; traffic reality unknown, assumed close to dark.
- Client has not yet defined target audience / positioning. MBC's current engagement is **web dev only — build + maintain**. Scope may expand if client puts MBC on retainer, which has been signaled but not yet contracted.

## Purpose

Deliver a ranked, MBC-executable improvement plan for marilynsmorsels.com that:

- Can be worked through in roughly one focused day
- Produces measurable lift in professionalism + technical foundation
- Is portfolio-worthy (before/after demonstrable)

## Success criteria

- [ ] All seven audit dimensions covered with top-three wins each
- [ ] Every recommendation MBC can execute unilaterally with existing assets — no client-business-decision dependencies
- [ ] Client-dependent recommendations surfaced in a separate parked-items section, not blocking core plan
- [ ] Concrete effort estimate and ROI tag on each item
- [ ] Final plan survives constructive (Pass 4) and adversarial (Pass 5) scrutiny
- [ ] Repo gets `CLAUDE.md` + `README.md` as Pass 6 touch-up

## Scope

### In-scope (core plan)

- **Visual polish** — typography, spacing, hierarchy, mobile layout
- **Trust signals** — footer, about, shipping/returns, FAQ, NAP consistency, policies
- **Performance** — Core Web Vitals, image optimization, bundle, font loading
- **Accessibility** — contrast, keyboard nav, semantic HTML, alt text, ARIA
- **SEO + GEO basics** — metadata, OG images, `sitemap.xml`, `robots.txt`, `schema.org/LocalBusiness`, `schema.org/FAQPage`, `llms.txt`, answer-formatted copy
- **Code quality + maintainability** — eslint/tsc warnings, dead code, pre-refactor rust, duplicated logic, docs
- **Analytics install** — foundation so the next audit has data instead of guesses

### Out-of-scope (parked — client-dependent)

- Target audience / persona definition
- New copy tied to a specific positioning
- New photography / brand direction changes
- Paid ads / keyword strategy tied to positioning

These surface as a parked-items section in the final plan. They do not block execution of the core plan.

### Deferred (scheduled follow-on work — not this audit)

- New Stripe product additions (awaiting pricing docs from client)
- iOS HEIC → JPG/PNG conversion for Stripe product images
- Any scope expansion if client retainer materializes

## Approach — "small-caliber shotgun"

Top ~3 wins from each of seven dimensions, ranked by ROI. Rationale: a portfolio-visible site with a passive client benefits more from broad visible competence than from deep work in one direction that leaves another direction obviously weak.

### Dimensions

1. **Visual polish** — typography, spacing/whitespace rhythm, hero hierarchy, consistent styling across pages, mobile layout nits
2. **Trust signals** — footer completeness, about page, shipping/returns clarity, FAQ, NAP consistency, policies, contact
3. **Performance** — Core Web Vitals, image opt (lazy load, sizing, format), bundle, font loading
4. **Accessibility** — contrast ratios, keyboard nav, semantic HTML, alt text, ARIA where needed
5. **SEO + GEO** — metadata, OG images, `sitemap.xml`, `robots.txt` (explicit AI-crawler posture), `schema.org/LocalBusiness`, `schema.org/FAQPage`, `llms.txt`, answer-formatted copy
6. **Code quality + maintainability** — eslint/tsc, dead code, pre-refactor rust, duplicated logic, `CLAUDE.md`, `README.md`
7. **Analytics install** — foundation (Plausible, Vercel Analytics, or GA4 — choice TBD in Pass 2)

### GEO framing

Generative Engine Optimization at this scale is a thin layer on top of good SEO; ~80% overlap. Expectation: *not* "rank in AI answers for competitive queries" — rather, "if an AI is asked about Marilyn's Morsels directly, it returns accurate info, not hallucinations or omissions." Marginal GEO work (FAQ schema, `llms.txt`, AI-crawler `robots.txt` posture, NAP consistency, answer-formatted copy) folds into the SEO dimension for roughly one extra hour of total effort.

## Methodology

1. **Live-site recon** — Lighthouse, axe (a11y), manual walkthrough of all 11 routes (`/`, `/about`, `/shop`, `/checkout`, `/bulk-orders`, `/account`, `/login`, `/signup`, `/success`, `/cancel`, `not-found`) on desktop + mobile
2. **Code recon** — focused read of `app/`, `components/`, `lib/` for pre-refactor rust and inconsistencies
3. **Research (Pass 2)** — 2026 best practices per dimension on the current stack: Next.js 15.5.7, React 19.2.1, Tailwind 3.4, Supabase SSR 0.7, Stripe 16
4. **Draft plan (Pass 3)** — ranked list per bucket, effort + ROI per item
5. **Constructive scrutiny (Pass 4)** — clarity, evidence, specificity, measurability
6. **Adversarial scrutiny (Pass 5)** — kill list, aspiration-vs-plan check, single-data-point checks
7. **Final plan (Pass 6)** — committed, scrutiny log appended, `CLAUDE.md` + `README.md` added to repo root

## Deliverables

| Artifact | Path |
|---|---|
| Brainstorm spec (this doc) | `docs/audit-2026-04-23/01-spec.md` |
| Research notes | `docs/audit-2026-04-23/02-research.md` |
| Final audit plan + scrutiny log | `docs/audit-2026-04-23/03-plan.md` |
| Parked-items list | Section of `03-plan.md` |
| `CLAUDE.md` | Repo root (Pass 6) |
| `README.md` | Repo root (Pass 6) |

## Assumptions / constraints

- MBC executes the plan himself. Subagents may be used for research gathering in Pass 2 but not for execution.
- Budget: ~1 day of focused work.
- No new recurring costs — all tooling free-tier or already-paid.
- Existing product assets only — no new photography or copy input from client expected for this audit.

## Open questions

None as of 2026-04-23. Design approved; proceeding to Pass 2 research after MBC reviews this spec.

## Sign-off

- [x] MBC approval (design) — 2026-04-23
- [ ] MBC approval (written spec) — pending review
