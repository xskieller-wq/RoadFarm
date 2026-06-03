import Link from "next/link";
import { Map, Sprout, ArrowRight } from "lucide-react";
import { ROUTEFARM_AREAS } from "@/data/routefarm-structure";

/** Homepage: clear buyer vs seller entry points */
export default function AudiencePathCards({ onDark = false }: { onDark?: boolean }) {
  const buy = ROUTEFARM_AREAS.buyers;
  const sell = ROUTEFARM_AREAS.sellers;

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-5">
      <Link
        href={buy.href}
        className={`group flex flex-1 items-center gap-4 rounded-2xl border-2 px-5 py-4 shadow-lg transition-all hover:scale-[1.02] ${
          onDark
            ? "border-white/30 bg-white/95 text-warm-900 hover:border-sage-300 hover:bg-white"
            : "border-sage-300 bg-cream-50 text-warm-900 hover:border-brand-400 hover:shadow-xl"
        }`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
          <Map className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{buy.cta}</p>
          <p className="text-sm text-warm-600">Map, freshness, pickups from neighbors</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <Link
        href={sell.href}
        className={`group flex flex-1 items-center gap-4 rounded-2xl border-2 px-5 py-4 shadow-lg transition-all hover:scale-[1.02] ${
          onDark
            ? "border-white/20 bg-warm-950/40 text-white backdrop-blur hover:border-sunflower-300/50 hover:bg-warm-950/55"
            : "border-warm-200 bg-white text-warm-900 hover:border-sunflower-400 hover:shadow-xl"
        }`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sunflower-100 text-sunflower-800">
          <Sprout className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{sell.cta}</p>
          <p className={`text-sm ${onDark ? "text-white/80" : "text-warm-600"}`}>
            List products, set pickup hours, earn badges
          </p>
        </div>
        <ArrowRight className={`h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 ${onDark ? "text-sunflower-300" : "text-brand-600"}`} />
      </Link>
    </div>
  );
}
