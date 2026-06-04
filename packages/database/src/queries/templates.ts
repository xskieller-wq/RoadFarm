import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductTemplate } from "@routefarm/shared";

export async function listProductTemplates(
  supabase: SupabaseClient,
  sellerId: string
): Promise<ProductTemplate[]> {
  const { data, error } = await supabase
    .from("product_templates")
    .select("*")
    .eq("seller_id", sellerId)
    .eq("is_active", true)
    .order("category");
  if (error) throw error;
  return (data ?? []) as ProductTemplate[];
}

export async function createProductTemplate(
  supabase: SupabaseClient,
  sellerId: string,
  input: Omit<ProductTemplate, "id" | "seller_id" | "is_active"> & { is_active?: boolean }
): Promise<ProductTemplate> {
  const { data, error } = await supabase
    .from("product_templates")
    .insert({
      seller_id: sellerId,
      category: input.category,
      title: input.title,
      description: input.description,
      default_price_cents: input.default_price_cents,
      default_freshness_label: input.default_freshness_label,
      default_quantity: input.default_quantity,
      image_url: input.image_url,
      is_active: input.is_active ?? true,
    })
    .select()
    .single();
  if (error) throw error;

  await supabase
    .from("seller_onboarding_steps")
    .update({ first_template: true })
    .eq("seller_id", sellerId);

  return data as ProductTemplate;
}

export async function createProductFromTemplate(
  supabase: SupabaseClient,
  sellerId: string,
  templateId: string
): Promise<{ id: string }> {
  const { data: template, error: tErr } = await supabase
    .from("product_templates")
    .select("*")
    .eq("id", templateId)
    .eq("seller_id", sellerId)
    .single();
  if (tErr) throw tErr;

  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: sellerId,
      template_id: templateId,
      title: template.title,
      description: template.description,
      category: template.category,
      price_cents: template.default_price_cents,
      quantity_available: template.default_quantity,
      freshness_label: template.default_freshness_label,
      image_url: template.image_url,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}
