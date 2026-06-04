"use client";

import { postAuthRedirect } from "@routefarm/shared";
import type { Profile } from "@routefarm/shared";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

async function fetchProfileWithRetry(userId: string, attempts = 5) {
  const { createClient } = await import("@routefarm/supabase/browser");
  const supabase = createClient();
  for (let i = 0; i < attempts; i++) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (profile) return profile as Profile;
    await new Promise((r) => setTimeout(r, 200 * (i + 1)));
  }
  return null;
}

export async function signInWithEmail(email: string, password: string) {
  if (!isPhase1SupabaseEnabled()) {
    return { error: "Supabase auth is disabled in local demo mode." };
  }
  const { createClient } = await import("@routefarm/supabase/browser");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  if (data.user) {
    const profile = await fetchProfileWithRetry(data.user.id);
    return {
      redirect: profile ? postAuthRedirect(profile) : "/",
    };
  }
  return { redirect: "/" };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  role: "buyer" | "seller"
) {
  if (!isPhase1SupabaseEnabled()) {
    return { error: "Supabase auth is disabled in local demo mode." };
  }
  const { createClient } = await import("@routefarm/supabase/browser");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });
  if (error) return { error: error.message };
  if (data.user) {
    const profile = await fetchProfileWithRetry(data.user.id);
    return {
      redirect: profile
        ? postAuthRedirect(profile)
        : role === "seller"
          ? "/onboarding/seller"
          : "/onboarding/buyer",
    };
  }
  return {
    redirect: role === "seller" ? "/onboarding/seller" : "/onboarding/buyer",
  };
}

export async function signOutSupabase() {
  if (!isPhase1SupabaseEnabled()) return;
  const { createClient } = await import("@routefarm/supabase/browser");
  const supabase = createClient();
  await supabase.auth.signOut();
}
