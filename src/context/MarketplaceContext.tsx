"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Product, Seller } from "@/lib/types";
import type { SellerBadgeId } from "@/lib/types";
import {
  marketplaceInitialState,
  createMarketplaceActions,
  type MarketplaceActions,
  type MarketplaceState,
} from "./marketplace-store";

interface MarketplaceContextType extends MarketplaceActions {
  sellers: Seller[];
  products: Product[];
  reviews: MarketplaceState["reviews"];
  reports: MarketplaceState["reports"];
  approvedSellers: Seller[];
  featuredSellers: Seller[];
  hydrated: boolean;
  getSellerById: (id: string) => Seller | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsBySellerId: (sellerId: string) => Product[];
  getSellerForProduct: (product: Product) => Seller | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MarketplaceState>(marketplaceInitialState);
  const [hydrated, setHydrated] = useState(false);
  const skipPersist = useRef(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { loadPersistedMarketplace } = await import("@/lib/marketplace-persistence");
        const saved = loadPersistedMarketplace();
        if (cancelled) return;

        if (saved) {
          setState(saved);
        } else {
          const { loadSeedMarketplaceState } = await import("@/context/marketplace-seed-loader");
          setState(await loadSeedMarketplaceState());
        }
      } catch (err) {
        console.error("[MarketplaceProvider] failed to hydrate marketplace", err);
        try {
          const { loadSeedMarketplaceState } = await import("@/context/marketplace-seed-loader");
          if (!cancelled) setState(await loadSeedMarketplaceState());
        } catch {
          /* layout must still mount */
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
          skipPersist.current = false;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || skipPersist.current) return;
    void import("@/lib/marketplace-persistence").then(({ persistMarketplace }) =>
      persistMarketplace(state)
    );
  }, [state, hydrated]);

  const actions = useMemo(() => createMarketplaceActions(setState), []);

  const value = useMemo<MarketplaceContextType>(
    () => ({
      ...state,
      ...actions,
      hydrated,
      approvedSellers: state.sellers.filter((s) => s.approvalStatus === "approved"),
      featuredSellers: state.sellers.filter((s) => s.featured && s.approvalStatus === "approved"),
      getSellerById: (id) => state.sellers.find((s) => s.id === id),
      getProductById: (id) => state.products.find((p) => p.id === id),
      getProductsBySellerId: (sellerId) =>
        state.products.filter((p) => p.sellerId === sellerId && !p.sold),
      getSellerForProduct: (product) => state.sellers.find((s) => s.id === product.sellerId),
    }),
    [state, actions, hydrated]
  );

  return (
    <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}

export type { SellerBadgeId };
