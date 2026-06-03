"use client";

import { useAuth } from "@/context/AppContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import type { PickupHours } from "@/lib/types";

/** Log in with an email containing "seller" (e.g. seller@routefarm.com) → Green Valley Farm (s1) */
export function useSellerDashboard() {
  const { user, isSeller } = useAuth();
  const marketplace = useMarketplace();
  const sellerId = user?.sellerId ?? "s1";
  const seller = marketplace.getSellerById(sellerId);
  const products = marketplace.getProductsBySellerId(sellerId);

  const syncProductPickupFromSeller = (pickup?: {
    pickupLocation: string;
    pickupHours: PickupHours[];
  }) => {
    const location = pickup?.pickupLocation ?? seller?.pickupLocation;
    const hours = pickup?.pickupHours ?? seller?.pickupHours;
    if (!location && !hours?.length) return;
    for (const p of products) {
      marketplace.updateProduct(p.id, {
        pickupLocation: location ?? p.pickupLocation,
        pickupHours: hours ?? p.pickupHours,
      });
    }
  };

  return {
    ...marketplace,
    user,
    isSeller,
    sellerId,
    seller,
    products,
    hydrated: marketplace.hydrated,
    syncProductPickupFromSeller,
  };
}
