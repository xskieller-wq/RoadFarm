import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product, Seller } from "@routefarm/shared";

export async function getProductById(
  supabase: SupabaseClient,
  productId: string
): Promise<{ product: Product; seller: Seller } | null> {
  const { data: product, error: pErr } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();
  if (pErr) throw pErr;
  if (!product) return null;

  const { data: seller, error: sErr } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", product.seller_id)
    .maybeSingle();
  if (sErr) throw sErr;
  if (!seller) return null;

  return { product: product as Product, seller: seller as Seller };
}

export async function getProductsBySellerId(
  supabase: SupabaseClient,
  sellerId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .eq("sold", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Product[];
}
