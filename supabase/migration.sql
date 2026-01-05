-- Supabase Migration Script
-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- Create profiles table
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

-- Enable Row Level Security on profiles
alter table profiles enable row level security;

-- Create RLS policies for profiles
create policy "Users can read own profile"
  on profiles for select
  using ((select auth.uid()) = id);

create policy "Users can upsert own profile"
  on profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update own profile"
  on profiles for update
  using ((select auth.uid()) = id);

-- Create orders table
create table if not exists orders (
  id text primary key,
  supabase_user_id uuid references auth.users(id) on delete set null,
  product_ids text,
  amount_total bigint,
  currency text,
  payment_status text,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Enable Row Level Security on orders
alter table orders enable row level security;

-- Create RLS policy for orders
create policy "Users can read own orders"
  on orders for select
  using ((select auth.uid()) = supabase_user_id);

