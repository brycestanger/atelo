import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth session on every request and re-writes the auth
 * cookies. Without this, server components read a stale/absent session — which
 * is why a freshly signed-in studio could fall through to demo data. Runs only
 * when Supabase is configured; otherwise it's a no-op passthrough (demo mode).
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: unknown }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.cookies.set(name, value, options as any),
        );
      },
    },
  });

  // Touch the session so expired access tokens refresh into the response cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on everything except static assets and image files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
