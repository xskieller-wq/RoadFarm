import { createServerClient } from "@supabase/ssr";
import type { CookieToSet } from "@routefarm/supabase/cookies";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { postAuthRedirect } from "@routefarm/shared";
import type { Profile } from "@routefarm/shared";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!isPhase1SupabaseEnabled()) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        const redirectPath = profile
          ? postAuthRedirect(profile as Profile)
          : next;
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
