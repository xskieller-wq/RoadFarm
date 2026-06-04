import type { HomeFeedItem } from "@routefarm/shared";

export type SemanticBlock = {
  /** Small caps category label — never interchangeable */
  category: "Freshness" | "Availability" | "Pickup";
  headline: string;
  detail: string;
};

export function dropSemantics(item: HomeFeedItem): {
  freshness: SemanticBlock;
  availability: SemanticBlock;
  pickup: SemanticBlock;
} {
  const label = item.freshness_label ?? "";

  let freshnessHeadline = "Fresh from today's batch";
  let freshnessDetail = "Made by a baker near you";
  if (label === "Fresh Batch Time") {
    freshnessHeadline = "Just dropped — fresh batch";
    freshnessDetail = "Out of the oven this morning";
  } else if (label === "Made Today") {
    freshnessHeadline = "Baked this morning";
    freshnessDetail = "Same-day tray, not day-old inventory";
  } else if (label === "Available Now") {
    freshnessHeadline = "Ready now";
    freshnessDetail = "Pulled fresh for today's pickup";
  } else if (label === "Made To Order") {
    freshnessHeadline = "Made to order";
    freshnessDetail = "Prepared after you reserve";
  }

  let availabilityHeadline = "Taking pickup orders now";
  let availabilityDetail = "Reserve your spot in this batch";
  if (label === "Made To Order") {
    availabilityHeadline = "Taking orders for this drop";
    availabilityDetail = "They'll confirm when it's ready";
  }

  let pickupHeadline = "Pickup today";
  let pickupDetail = "Neighborhood pickup — no delivery wait";
  if (label === "Fresh Batch Time") {
    pickupHeadline = "Pickup this morning";
    pickupDetail = "Swing by while the batch is hot";
  } else if (label === "Made To Order") {
    pickupHeadline = "Pickup when ready";
    pickupDetail = "Window confirmed after you reserve";
  } else if (label === "Made Today") {
    pickupHeadline = "Pickup today";
    pickupDetail = "Usually afternoon or evening";
  }

  return {
    freshness: {
      category: "Freshness",
      headline: freshnessHeadline,
      detail: freshnessDetail,
    },
    availability: {
      category: "Availability",
      headline: availabilityHeadline,
      detail: availabilityDetail,
    },
    pickup: {
      category: "Pickup",
      headline: pickupHeadline,
      detail: pickupDetail,
    },
  };
}

export function isJustDropped(item: HomeFeedItem, index: number): boolean {
  if (index === 0) return true;
  const label = (item.freshness_label ?? "").toLowerCase();
  return label.includes("fresh batch") || label.includes("available now");
}
