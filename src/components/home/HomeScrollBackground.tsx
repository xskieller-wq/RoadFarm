"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BROWSE_ZONE_BLUR, HOME_BG_ZONES, type HomeBgZone } from "@/components/home/home-data";
import { cn } from "@/lib/utils";

/** Bakery-only zones — homepage has no produce/freshness collage sections. */
const HOME_BG_ZONE_ORDER: HomeBgZone[] = ["bakery-top", "bakery-mid"];

function useHomeBackgroundZone(): HomeBgZone {
  const [zone, setZone] = useState<HomeBgZone>("bakery-top");

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-home-bg]")];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { zone: HomeBgZone; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const z = entry.target.getAttribute("data-home-bg") as HomeBgZone | null;
          if (!z) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { zone: z, ratio: entry.intersectionRatio };
          }
        }
        if (best) setZone(best.zone);
      },
      { threshold: [0, 0.12, 0.25, 0.4, 0.55] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return zone;
}

function ZoneLayer({
  zone,
  variant = "home",
}: {
  zone: HomeBgZone;
  variant?: "home" | "browse";
}) {
  const config = HOME_BG_ZONES[zone];
  const imageBlur = variant === "browse" ? BROWSE_ZONE_BLUR : config.blur;

  return (
    <div className="absolute inset-0" aria-hidden>
      <Image
        src={config.image}
        alt=""
        fill
        priority={zone === "bakery-top"}
        className={cn(imageBlur)}
        sizes="100vw"
      />
      <div className={cn("absolute inset-0 bg-gradient-to-b", config.overlay)} />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/10 via-transparent to-warm-950/20" />
      <div className="absolute inset-0 bg-warm-950/[0.18] mix-blend-multiply" />
    </div>
  );
}

/**
 * Fixed viewport backgrounds — single calm bakery hero; variety lives in product cards.
 */
export default function HomeScrollBackground({
  variant = "home",
}: {
  variant?: "home" | "browse";
}) {
  const activeZone = useHomeBackgroundZone();
  const zone = HOME_BG_ZONE_ORDER.includes(activeZone) ? activeZone : "bakery-top";
  const fadeStart = variant === "browse" ? "52%" : "40%";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <ZoneLayer key={zone} zone={zone} variant={variant} />
      <div
        className="absolute inset-x-0 bottom-0 bg-warm-950/15 backdrop-blur-[1px]"
        style={{
          top: fadeStart,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%)",
        }}
      />
    </div>
  );
}
