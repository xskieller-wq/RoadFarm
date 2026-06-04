"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark, CalendarCheck, MapPin, Users } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useReservations } from "@/context/AppContext";
import { useFollow } from "@/components/freshdrop/FollowContext";
import BuyerHubNav from "@/components/buyer/BuyerHubNav";
import NotificationSettingsPanel from "@/components/buyer/NotificationSettingsPanel";
import {
  FreshDropPageHeader,
  FreshDropPanel,
} from "@/components/layout/FreshDropPageShell";
import { freshDropSectionTitle, freshDropEyebrow, freshDropPagePanel } from "@/lib/freshdrop/buyer-page-styles";
import {
  buildDemoReservations,
  buildPickupHistory,
  formatReservedAt,
  reservationPriceLabel,
} from "@/lib/buyer/buyer-account-data";
import {
  loadSavedProductIds,
  persistSavedProductIds,
} from "@/lib/buyer/buyer-preferences";
import { filterSellersByType } from "@/lib/seller-utils";
import { getProductImage } from "@/data/images";
import { foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link href={href} className={cn(freshDropPagePanel, "block p-4 transition hover:shadow-md")}>
      <Icon className="h-5 w-5 text-amber-800/90" aria-hidden />
      <p className="mt-2 text-2xl font-bold text-warm-950">{value}</p>
      <p className="text-xs font-medium text-warm-600">{label}</p>
    </Link>
  );
}

export default function AccountPageContent() {
  const { products, approvedSellers } = useMarketplace();
  const { reservations } = useReservations();
  const { followCount, following } = useFollow();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = loadSavedProductIds();
    if (stored.length === 0 && products.length > 0) {
      const paczki = products.find((p) => p.sellerId === "s1" && p.title.toLowerCase().includes("paczki"));
      const bread = products.find((p) => p.sellerId === "s3" && p.category === "Bread");
      const cookie = products.find((p) => p.sellerId === "s5" && p.category === "Cookies");
      const seed = [paczki, bread, cookie].filter(Boolean).map((p) => p!.id);
      const ids = seed.length > 0 ? seed : products.slice(0, 3).map((p) => p.id);
      persistSavedProductIds(ids);
      setSavedIds(ids);
    } else {
      setSavedIds(stored);
    }
  }, [products]);

  const activeReservations = useMemo(() => {
    const live = reservations.filter((r) => r.status !== "picked_up");
    if (live.length > 0) return live;
    return buildDemoReservations(products, approvedSellers);
  }, [reservations, products, approvedSellers]);

  const savedProducts = useMemo(
    () => savedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [savedIds, products]
  );

  const followedBakers = useMemo(
    () => filterSellersByType(approvedSellers, ["Baker"]).filter((s) => following.has(s.id)),
    [approvedSellers, following]
  );

  const pickupHistory = useMemo(
    () => buildPickupHistory(reservations, products, approvedSellers),
    [reservations, products, approvedSellers]
  );

  const removeSaved = (productId: string) => {
    const next = savedIds.filter((id) => id !== productId);
    setSavedIds(next);
    persistSavedProductIds(next);
  };

  return (
    <>
      <FreshDropPageHeader
        eyebrow="Account"
        title="Your FreshDrop"
        description="Reservations, saved bakery, followed bakers, and pickup history in one place."
      />
      <BuyerHubNav />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Active reserves" value={activeReservations.length} href="/buy" icon={CalendarCheck} />
        <StatCard label="Saved items" value={savedProducts.length} href="/buy" icon={Bookmark} />
        <StatCard label="Following" value={followCount} href="/buy/following" icon={Users} />
        <StatCard label="Today's drops" value="Live" href="/#fresh-drops" icon={MapPin} />
      </div>

      <section className="mt-10">
        <p className={freshDropEyebrow}>Reservations</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Pickup scheduled</h2>
        <FreshDropPanel className="mt-4 space-y-3">
          {activeReservations.length === 0 ? (
            <p className="text-sm text-warm-600">No active reservations. Reserve from today&apos;s drops.</p>
          ) : (
            activeReservations.map((r) => {
              const product = products.find((p) => p.id === r.productId);
              return (
                <div
                  key={r.id}
                  className="flex flex-col gap-3 border-b border-warm-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-warm-950">{r.productTitle}</p>
                    <p className="text-xs text-warm-600">{r.sellerName}</p>
                    <p className="mt-1 text-xs text-warm-500">
                      {r.pickupLocation} · {r.pickupHours}
                    </p>
                    <p className="mt-1 text-[11px] text-warm-500">
                      Reserved {formatReservedAt(r.reservedAt)}
                      {product ? ` · ${reservationPriceLabel(product, r.quantity)}` : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        r.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
                      }`}
                    >
                      {r.status}
                    </span>
                    <Link href={`/products/${r.productId}`} className="btn-reserve text-xs py-2 px-3">
                      View
                    </Link>
                  </div>
                </div>
              );
            })
          )}
          <Link href="/#fresh-drops" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800">
            Reserve another drop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FreshDropPanel>
      </section>

      <section className="mt-10">
        <p className={freshDropEyebrow}>Saved</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Saved products</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {savedProducts.map((p) => (
            <div key={p!.id} className={freshDropPagePanel}>
              <div className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-warm-100">
                  <Image
                    src={p!.photos[0]?.url ?? getProductImage(p!.category, p!.title)}
                    alt=""
                    fill
                    className={foodPhotoClassName}
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${p!.id}`} className="line-clamp-2 text-sm font-bold text-warm-950 hover:text-brand-800">
                    {p!.title}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-warm-900">{formatPrice(p!.price)}</p>
                  <div className="mt-2 flex gap-2">
                    <Link href={`/products/${p!.id}`} className="btn-reserve text-xs py-1.5 px-3">
                      Reserve
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeSaved(p!.id)}
                      className="text-xs font-semibold text-warm-500 hover:text-warm-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className={freshDropEyebrow}>Following</p>
            <h2 className={cn("mt-1", freshDropSectionTitle)}>Followed bakeries</h2>
          </div>
          <Link href="/buy/following" className="text-sm font-semibold text-brand-800">
            Manage
            <ArrowRight className="ml-0.5 inline h-4 w-4" />
          </Link>
        </div>
        <FreshDropPanel className="mt-4">
          {followedBakers.length === 0 ? (
            <p className="text-sm text-warm-600">You are not following any bakers yet.</p>
          ) : (
            <ul className="space-y-3">
              {followedBakers.slice(0, 4).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 border-b border-warm-100 pb-3 last:border-0 last:pb-0">
                  <Link href={`/sellers/${s.slug}`} className="font-semibold text-warm-900 hover:text-brand-800">
                    {s.name}
                  </Link>
                  <span className="text-xs text-warm-500">{s.neighborhood}</span>
                </li>
              ))}
            </ul>
          )}
        </FreshDropPanel>
      </section>

      <section className="mt-10">
        <p className={freshDropEyebrow}>History</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Pickup history</h2>
        <FreshDropPanel className="mt-4">
          <ul className="divide-y divide-warm-100">
            {pickupHistory.map((h) => (
              <li key={h.id} className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-warm-900">{h.productTitle}</p>
                  <p className="text-xs text-warm-600">{h.sellerName}</p>
                </div>
                <p className="shrink-0 text-xs text-warm-500">{formatReservedAt(h.pickedUpAt)}</p>
              </li>
            ))}
          </ul>
        </FreshDropPanel>
      </section>

      <section className="mt-10 pb-6">
        <NotificationSettingsPanel />
      </section>
    </>
  );
}
