import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const allowedFields = [
  "full_name",
  "phone",
  "address_line1",
  "address_line2",
  "city",
  "state",
  "postal_code",
] as const;

type ProfilePayload = Pick<Profile, (typeof allowedFields)[number]>;

const sanitizePayload = (data: unknown): ProfilePayload => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid profile payload");
  }

  const sanitized: Partial<ProfilePayload> = {};

  for (const field of allowedFields) {
    const value = (data as Record<string, unknown>)[field];
    if (value === undefined || value === null) {
      sanitized[field] = "";
      continue;
    }
    if (typeof value !== "string") {
      throw new Error(`Invalid value for ${field}`);
    }
    sanitized[field] = value.trim();
  }

  return sanitized as ProfilePayload;
};

export async function GET() {
  const supabase = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to fetch profile", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

export async function PUT(request: NextRequest) {
  const supabase = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ProfilePayload;

  try {
    const body = await request.json();
    payload = sanitizePayload(body);
  } catch (error) {
    console.error("Invalid profile payload", error);
    return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single<Profile>();

  if (error) {
    console.error("Failed to update profile", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

