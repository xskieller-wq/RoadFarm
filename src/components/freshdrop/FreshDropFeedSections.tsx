"use client";

import Link from "next/link";
import { ArrowRight, Sun, MapPin, Flame } from "lucide-react";
import type { HomeFeedItem } from "@routefarm/shared";
import DropCard from "@/components/freshdrop/DropCard";
import { partitionDrops, pickupWindow } from "@/lib/freshdrop/feed-utils";
import { formatPrice } from "@/lib/utils";

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-warm-950 sm:text-2xl">{title}</h2>
        <p className="mt-1 max-w-xl text-sm text-warm-600">{description}</p>
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function HorizontalDrops({ items, variant }: { items: HomeFeedItem[]; variant: "featured" | "compact" }) {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {items.map((item) => (
        <DropCard key={item.id} item={item} variant={variant} />
      ))}
    </div>
  );
}

function PickupList({ items }: { items: HomeFeedItem[] }) {
  return (
    <ul className="mt-4 divide-y divide-warm-200/80 overflow-hidden rounded-2xl border border-warm-200/90 bg-white shadow-sm">
      {items.slice(0, 8).map((item) => (
        <li key={item.id}>
          <Link
            href={`/products/${item.product_id}`}
            className="flex items-center gap-4 px-4 py-3.5 transition hover:bg-amber-50/50 sm:px-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <MapPin className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-warm-900">{item.title}</p>
              <p className="truncate text-xs text-warm-600">
                {item.seller_name}
                {item.seller_city ? ` · ${item.seller_city}` : ""}
              </p>
              <p className="mt-0.5 text-xs font-medium text-amber-800">{pickupWindow(item)}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-warm-900">{formatPrice(item.price_cents / 100)}</p>
              <span className="mt-1 inline-block text-xs font-semibold text-brand-700">Pick up</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function FreshDropFeedSections({
  items,
  loading,
}: {
  items: HomeFeedItem[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-warm-600">Loading today&apos;s drops…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-warm-600">No drops yet today. Check back this morning.</p>
        <Link href="/explore" className="btn-primary mt-4 inline-flex">
          Find bakers near you
        </Link>
      </div>
    );
  }

  const { all, morning, pickup, reserve } = partitionDrops(items);

  return (
    <>
      <section id="today" className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Right now"
            title="Today's fresh drops"
            description="Everything live for today — pulled from ovens near you."
            href="/explore"
          />
          <div className="mt-5">
            <HorizontalDrops items={all} variant="featured" />
          </div>
        </div>
      </section>

      <section id="morning" className="border-y border-warm-200/60 bg-white/60 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" aria-hidden />
            <SectionHeader
              eyebrow="Before noon"
              title="Morning drops"
              description="Fresh batch times and made-today trays — the reason you open the app at breakfast."
            />
          </div>
          <div className="mt-5">
            <HorizontalDrops items={morning} variant="compact" />
          </div>
        </div>
      </section>

      <section id="pickup" className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Your schedule"
            title="Pickup today"
            description="Reserve a slot and swing by — no shipping, no waiting on delivery."
          />
          <PickupList items={pickup} />
        </div>
      </section>

      <section id="reserve" className="border-t border-warm-200/60 bg-gradient-to-b from-amber-50/50 to-warm-50 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-600" aria-hidden />
            <SectionHeader
              eyebrow="Going fast"
              title="Reserve before sellout"
              description="Small batches disappear by afternoon — hold yours while trays are hot."
            />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {reserve.slice(0, 4).map((item) => (
              <DropCard key={item.id} item={item} variant="reserve" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
