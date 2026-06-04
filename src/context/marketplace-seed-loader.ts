import type { MarketplaceState } from "@/context/marketplace-store";
import type { SellerReview } from "@/lib/types";
import { normalizeMarketplaceState } from "@/lib/marketplace-persistence";

/** Loaded on the client after mount — keeps seed-data out of the root layout chunk. */
export async function loadSeedMarketplaceState(): Promise<MarketplaceState> {
  const { sellers, products } = await import("@/data/seed-data");

  const initialReviews: SellerReview[] = sellers.slice(0, 12).flatMap((s, i) => [
    {
      id: `rev-${s.id}-1`,
      sellerId: s.id,
      authorName: ["Maria K.", "James T.", "Sarah L.", "David R."][i % 4],
      rating: 5,
      text: "Always fresh and exactly as described. Love supporting a neighbor!",
      createdAt: "2024-11-12T10:00:00Z",
      visible: true,
    },
    {
      id: `rev-${s.id}-2`,
      sellerId: s.id,
      authorName: ["Anna P.", "Mike S.", "Lisa W.", "Tom H."][i % 4],
      rating: s.rating >= 4.8 ? 5 : 4,
      text: "Beautiful garden — you can tell they care about what they grow.",
      createdAt: "2024-10-05T14:30:00Z",
      visible: true,
    },
  ]);

  return normalizeMarketplaceState({
    sellers: sellers.map((s) => ({ ...s })),
    products: products.map((p) => ({ ...p, photos: [...p.photos] })),
    reviews: initialReviews,
    reports: [
      {
        id: "rep-1",
        type: "product",
        targetId: "p1",
        targetName: "Farm Fresh Dozen Eggs",
        reason: "Quantity mismatch at pickup",
        status: "open",
        createdAt: "2024-12-01T09:00:00Z",
      },
    ],
  });
}
