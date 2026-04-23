import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase SSR 0.7 cookie-refresh middleware.
 * Refreshes the user's auth session on every request so it never silently expires.
 * Uses getClaims() pattern (JWT-validated) rather than getSession() (not safe server-side).
 *
 * Env vars used (SB_ prefix — Vercel integration convention, do NOT rename):
 *   NEXT_PUBLIC_SB_SUPABASE_URL
 *   NEXT_PUBLIC_SB_SUPABASE_PUBLISHABLE_KEY
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SB_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SB_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — this keeps the cookie-based token alive.
  // Using getUser() which internally validates JWT; safer than getSession().
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     * - public files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|heic|ico|css|js)$).*)",
  ],
};
