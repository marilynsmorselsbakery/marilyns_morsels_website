## Marilyn’s Morsels

Small-batch cookie shop for Marilyn’s home kitchen bakery. Built with Next.js App Router, Tailwind CSS, and Stripe Checkout for fast, modern ecommerce.

### Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with custom brand palette
- Stripe Checkout for payments
- Bulk inquiry form posts to an email service placeholder

### Getting Started
```bash
npm install
npm run dev
# visit http://localhost:3000
```

### Environment
Create `.env.local` with:
```
STRIPE_SECRET_KEY=sk_test_or_live_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Stripe Configuration
1. Create Products/Prices in Stripe for each pack (IDs must match `lib/products.ts`).
2. Use test mode keys while developing.
3. Checkout sessions redirect to `/success` or `/cancel`.

### Supabase Setup
Run the following SQL in Supabase to create the profile table that stores customer details and the Stripe linkage:
```sql
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  stripe_customer_id text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using ((select auth.uid()) = id);

create policy "Users can upsert own profile"
  on profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update own profile"
  on profiles for update
  using ((select auth.uid()) = id);
```

### Bulk Inquiries
`app/api/bulk-inquiry/route.ts` currently logs submissions. Replace the TODO with Resend, Formspree, or another transactional email service to notify Marilyn in production.

### Scripts
- `npm run dev` – local development
- `npm run lint` – ESLint (Next core web vitals)
- `npm run build` – production build

### Deployment
Deploy on Vercel. Add the environment variables above (including live Stripe keys) in the Vercel project settings. Set the domain in `NEXT_PUBLIC_BASE_URL`.
