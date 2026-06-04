"use client";

import Link from "next/link";
import { Bell, Car } from "lucide-react";

export default function MinimalHabitBar() {
  return (
    <div className="flex gap-2 border-t border-white/10 bg-warm-950 px-3 py-4">
      <a
        href="#alerts"
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
      >
        <Bell className="h-4 w-4" aria-hidden />
        Alerts
      </a>
      <Link
        href="/search"
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
      >
        <Car className="h-4 w-4" aria-hidden />
        On your way home
      </Link>
    </div>
  );
}
