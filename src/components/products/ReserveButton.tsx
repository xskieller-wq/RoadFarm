"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { formatPickupHours } from "@/lib/utils";
import { useReservations } from "@/context/AppContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { canAcceptPickup } from "@/lib/seller-availability";
import type { Product } from "@/lib/types";

interface ReserveButtonProps {
  product: Product;
  sellerName: string;
  sellerId: string;
}

export default function ReserveButton({ product, sellerName, sellerId }: ReserveButtonProps) {
  const [reserved, setReserved] = useState(false);
  const { addReservation } = useReservations();
  const { getSellerById } = useMarketplace();
  const seller = getSellerById(sellerId);
  const pickupReady = seller ? canAcceptPickup(seller) : false;

  const handleReserve = () => {
    addReservation({
      productId: product.id,
      productTitle: product.title,
      sellerName,
      quantity: 1,
      pickupLocation: product.pickupLocation,
      pickupHours: formatPickupHours(product.pickupHours),
    });
    setReserved(true);
  };

  if (reserved) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blossom-200 bg-blossom-50 p-4">
        <CheckCircle className="h-6 w-6 text-blossom-600" />
        <div>
          <p className="font-semibold text-blossom-800">Reserved for pickup!</p>
          <p className="text-sm text-blossom-700">The seller will confirm your reservation.</p>
        </div>
      </div>
    );
  }

  if (!pickupReady) {
    return (
      <p className="mt-6 rounded-xl bg-warm-100 px-4 py-3 text-sm text-warm-700">
        This seller is not available for pickup right now. Check back when their status changes.
      </p>
    );
  }

  return (
    <button
      onClick={handleReserve}
      disabled={product.sold || product.quantityAvailable === 0}
      className="btn-primary mt-6 w-full sm:w-auto"
    >
      Reserve for pickup
    </button>
  );
}
