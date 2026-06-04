import Link from "next/link";
import { Bell, UserPlus, Sparkles } from "lucide-react";

/** Slim FreshDrop cues — does not replace marketplace sections */
export default function FreshDropHomeStrip({ liveCount }: { liveCount: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-300/40 bg-gradient-to-r from-amber-50/95 via-orange-50/90 to-amber-50/95 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-warm-950">Today&apos;s Fresh Drops</p>
            <p className="text-xs text-warm-600">
              {liveCount > 0
                ? `${liveCount} live near you — reserve before batches sell out`
                : "Follow bakers to catch the next morning drop"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="#fresh-drops"
            className="rounded-full bg-warm-900 px-4 py-2 text-xs font-bold text-white hover:bg-warm-800"
          >
            See live drops
          </a>
          <a
            href="#follow-bakers"
            className="inline-flex items-center gap-1 rounded-full border border-warm-300 bg-white px-4 py-2 text-xs font-bold text-warm-800 hover:border-amber-300"
          >
            <UserPlus className="h-3.5 w-3.5" aria-hidden />
            Follow bakers
          </a>
          <Link
            href="#batch-alerts"
            className="inline-flex items-center gap-1 rounded-full border border-warm-300 bg-white px-4 py-2 text-xs font-bold text-warm-800 hover:border-amber-300"
          >
            <Bell className="h-3.5 w-3.5" aria-hidden />
            Batch alerts
          </Link>
        </div>
      </div>
    </div>
  );
}
