import type { HomeFeedItem } from "@routefarm/shared";
import type { Product, Seller } from "@/lib/types";

export function productsToMockDrops(products: Product[], sellers: Seller[]): HomeFeedItem[] {
  const sellerById = new Map(sellers.map((s) => [s.id, s]));

  return products.map((p) => {
    const seller = sellerById.get(p.sellerId);
    return {
      id: `mock-feed-${p.id}`,
      product_id: p.id,
      seller_id: p.sellerId,
      title: p.title,
      category: p.category,
      price_cents: Math.round(p.price * 100),
      freshness_label: p.freshnessLabel ?? "Made Today",
      image_url: null,
      seller_name: seller?.name ?? "Local baker",
      seller_slug: seller?.slug ?? "baker",
      seller_city: seller?.city ?? seller?.neighborhood ?? null,
      published_at: new Date().toISOString(),
    };
  });
}
