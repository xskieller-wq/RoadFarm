"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import type { Seller, SellerAvailabilityStatus } from "@/lib/types";
import { isSellerAvailableNow } from "@/lib/seller-availability";

interface AvailableNowToggleProps {
  seller: Seller;
  onSave: (status: SellerAvailabilityStatus) => void;
}

export default function AvailableNowToggle({ seller, onSave }: AvailableNowToggleProps) {
  const isOn = isSellerAvailableNow(seller);
  const [fallbackStatus, setFallbackStatus] = useState<SellerAvailabilityStatus>("available_today");

  useEffect(() => {
    if (!isOn && seller.availabilityStatus !== "available_now") {
      setFallbackStatus(seller.availabilityStatus);
    }
  }, [seller.availabilityStatus, isOn]);

  const toggle = () => {
    if (isOn) {
      onSave(fallbackStatus);
    } else {
      if (seller.availabilityStatus !== "available_now") {
        setFallbackStatus(seller.availabilityStatus);
      }
      onSave("available_now");
    }
  };

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-colors ${
        isOn ? "border-sunflower-400 bg-sunflower-50" : "border-warm-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isOn ? "bg-sunflower-400 text-sunflower-950" : "bg-warm-100 text-warm-500"
            }`}
          >
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-warm-900">Available Now</p>
            <p className="mt-1 text-sm text-warm-600">
              {isOn
                ? "Your listings are highlighted on the map and ready for pickup."
                : "Turn on when you are at home and ready for buyers to pick up."}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          onClick={toggle}
          className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${
            isOn ? "bg-sunflower-500" : "bg-warm-300"
          }`}
        >
          <span
            className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${
              isOn ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>
      {isOn && (
        <p className="mt-3 text-xs font-medium text-sunflower-800">
          Live on the neighborhood map — buyers see your pins first.
        </p>
      )}
    </div>
  );
}
