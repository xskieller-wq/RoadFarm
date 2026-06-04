import type { Dispatch, SetStateAction } from "react";
import type { Product, Seller, SellerReview, UserReport } from "@/lib/types";
import type { SellerBadgeId } from "@/lib/types";
import { inferSellerBadges } from "@/data/badges";
import { inferFreshnessLabel } from "@/lib/freshness";

export type MarketplaceState = {
  sellers: Seller[];
  products: Product[];
  reviews: SellerReview[];
  reports: UserReport[];
};

/** Empty until client hydration — seed catalog loads in MarketplaceProvider (not in layout chunk). */
export const marketplaceInitialState: MarketplaceState = {
  sellers: [],
  products: [],
  reviews: [],
  reports: [],
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
      setState((s) => ({
        ...s,
        sellers: [
          ...s.sellers,
          {
            ...seller,
            id,
            badges: seller.badges?.length ? seller.badges : inferSellerBadges({ ...seller, id } as Seller),
          },
        ],
      }));
      void import("@/data/seller-media").then(({ enrichSellerMedia }) => {
        setState((s) => ({
          ...s,
          sellers: s.sellers.map((x) =>
            x.id === id ? { ...enrichSellerMedia(x, 99), id, badges: x.badges } : x
          ),
        }));
      });
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
