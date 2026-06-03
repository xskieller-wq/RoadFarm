import type { Dispatch, SetStateAction } from "react";
import type { Product, Seller, SellerReview, UserReport } from "@/lib/types";
import type { SellerBadgeId } from "@/lib/types";
import { sellers as initialSellers, products as initialProducts } from "@/data/seed-data";
import { inferSellerBadges } from "@/data/badges";
import { enrichSellerMedia } from "@/data/seller-media";
import { inferFreshnessLabel } from "@/lib/freshness";

const initialReviews: SellerReview[] = initialSellers.slice(0, 12).flatMap((s, i) => [
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

const initialReports: UserReport[] = [
  {
    id: "rep-1",
    type: "product",
    targetId: "p1",
    targetName: "Farm Fresh Dozen Eggs",
    reason: "Quantity mismatch at pickup",
    status: "open",
    createdAt: "2024-12-01T09:00:00Z",
  },
];

export type MarketplaceState = {
  sellers: Seller[];
  products: Product[];
  reviews: SellerReview[];
  reports: UserReport[];
};

export const marketplaceInitialState: MarketplaceState = {
  sellers: initialSellers.map((s) => ({ ...s })),
  products: initialProducts.map((p) => ({ ...p, photos: [...p.photos] })),
  reviews: initialReviews,
  reports: initialReports,
};

export type MarketplaceActions = {
  approveSeller: (id: string) => void;
  rejectSeller: (id: string) => void;
  updateSeller: (id: string, patch: Partial<Seller>) => void;
  addSeller: (seller: Omit<Seller, "id">) => string;
  toggleFeatured: (id: string) => void;
  toggleVerified: (id: string) => void;
  setBadges: (id: string, badges: SellerBadgeId[]) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => string;
  deleteProduct: (id: string) => void;
  toggleReviewVisibility: (id: string) => void;
  resolveReport: (id: string, status: "resolved" | "dismissed") => void;
};

export function createMarketplaceActions(
  setState: Dispatch<SetStateAction<MarketplaceState>>
): MarketplaceActions {
  return {
    approveSeller: (id) =>
      setState((s) => ({
        ...s,
        sellers: s.sellers.map((x) => (x.id === id ? { ...x, approvalStatus: "approved", verified: true } : x)),
      })),
    rejectSeller: (id) =>
      setState((s) => ({
        ...s,
        sellers: s.sellers.map((x) => (x.id === id ? { ...x, approvalStatus: "rejected" } : x)),
      })),
    updateSeller: (id, patch) =>
      setState((s) => ({
        ...s,
        sellers: s.sellers.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      })),
    addSeller: (seller) => {
      const id = `s${Date.now()}`;
      const enriched = enrichSellerMedia({ ...seller, id } as Parameters<typeof enrichSellerMedia>[0], 99);
      setState((s) => ({
        ...s,
        sellers: [...s.sellers, { ...enriched, id, badges: seller.badges?.length ? seller.badges : inferSellerBadges(enriched) }],
      }));
      return id;
    },
    toggleFeatured: (id) =>
      setState((s) => ({
        ...s,
        sellers: s.sellers.map((x) => (x.id === id ? { ...x, featured: !x.featured } : x)),
      })),
    toggleVerified: (id) =>
      setState((s) => ({
        ...s,
        sellers: s.sellers.map((x) => (x.id === id ? { ...x, verified: !x.verified } : x)),
      })),
    setBadges: (id, badges) =>
      setState((s) => ({
        ...s,
        sellers: s.sellers.map((x) => (x.id === id ? { ...x, badges } : x)),
      })),
    updateProduct: (id, patch) =>
      setState((s) => ({
        ...s,
        products: s.products.map((x) => {
          if (x.id !== id) return x;
          const next = { ...x, ...patch };
          if (patch.freshnessLabel !== undefined || patch.title !== undefined || patch.category !== undefined) {
            next.freshnessLabel = patch.freshnessLabel ?? inferFreshnessLabel(next);
          }
          return next;
        }),
      })),
    addProduct: (product) => {
      const id = `p${Date.now()}`;
      const freshnessLabel = product.freshnessLabel ?? inferFreshnessLabel(product as Product);
      setState((s) => ({
        ...s,
        products: [
          ...s.products,
          {
            ...product,
            id,
            freshnessLabel,
            videos: product.videos ?? [],
            photos: product.photos ?? [],
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      return id;
    },
    deleteProduct: (id) =>
      setState((s) => ({
        ...s,
        products: s.products.map((x) => (x.id === id ? { ...x, sold: true } : x)),
      })),
    toggleReviewVisibility: (id) =>
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)),
      })),
    resolveReport: (id, status) =>
      setState((s) => ({
        ...s,
        reports: s.reports.map((x) => (x.id === id ? { ...x, status } : x)),
      })),
  };
}
