"use client";

import { useAuth } from "@/context/AppContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import type { PickupHours } from "@/lib/types";

/** Log in with seller@routefarm.com → Harbor Street Bakery (s1), or use seller signup to create a new baker record */

export function useSellerDashboard() {
  const { user, isSeller } = useAuth();
  const marketplace = useMarketplace();
  const sellerId = user?.sellerId;
  const seller = sellerId ? marketplace.getSellerById(sellerId) : undefined;
  const products = sellerId ? marketplace.getProductsBySellerId(sellerId) : [];

  const syncProductPickupFromSeller = (pickup?: {
    pickupLocation: string;
    pickupHours: PickupHours[];
  }) => {
    const location = pickup?.pickupLocation ?? seller?.pickupLocation;
    const hours = pickup?.pickupHours ?? seller?.pickupHours;
    if (!sellerId || (!location && !hours?.length)) return;

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
