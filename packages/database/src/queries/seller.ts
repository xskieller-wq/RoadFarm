import type { SupabaseClient } from "@supabase/supabase-js";
import type { Seller, SellerType } from "@routefarm/shared";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getSellerBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Seller | null> {
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Seller | null;
}

/** Resolve public seller routes that use either slug or legacy UUID id. */
export async function getSellerBySlugOrId(
  supabase: SupabaseClient,
  slugOrId: string
): Promise<Seller | null> {
  const bySlug = await getSellerBySlug(supabase, slugOrId);
  if (bySlug) return bySlug;

  if (!UUID_RE.test(slugOrId)) return null;

  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", slugOrId)
    .maybeSingle();
  if (error) throw error;
  return data as Seller | null;
}

export async function getSellerByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Seller | null> {
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Seller | null;
}

export async function createSellerProfile(
  supabase: SupabaseClient,
  userId: string,
  input: {
    slug: string;
    name: string;
    tagline?: string;
    bio?: string;
    seller_type: SellerType;
    city: string;
    neighborhood?: string;
    address?: string;
    lat: number;
    lng: number;
    specialties?: string[];
  }
): Promise<Seller> {
  const { data, error } = await supabase
    .from("sellers")
    .insert({
      user_id: userId,
      slug: input.slug,
      name: input.name,
      tagline: input.tagline ?? null,
      bio: input.bio ?? null,
      seller_type: input.seller_type,
      city: input.city,
      neighborhood: input.neighborhood ?? null,
      address: input.address ?? null,
      lat: input.lat,
      lng: input.lng,
      specialties: input.specialties ?? [],
      approval_status: "pending",
    })
    .select()
    .single();
  if (error) throw error;

  await supabase.from("seller_onboarding_steps").insert({ seller_id: data.id });

  return data as Seller;
}

export async function completeSellerOnboarding(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ seller_onboarding_completed_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}
