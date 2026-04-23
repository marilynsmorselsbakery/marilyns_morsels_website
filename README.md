# Marilyn's Morsels

E-commerce storefront for **Marilyn's Morsels Bakery** — live at [marilynsmorsels.com](https://marilynsmorsels.com).

## Stack

- **Framework:** Next.js 15 (App Router)
- **Runtime:** React 19, TypeScript 5
- **Styling:** Tailwind CSS 3.4 (custom `morsel*` brand palette)
- **Auth + orders:** Supabase (SSR adapter, row-level security)
- **Payments:** Stripe Checkout (live catalog fetched at runtime, cached 1h)
- **Hosting:** Vercel (Marilyn's Morsels team, Hobby tier)

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with required variables (see below)

# 3. Run dev server
npm run dev
# visit http://localhost:3000
```

### Required environment variables

Supabase (auto-populated in deployed environments by the Vercel–Supabase integration):

- `NEXT_PUBLIC_SB_SUPABASE_URL`
- `NEXT_PUBLIC_SB_SUPABASE_PUBLISHABLE_KEY`
- `SB_SUPABASE_SECRET_KEY`

Stripe + base URL:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL` (e.g., `http://localhost:3000` for dev, `https://marilynsmorsels.com` for prod)

Never commit real keys. `.env.local` is gitignored.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Run the production build locally |
| `npm run lint` | ESLint (Next core web vitals preset) |

## Architecture notes

- **Product catalog** is fetched from Stripe at runtime and cached for 1 hour via Next.js `unstable_cache` (tag: `products`). To add/edit products, use the Stripe dashboard — no code change or redeploy required.
- **Cart** renders from a client-side snapshot (productId, name, description, price, quantity). Checkout re-fetches live pricing server-side before building the Stripe session — ensures the latest prices are charged even if the cart was built from cached data.
- **Auth** is handled by Supabase. The SSR adapter keeps sessions synced between server and client components.
- **Supabase schema** (profiles + orders) is managed via migrations in `supabase/` and applied via the Vercel–Supabase integration.

## Deployment

- **Host:** Vercel, team `Marilyn's Morsels` (Hobby tier)
- **Production:** pushes to `main` auto-deploy to `marilynsmorsels.com`
- **Preview:** any other branch gets an auto-generated preview URL
- **Commit authorship:** commits must be authored from `marilynsmorselsbakery@gmail.com` (the Vercel team owner). This is preconfigured in the local repo's git config — do not change it.

## Support

Work requests, bugs, questions — contact Michael Caldwell (Automatonic) at `admin@automatonic.dev`.

## License

Proprietary. All rights reserved by Marilyn's Morsels Bakery.
