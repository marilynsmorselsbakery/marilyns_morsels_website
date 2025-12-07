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

const getSupabaseAnonKey = () => {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }
  return anonKey;
};

const getSupabaseServiceRoleKey = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return serviceRoleKey;
};

const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
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
  createClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

export const createSupabaseServiceAnonClient = (): SupabaseClient<Database> =>
  createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

