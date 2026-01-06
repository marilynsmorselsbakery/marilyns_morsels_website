import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
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

const getSupabaseSecretKey = () => {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not set");
  }
  return secretKey;
};

const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
    },
  });
};

export const createSupabaseServerComponentClient = async (): Promise<SupabaseClient<Database>> =>
  createServerSupabaseClient();

export const createSupabaseServerActionClient = async (): Promise<SupabaseClient<Database>> =>
  createServerSupabaseClient();

export const createSupabaseRouteHandlerClient = async (): Promise<SupabaseClient<Database>> =>
  createServerSupabaseClient();

export const createSupabaseServiceRoleClient = (): SupabaseClient<Database> =>
  createClient<Database>(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

export const createSupabaseServiceAnonClient = (): SupabaseClient<Database> =>
  createClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

