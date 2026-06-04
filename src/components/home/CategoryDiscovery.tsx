import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORY_TILES, categoryResultsHref } from "./home-data";
import { cn } from "@/lib/utils";

const accentRing: Record<string, string> = {
  blossom: "ring-blossom-400 group-hover:shadow-blossom-200",
  lavender: "ring-lavender-400 group-hover:shadow-lavender-200",
  sunflower: "ring-sunflower-400 group-hover:shadow-sunflower-200",
  tomato: "ring-tomato-400 group-hover:shadow-tomato-200",
  sage: "ring-sage-400 group-hover:shadow-sage-200",
};

const accentLabel: Record<string, string> = {
  blossom: "text-blossom-300",
  lavender: "text-lavender-300",
  sunflower: "text-sunflower-300",
  tomato: "text-tomato-300",
  sage: "text-sage-300",
};

export default function CategoryDiscovery() {
  return (
    <section className="relative py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/25 bg-warm-950/50 p-4 shadow-lg backdrop-blur-md sm:p-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="section-label text-sunflower-300">Bakery categories</p>
              <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Paczki, donuts, bread &amp; more — by freshness
              </h2>
            </div>
            <Link
              href="/results?start=Norridge%2C%20IL&destination=Des%20Plaines%2C%20IL&maxDetour=10"
              className="hidden items-center gap-1 text-sm font-semibold text-blossom-200 hover:text-white sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:gap-4">
            {CATEGORY_TILES.map((tile) => (
              <Link
                key={tile.category}
                href={categoryResultsHref(tile.category)}
                className="group relative w-[130px] shrink-0 sm:w-[150px]"
              >
                <div
                  className={cn(
                    "relative aspect-[3/4] overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-warm-950/50 transition-all duration-300 group-hover:shadow-xl",
                    accentRing[tile.accent]
                  )}
                >
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="150px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-950/85 via-warm-900/25 to-transparent" />
                  <div className="absolute bottom-0 p-2.5">
                    <p className={cn("text-[10px] font-bold uppercase tracking-wider", accentLabel[tile.accent])}>
                      {tile.tagline.split(" ")[0]}
                    </p>
                    <p className="text-sm font-bold leading-tight text-white">{tile.label}</p>
                    <p className="mt-0.5 text-[10px] leading-tight text-white/65">{tile.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
