import { createServerClient } from "@supabase/ssr";
import type { CookieToSet } from "@routefarm/supabase/cookies";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";
import { needsBuyerOnboarding, needsSellerOnboarding, postAuthRedirect } from "@routefarm/shared";
import type { Profile } from "@routefarm/shared";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"];
const PUBLIC_API_PREFIXES = ["/api/phase1/feed"];
const AUTH_ROUTES = ["/login", "/signup", "/auth/callback"];

export async function middleware(request: NextRequest) {
  if (!isPhase1SupabaseEnabled()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublicApi = PUBLIC_API_PREFIXES.some((p) => path.startsWith(p));
  const isProtected =
    !isPublicApi && PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => path.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute && path !== "/auth/callback") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    url.pathname = profile ? postAuthRedirect(profile as Profile) : "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user && path.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, seller_onboarding_completed_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && needsSellerOnboarding(profile as Profile)) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding/seller";
      return NextResponse.redirect(url);
    }
  }

  if (user && path === "/") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, buyer_onboarding_completed_at, seller_onboarding_completed_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && needsBuyerOnboarding(profile as Profile)) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding/buyer";
      return NextResponse.redirect(url);
    }
  }

  if (user && path.startsWith("/onboarding")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, buyer_onboarding_completed_at, seller_onboarding_completed_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      const done =
        profile.role === "buyer"
          ? !!profile.buyer_onboarding_completed_at
          : profile.role === "seller"
            ? !!profile.seller_onboarding_completed_at
            : true;
      if (done) {
        const url = request.nextUrl.clone();
        url.pathname = profile.role === "seller" ? "/dashboard" : "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
