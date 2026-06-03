"use client";

import type { SellerAvailabilityStatus } from "@/lib/types";
import { AVAILABILITY_OPTIONS } from "@/lib/seller-availability";

interface SellerAvailabilitySelectProps {
  value: SellerAvailabilityStatus;
  onChange: (value: SellerAvailabilityStatus) => void;
  compact?: boolean;
}

export default function SellerAvailabilitySelect({
  value,
  onChange,
  compact = false,
}: SellerAvailabilitySelectProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {AVAILABILITY_OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors ${
            value === opt.value
              ? "border-brand-300 bg-brand-50/80 ring-1 ring-brand-200"
              : "border-warm-200 bg-white hover:border-sage-300"
          }`}
        >
          <input
            type="radio"
            name="availability"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-1 h-4 w-4 border-warm-300 text-brand-600 focus:ring-brand-500"
          />
          <span>
            <span className="text-sm font-semibold text-warm-900">{opt.label}</span>
            {!compact && <span className="mt-0.5 block text-xs text-warm-600">{opt.description}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}
