import type { HomeFeedItem } from "@routefarm/shared";
import type { Product } from "@/lib/types";
import { pickupWindow } from "@/lib/freshdrop/feed-utils";
import { freshnessChip } from "@/lib/freshdrop/launch-drop-display";

export function dropDistanceLabel(item: HomeFeedItem, product?: Product | null): string {
  const mins =
    product?.estimatedDetourMinutes ??
    (item.product_id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 6) + 2;
  return `${mins} min away`;
}

export function dropMeta(item: HomeFeedItem, product?: Product | null) {
  return {
    pickup: pickupWindow(item),
    distance: dropDistanceLabel(item, product),
    chip: freshnessChip(item.freshness_label),
  };
}
