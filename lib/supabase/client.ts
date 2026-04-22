"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SB_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SB_SUPABASE_URL is not set");
  }
  return url;
};

const getSupabasePublishableKey = () => {
  const publishableKey = process.env.NEXT_PUBLIC_SB_SUPABASE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_SB_SUPABASE_PUBLISHABLE_KEY is not set");
  }
  return publishableKey;
};

export type SupabaseBrowserClient = SupabaseClient<Database>;

export const createSupabaseBrowserClient = (): SupabaseBrowserClient =>
  createBrowserClient<Database>(getSupabaseUrl(), getSupabasePublishableKey());

