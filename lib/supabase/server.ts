import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
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

const getSupabaseSecretKey = () => {
  const secretKey = process.env.SB_SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SB_SUPABASE_SECRET_KEY is not set");
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

