"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  return url;
};

const getSupabasePublishableKey = () => {
  // Use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (new format)
  // See: https://github.com/orgs/supabase/discussions/29260
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set");
  }
  return publishableKey;
};

export type SupabaseBrowserClient = SupabaseClient<Database>;

export const createSupabaseBrowserClient = (): SupabaseBrowserClient =>
  createBrowserClient<Database>(getSupabaseUrl(), getSupabasePublishableKey());

