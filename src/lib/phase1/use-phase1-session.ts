"use client";

import { useEffect, useState, useCallback } from "react";
import type { Profile, Seller } from "@routefarm/shared";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

export type Phase1Session = {
  userId: string;
  email: string;
  displayName: string;
  profile: Profile;
  seller: Seller | null;
};

const DEMO_SESSION = {
  enabled: false,
  session: null as Phase1Session | null,
  loading: false,
  isAuthenticated: false,
  isSeller: false,
  isAdmin: false,
  isBuyer: false,
};

const noopRefresh = async () => {};

export function usePhase1Session() {
  const liveAuth = isPhase1SupabaseEnabled();
  const [session, setSession] = useState<Phase1Session | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!liveAuth) return;

    setLoading(true);
    try {
      const { createClient } = await import("@routefarm/supabase/browser");
      const { getSellerByUserId } = await import("@routefarm/database");
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setSession(null);
        return;
      }

      const user = data.user;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        setSession(null);
        return;
      }

      let seller: Seller | null = null;
      if ((profile as Profile).role === "seller") {
        seller = await getSellerByUserId(supabase, user.id);
      }

      setSession({
        userId: user.id,
        email: user.email ?? "",
        displayName:
          (profile as Profile).full_name ?? user.email?.split("@")[0] ?? "Member",
        profile: profile as Profile,
        seller,
      });
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [liveAuth]);

  useEffect(() => {
    if (!liveAuth) return;
    void refresh();
  }, [liveAuth, refresh]);

  if (!liveAuth) {
    return { ...DEMO_SESSION, refresh: noopRefresh };
  }

  return {
    enabled: true,
    session,
    loading,
    isAuthenticated: !!session,
    isSeller: session?.profile.role === "seller",
    isAdmin: session?.profile.role === "admin",
    isBuyer: session?.profile.role === "buyer",
    refresh,
  };
}
