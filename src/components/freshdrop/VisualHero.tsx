"use client";

import Link from "next/link";
import Image from "next/image";
import type { HomeFeedItem } from "@routefarm/shared";
import { dropHeroImage } from "@/lib/freshdrop/drop-image";
import { formatPrice } from "@/lib/utils";

export default function VisualHero({
  leadDrop,
  liveCount,
}: {
  leadDrop: HomeFeedItem | null;
  liveCount: number;
}) {
  const src = dropHeroImage(leadDrop);
  const title = leadDrop?.title ?? "Fresh from the neighborhood";
  const price = leadDrop ? formatPrice(leadDrop.price_cents / 100) : null;
  const href = leadDrop ? `/products/${leadDrop.product_id}` : "#drops";

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-warm-950">
      <Image
        src={src}
        alt={title}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-warm-950/25 via-warm-950/10 to-warm-950/85"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-warm-950/90 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-8 pt-28 sm:px-6 sm:pb-12">
        {liveCount > 0 && (
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live now
          </p>
        )}

        <h1 className="max-w-lg text-[2.35rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
          Today&apos;s Fresh Drops
        </h1>

        {leadDrop && (
          <p className="mt-3 max-w-sm text-lg font-medium text-white/95">{title}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={href}
            className="inline-flex rounded-full bg-white px-8 py-3.5 text-base font-bold text-warm-950 shadow-xl transition hover:bg-amber-50"
          >
            {price ? `Reserve · ${price}` : "See what dropped"}
          </Link>
          <a
            href="#creators"
            className="inline-flex rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Follow bakers
          </a>
        </div>
      </div>
    </section>
  );
}
