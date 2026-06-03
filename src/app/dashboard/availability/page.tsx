"use client";

import { useState, useEffect } from "react";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import type { SellerAvailabilityStatus } from "@/lib/types";
import AvailableNowToggle from "@/components/dashboard/AvailableNowToggle";
import SellerAvailabilitySelect from "@/components/forms/SellerAvailabilitySelect";
import SellerPickupHoursForm, {
  pickupHoursFromSeller,
  type PickupHoursFormState,
} from "@/components/dashboard/SellerPickupHoursForm";

export default function SellerAvailabilityPage() {
  const { seller, updateSeller, syncProductPickupFromSeller } = useSellerDashboard();
  const [saved, setSaved] = useState(false);
  const [availability, setAvailability] = useState<SellerAvailabilityStatus>("available_today");
  const [pickup, setPickup] = useState<PickupHoursFormState | null>(null);

  useEffect(() => {
    if (seller) {
      setAvailability(seller.availabilityStatus);
      setPickup(pickupHoursFromSeller(seller));
    }
  }, [seller]);

  if (!seller || !pickup) return null;

  const saveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeller(seller.id, {
      availabilityStatus: availability,
      weekdayPickup: pickup.weekdayPickup,
      weekendPickup: pickup.weekendPickup,
      pickupLocation: pickup.pickupLocation,
      pickupHours: pickup.pickupHours,
      address: pickup.pickupLocation,
    });
    syncProductPickupFromSeller({
      pickupLocation: pickup.pickupLocation,
      pickupHours: pickup.pickupHours,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={saveAll} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-warm-900">Availability & pickup</h2>
        <p className="mt-1 text-sm text-warm-600">
          This controls the map and pickup readiness — not how fresh your products are (set freshness on each
          product).
        </p>
      </div>

      {saved && (
        <div className="rounded-xl bg-sage-100 px-4 py-3 text-sm font-medium text-sage-800">
          Saved — map and product listings updated.
        </div>
      )}

      <AvailableNowToggle
        seller={seller}
        onSave={(status) => {
          setAvailability(status);
          updateSeller(seller.id, { availabilityStatus: status });
        }}
      />

      <div className="card p-6">
        <h3 className="font-semibold text-warm-900">Availability status</h3>
        <p className="mt-1 text-sm text-warm-600 mb-4">
          Vacation and temporarily unavailable hide your pins from the explore map.
        </p>
        <SellerAvailabilitySelect value={availability} onChange={setAvailability} />
      </div>

      <div className="card p-6">
        <SellerPickupHoursForm state={pickup} onChange={setPickup} />
      </div>

      <button type="submit" className="btn-primary">
        Save availability & pickup hours
      </button>
    </form>
  );
}
