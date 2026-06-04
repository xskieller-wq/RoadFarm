"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useFollow } from "@/components/freshdrop/FollowContext";
import BuyerHubNav from "@/components/buyer/BuyerHubNav";
import DropAlertRow from "@/components/buyer/DropAlertRow";
import NotificationSettingsPanel from "@/components/buyer/NotificationSettingsPanel";
import {
  FreshDropPageHeader,
  FreshDropPanel,
} from "@/components/layout/FreshDropPageShell";
import { freshDropSectionTitle, freshDropEyebrow } from "@/lib/freshdrop/buyer-page-styles";
import {
  buildUpcomingAlerts,
  buildNextDropsToday,
  buildDemoAlertHistory,
} from "@/lib/buyer/buyer-account-data";
import { loadAlertHistory, persistAlertHistory } from "@/lib/buyer/buyer-preferences";
import { formatHistoryAt } from "@/lib/buyer/buyer-account-data";
import { todayLabel } from "@/lib/freshdrop/feed-utils";
import { cn } from "@/lib/utils";
import type { AlertHistoryItem } from "@/lib/buyer/buyer-types";

function historyTypeLabel(type: AlertHistoryItem["type"]): string {
  if (type === "batch") return "Batch";
  if (type === "reminder") return "Reminder";
  return "Reserved";
}

export default function AlertsPageContent() {
  const { products, approvedSellers } = useMarketplace();
  const { following, followCount } = useFollow();

  const upcoming = useMemo(
    () => buildUpcomingAlerts(products, approvedSellers, following),
    [products, approvedSellers, following]
  );

  const nextDrops = useMemo(
    () => buildNextDropsToday(products, approvedSellers),
    [products, approvedSellers]
  );

  const history = useMemo(() => {
    const stored = loadAlertHistory();
    if (stored.length > 0) return stored;
    const demo = buildDemoAlertHistory(approvedSellers);
    persistAlertHistory(demo);
    return demo;
  }, [approvedSellers]);

  const bakerNotifications = useMemo(() => {
    const followed = approvedSellers.filter((s) => following.has(s.id) && s.sellerType === "Baker");
    return followed.map((s) => {
      const drop = upcoming.find((a) => a.sellerId === s.id);
      return {
        seller: s,
        message: drop
          ? `${drop.productTitle} · batch ${drop.batchTime}`
          : "No batch posted yet today — check back this morning",
      };
    });
  }, [approvedSellers, following, upcoming]);

  return (
    <>
      <FreshDropPageHeader
        eyebrow="Alerts"
        title="Fresh batch alerts"
        description={`${todayLabel()} — know when followed bakers drop paczki, bread, and pastries.`}
      >
        <div className="flex items-center gap-2 text-sm text-warm-600">
          <Bell className="h-4 w-4 text-amber-700" aria-hidden />
          Following {followCount} baker{followCount === 1 ? "" : "s"}
        </div>
      </FreshDropPageHeader>
      <BuyerHubNav />

      <section className="mt-8">
        <p className={freshDropEyebrow}>Upcoming</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Upcoming batch alerts</h2>
        <FreshDropPanel className="mt-4 space-y-2">
          {upcoming.length === 0 ? (
            <p className="text-sm text-warm-600">
              Follow bakers on the{" "}
              <Link href="/buy/following" className="font-semibold text-brand-800">
                Following
              </Link>{" "}
              tab to see their next batches here.
            </p>
          ) : (
            upcoming.map((a) => <DropAlertRow key={a.id} alert={a} />)
          )}
        </FreshDropPanel>
      </section>

      <section className="mt-10">
        <p className={freshDropEyebrow}>Today</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Next bakery drops near you</h2>
        <FreshDropPanel className="mt-4 space-y-2">
          {nextDrops.slice(0, 6).map((a) => (
            <DropAlertRow key={a.id} alert={a} />
          ))}
          <Link href="/#fresh-drops" className="inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-800">
            See all on homepage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FreshDropPanel>
      </section>

      <section className="mt-10">
        <p className={freshDropEyebrow}>Followed bakers</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Baker notifications</h2>
        <FreshDropPanel className="mt-4">
          <ul className="divide-y divide-warm-100">
            {bakerNotifications.length === 0 ? (
              <li className="py-2 text-sm text-warm-600">No followed bakers yet.</li>
            ) : (
              bakerNotifications.map(({ seller, message }) => (
                <li key={seller.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-2 w-2 shrink-0 translate-y-2 rounded-full bg-amber-500" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/sellers/${seller.slug}`}
                      className="text-sm font-bold text-warm-950 hover:text-brand-800"
                    >
                      {seller.name}
                    </Link>
                    <p className="text-xs text-warm-600">{message}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </FreshDropPanel>
      </section>

      <section className="mt-10">
        <p className={freshDropEyebrow}>Settings</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Alert settings</h2>
        <div className="mt-4">
          <NotificationSettingsPanel />
        </div>
      </section>

      <section className="mt-10 pb-6">
        <p className={freshDropEyebrow}>History</p>
        <h2 className={cn("mt-1", freshDropSectionTitle)}>Alert history</h2>
        <FreshDropPanel className="mt-4">
          <ul className="divide-y divide-warm-100">
            {history.map((h) => (
              <li key={h.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-0.5 shrink-0 rounded-full bg-warm-100 px-2 py-0.5 text-[10px] font-bold uppercase text-warm-700">
                  {historyTypeLabel(h.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-warm-900">{h.bakerName}</p>
                  <p className="text-xs text-warm-600">{h.message}</p>
                </div>
                <time className="shrink-0 text-[11px] text-warm-500">{formatHistoryAt(h.at)}</time>
              </li>
            ))}
          </ul>
        </FreshDropPanel>
      </section>
    </>
  );
}
