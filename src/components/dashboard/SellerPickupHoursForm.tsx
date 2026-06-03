"use client";

import type { PickupHours, Seller, SellerPickupWindow } from "@/lib/types";

export interface PickupHoursFormState {
  weekdayPickup: SellerPickupWindow;
  weekendPickup: SellerPickupWindow;
  pickupLocation: string;
  pickupHours: PickupHours[];
}

export function pickupHoursFromSeller(seller: Seller): PickupHoursFormState {
  return {
    weekdayPickup: seller.weekdayPickup ?? { open: "5:00 PM", close: "8:00 PM" },
    weekendPickup: seller.weekendPickup ?? { open: "8:00 AM", close: "2:00 PM" },
    pickupLocation: seller.pickupLocation,
    pickupHours:
      seller.pickupHours.length > 0
        ? seller.pickupHours
        : [
            { day: "Monday", open: "5:00 PM", close: "8:00 PM" },
            { day: "Tuesday", open: "5:00 PM", close: "8:00 PM" },
            { day: "Wednesday", open: "5:00 PM", close: "8:00 PM" },
            { day: "Thursday", open: "5:00 PM", close: "8:00 PM" },
            { day: "Friday", open: "5:00 PM", close: "8:00 PM" },
            { day: "Saturday", open: "8:00 AM", close: "2:00 PM" },
            { day: "Sunday", open: "8:00 AM", close: "2:00 PM" },
          ],
  };
}

interface SellerPickupHoursFormProps {
  state: PickupHoursFormState;
  onChange: (state: PickupHoursFormState) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SellerPickupHoursForm({ state, onChange }: SellerPickupHoursFormProps) {
  const updateDay = (index: number, field: "open" | "close", value: string) => {
    const pickupHours = state.pickupHours.map((h, i) =>
      i === index ? { ...h, [field]: value } : h
    );
    onChange({ ...state, pickupHours });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-warm-800">Pickup address</label>
        <input
          className="input-field mt-1"
          value={state.pickupLocation}
          onChange={(e) => onChange({ ...state, pickupLocation: e.target.value })}
          placeholder="Street address buyers navigate to"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-sage-50/80 p-4 ring-1 ring-sage-200/60">
          <p className="text-sm font-semibold text-warm-900">Weekday window</p>
          <p className="text-xs text-warm-500">Shown as &quot;Available today&quot; Mon–Fri</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-warm-600">Open</label>
              <input
                className="input-field mt-1"
                value={state.weekdayPickup.open}
                onChange={(e) =>
                  onChange({
                    ...state,
                    weekdayPickup: { ...state.weekdayPickup, open: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="text-xs text-warm-600">Close</label>
              <input
                className="input-field mt-1"
                value={state.weekdayPickup.close}
                onChange={(e) =>
                  onChange({
                    ...state,
                    weekdayPickup: { ...state.weekdayPickup, close: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-sage-50/80 p-4 ring-1 ring-sage-200/60">
          <p className="text-sm font-semibold text-warm-900">Weekend window</p>
          <p className="text-xs text-warm-500">Sat–Sun pickup hours</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-warm-600">Open</label>
              <input
                className="input-field mt-1"
                value={state.weekendPickup.open}
                onChange={(e) =>
                  onChange({
                    ...state,
                    weekendPickup: { ...state.weekendPickup, open: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="text-xs text-warm-600">Close</label>
              <input
                className="input-field mt-1"
                value={state.weekendPickup.close}
                onChange={(e) =>
                  onChange({
                    ...state,
                    weekendPickup: { ...state.weekendPickup, close: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-warm-900">Hours by day</p>
        <p className="mt-1 text-xs text-warm-500">Used on product detail and your public profile</p>
        <div className="mt-3 space-y-2">
          {state.pickupHours.map((row, i) => (
            <div key={row.day} className="grid grid-cols-[100px_1fr_1fr] items-center gap-2">
              <span className="text-sm text-warm-700">{DAYS[i] ?? row.day}</span>
              <input
                className="input-field"
                value={row.open}
                onChange={(e) => updateDay(i, "open", e.target.value)}
              />
              <input
                className="input-field"
                value={row.close}
                onChange={(e) => updateDay(i, "close", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
