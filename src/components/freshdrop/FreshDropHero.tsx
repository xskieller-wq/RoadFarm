"use client";

import { Sunrise, ChevronDown } from "lucide-react";
import { todayLabel } from "@/lib/freshdrop/feed-utils";

export default function FreshDropHero({ liveCount }: { liveCount: number }) {
  return (
    <header className="border-b border-amber-200/40 bg-amber-50 pt-20 pb-6 sm:pt-24 sm:pb-8">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-amber-900/90">
          <Sunrise className="h-4 w-4 text-amber-600" aria-hidden />
          {todayLabel()}
        </p>

        <h1 className="mt-4 text-[2rem] font-bold leading-[1.08] tracking-tight text-warm-950 sm:text-5xl">
          Today&apos;s Fresh Drops
        </h1>

        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-warm-700 sm:text-lg">
          See what local bakers just dropped near you — reserve before the batch is gone, pick up
          on your schedule.
        </p>

        {liveCount > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-warm-800 shadow-sm ring-1 ring-amber-200/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            {liveCount} {liveCount === 1 ? "drop" : "drops"} live near you now
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <a
            href="#board"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-warm-900 px-8 py-3.5 text-base font-bold text-amber-50 shadow-md transition hover:bg-warm-800 sm:w-auto"
          >
            Catch today&apos;s drops
          </a>
          <a
            href="#follow"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-full border-2 border-warm-900/15 bg-white px-8 py-3 text-base font-bold text-warm-900 transition hover:bg-amber-50/80 sm:w-auto"
          >
            Follow local bakers
          </a>
        </div>

        <a
          href="#board"
          className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-warm-500 hover:text-amber-800"
        >
          Scroll to live board
          <ChevronDown className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </header>
  );
}
