import type { Seller } from "@/lib/types";
import { Clock } from "lucide-react";
import {
  canAcceptPickup,
  formatSellerPickupWindows,
  getAvailabilityColor,
  getAvailabilityLabel,
} from "@/lib/seller-availability";

interface SellerAvailabilityProps {
  seller: Seller;
  compact?: boolean;
}

export default function SellerAvailability({ seller, compact = false }: SellerAvailabilityProps) {
  if (compact) {
    return (
      <span className={`badge ${getAvailabilityColor(seller.availabilityStatus)}`}>
        {getAvailabilityLabel(seller.availabilityStatus)}
      </span>
    );
  }

  return (
    <div className="rounded-xl bg-sage-50/80 px-3 py-2 ring-1 ring-sage-200/60">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge ${getAvailabilityColor(seller.availabilityStatus)}`}>
          {getAvailabilityLabel(seller.availabilityStatus)}
        </span>
        {!canAcceptPickup(seller) && (
          <span className="text-xs text-warm-500">Pickup paused</span>
        )}
      </div>
      {canAcceptPickup(seller) && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-warm-600">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-600" />
          {formatSellerPickupWindows(seller)}
        </p>
      )}
    </div>
  );
}
