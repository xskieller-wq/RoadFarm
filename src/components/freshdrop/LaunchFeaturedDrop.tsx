"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import type { HomeFeedItem } from "@routefarm/shared";
import { useMarketplace } from "@/context/MarketplaceContext";
import { dropLaunchCardImage, foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { launchGlassPanel } from "@/lib/freshdrop/launch-card-styles";
import { dropMeta } from "@/lib/freshdrop/launch-drop-meta";
import { unitsLeft } from "@/lib/freshdrop/feed-utils";
import { formatPrice } from "@/lib/utils";
import FollowSellerButton from "@/components/freshdrop/FollowSellerButton";
import BakeryAvatar from "@/components/freshdrop/BakeryAvatar";

export default function LaunchFeaturedDrop({ item }: { item: HomeFeedItem }) {
  const { products, approvedSellers } = useMarketplace();
  const product = products.find((p) => p.id === item.product_id);
  const seller = approvedSellers.find((s) => s.id === item.seller_id);
  const left = unitsLeft(item);
  const { pickup, distance, chip } = dropMeta(item, product);
  const photo = dropLaunchCardImage(item);

  return (
    <article className="overflow-hidden rounded-3xl bg-warm-950/5 shadow-[0_24px_48px_-12px_rgba(28,25,23,0.28)] ring-1 ring-warm-900/10">
      <div className="grid md:grid-cols-[1.22fr_1fr]">
        <Link
          href={`/products/${item.product_id}`}
          className="group relative block min-h-[260px] overflow-hidden bg-warm-200 md:min-h-[320px]"
        >
          <Image
            src={photo}
            alt={item.title}
            fill
            priority
            className={`${foodPhotoClassName} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
            sizes="(max-width: 768px) 100vw, 640px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-950/20 via-transparent to-transparent md:hidden" />
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-warm-950/75 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-50 shadow-md">
              Featured drop
            </span>
            {chip && (
              <span className="rounded-full border border-white/60 bg-white/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-warm-900 backdrop-blur-md">
                {chip}
              </span>
            )}
          </div>
        </Link>

        <div
          className={`flex flex-col justify-center border-t border-white/40 p-6 md:border-l md:border-t-0 md:px-8 md:py-8 ${launchGlassPanel}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-warm-600/90">
            {item.category}
          </p>

          <Link
            href={`/sellers/${item.seller_slug}`}
            className="mt-3 inline-flex items-center gap-2.5 text-sm font-medium text-warm-700 hover:text-brand-700"
          >
            <BakeryAvatar
              name={item.seller_name}
              seller={seller}
              seed={item.seller_id.charCodeAt(0) || 0}
              size={36}
            />
            <span>
              <span className="font-semibold text-warm-900">{item.seller_name}</span>
              {item.seller_city ? (
                <span className="text-warm-600"> · {item.seller_city}</span>
              ) : null}
            </span>
          </Link>

          <Link href={`/products/${item.product_id}`} className="mt-3 block">
            <h2 className="text-2xl font-bold leading-[1.15] tracking-tight text-warm-950 hover:text-brand-800 sm:text-[1.75rem]">
              {item.title}
            </h2>
          </Link>

          <ul className="mt-4 space-y-1.5 text-sm text-warm-700">
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700/90" aria-hidden />
              <span>{pickup}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700/90" aria-hidden />
              <span>{distance}</span>
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-2xl font-bold tracking-tight text-warm-950">
              {formatPrice(item.price_cents / 100)}
            </p>
            {left !== null && (
              <p className="text-sm font-medium text-amber-900/90">{left} left in this batch</p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Link
              href={`/products/${item.product_id}`}
              className="btn-reserve inline-flex flex-1 items-center justify-center py-3.5 text-base"
            >
              {left !== null ? "Reserve pickup" : "Reserve"}
            </Link>
            <FollowSellerButton sellerId={item.seller_id} className="sm:flex-initial" />
          </div>
        </div>
      </div>
    </article>
  );
}
