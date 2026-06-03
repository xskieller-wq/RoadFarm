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
          <p className="font-semibold text-blossom-800">Demo reservation saved</p>
          <p className="text-sm text-blossom-700">
            Stored on this device only. The seller is not notified in this MVP — contact them directly
            to confirm pickup.
          </p>
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
    <div className="mt-6">
      <button
        onClick={handleReserve}
        disabled={product.sold || product.quantityAvailable === 0}
        className="btn-primary w-full sm:w-auto"
      >
        Save demo reservation
      </button>
      <p className="mt-2 text-xs text-warm-500">
        MVP demo: saves locally on your browser. Sellers are not notified — arrange pickup with the
        baker directly.
      </p>
    </div>
  );
}
