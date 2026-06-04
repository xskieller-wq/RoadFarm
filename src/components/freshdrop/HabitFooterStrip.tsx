"use client";

import Link from "next/link";
import { Bell, Car } from "lucide-react";

export default function HabitFooterStrip() {
  return (
    <div className="border-t border-warm-200/80 bg-warm-50 py-6">
      <div className="mx-auto max-w-2xl space-y-3 px-4 sm:px-6">
        <a
          href="#alerts"
          id="alerts"
          className="flex scroll-mt-24 items-center gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-4 transition hover:bg-amber-50"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 text-amber-900">
            <Bell className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-warm-950">Fresh batch alerts</p>
            <p className="text-sm text-warm-600">
              Get pinged when a baker you follow drops — not generic promos.
            </p>
          </div>
        </a>

        <Link
          href="/search"
          className="flex items-center gap-4 rounded-2xl border border-warm-200/90 bg-white p-4 transition hover:border-sky-200 hover:bg-sky-50/50"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
            <Car className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-warm-950">Pickup on your way home</p>
            <p className="text-sm text-warm-600">
              Easy stops near your commute — adds just a few minutes.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
