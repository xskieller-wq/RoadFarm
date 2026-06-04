import type { SupabaseClient } from "@supabase/supabase-js";
import type { BuyerProfile, Profile } from "@routefarm/shared";

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function completeBuyerOnboarding(
  supabase: SupabaseClient,
  userId: string,
  input: {
    neighborhood: string;
    city?: string;
    preferred_categories: string[];
  }
): Promise<void> {
  const { error: buyerError } = await supabase.from("buyer_profiles").upsert({
    user_id: userId,
    neighborhood: input.neighborhood,
    city: input.city ?? "Norridge",
    preferred_categories: input.preferred_categories,
    updated_at: new Date().toISOString(),
  });
  if (buyerError) throw buyerError;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ buyer_onboarding_completed_at: new Date().toISOString() })
    .eq("id", userId);
  if (profileError) throw profileError;
}

export async function getBuyerProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<BuyerProfile | null> {
  const { data, error } = await supabase
    .from("buyer_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as BuyerProfile | null;
}
