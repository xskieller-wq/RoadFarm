"use client";

import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";
import { signOutSupabase } from "@/lib/phase1/auth-actions";

export async function logoutAll(demoLogout: () => void) {
  if (isPhase1SupabaseEnabled()) {
    try {
      await signOutSupabase();
    } catch {
      /* Supabase offline — local logout still proceeds */
    }
  }
  demoLogout();
}
