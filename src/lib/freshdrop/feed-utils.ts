import type { HomeFeedItem } from "@routefarm/shared";

export function todayLabel(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export function isMorningDrop(item: HomeFeedItem): boolean {
  const label = (item.freshness_label ?? "").toLowerCase();
  return (
    label.includes("fresh batch") ||
    label.includes("made today") ||
    label.includes("available now")
  );
}

export function isPickupToday(item: HomeFeedItem): boolean {
  const label = (item.freshness_label ?? "").toLowerCase();
  if (label.includes("made to order")) return false;
  return true;
}

/** Demo scarcity for reserve UX — deterministic from product id */
export function unitsLeft(item: HomeFeedItem): number | null {
  const seed = item.product_id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const left = (seed % 8) + 1;
  return left <= 5 ? left : null;
}

export function needsReserve(item: HomeFeedItem): boolean {
  return unitsLeft(item) !== null;
}

export function pickupWindow(item: HomeFeedItem): string {
  const label = item.freshness_label ?? "Ready for pickup";
  if (label === "Fresh Batch Time") return "Batch out now · pickup today";
  if (label === "Made Today") return "Baked today · pickup by evening";
  if (label === "Available Now") return "Available now";
  if (label === "Made To Order") return "Reserve for pickup";
  return `${label} · pickup today`;
}

export function partitionDrops(items: HomeFeedItem[]) {
  const morning = items.filter(isMorningDrop);
  const pickup = items.filter(isPickupToday);
  const reserve = items.filter(needsReserve);
  return {
    all: items,
    morning: morning.length > 0 ? morning : items.slice(0, Math.min(6, items.length)),
    pickup: pickup.length > 0 ? pickup : items,
    reserve: reserve.length > 0 ? reserve : items.slice(0, Math.min(4, items.length)),
  };
}
