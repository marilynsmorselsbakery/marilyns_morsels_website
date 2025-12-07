-- Fix RLS policy performance issue
-- Replaces auth.uid() with (select auth.uid()) to avoid re-evaluation per row
-- This optimizes query performance at scale

-- Drop existing policies
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can upsert own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Recreate policies with optimized subquery syntax
create policy "Users can read own profile"
  on profiles for select
  using ((select auth.uid()) = id);

create policy "Users can upsert own profile"
  on profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update own profile"
  on profiles for update
  using ((select auth.uid()) = id);

