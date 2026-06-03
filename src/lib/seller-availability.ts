import type { Product, Seller, SellerAvailabilityStatus } from "@/lib/types";

export const AVAILABILITY_OPTIONS: { value: SellerAvailabilityStatus; label: string; description: string }[] = [
  {
    value: "available_now",
    label: "Available Now",
    description: "Ready for pickup right now — highlighted on the map",
  },
  {
    value: "available_today",
    label: "Available Today",
    description: "Scheduled pickup window today",
  },
  {
    value: "pickup_by_appointment",
    label: "Pickup By Appointment",
    description: "Buyers contact you to arrange pickup",
  },
  {
    value: "temporarily_unavailable",
    label: "Temporarily Unavailable",
    description: "Listings hidden from the map until you reopen",
  },
  {
    value: "vacation",
    label: "Vacation Mode",
    description: "Listings hidden — pickup paused",
  },
];

export function isSellerAvailableNow(seller: Seller): boolean {
  return seller.availabilityStatus === "available_now";
}

/** Listings are pickup-ready when seller accepts pickups */
export function isSellerPickupReady(seller: Seller): boolean {
  return (
    seller.availabilityStatus === "available_now" ||
    seller.availabilityStatus === "available_today" ||
    seller.availabilityStatus === "pickup_by_appointment"
  );
}

export function isSellerVisibleOnMap(seller: Seller): boolean {
  return (
    seller.availabilityStatus !== "vacation" &&
    seller.availabilityStatus !== "temporarily_unavailable"
  );
}

/** Buyer-facing listings: approved sellers only, same rules as explore map */
export function getBuyerVisibleProducts(products: Product[], sellers: Seller[]): Product[] {
  const approved = sellers.filter((s) => s.approvalStatus === "approved");
  return filterProductsForMap(products, approved);
}

/** Map + explore: hide vacation/unavailable; prioritize Available Now */
export function filterProductsForMap(products: Product[], sellers: Seller[]): Product[] {
  const sellerMap = new Map(sellers.map((s) => [s.id, s]));
  return products
    .filter((p) => {
      if (p.sold) return false;
      const seller = sellerMap.get(p.sellerId);
      return seller && isSellerVisibleOnMap(seller);
    })
    .sort((a, b) => {
      const sa = sellerMap.get(a.sellerId);
      const sb = sellerMap.get(b.sellerId);
      const aNow = sa && isSellerAvailableNow(sa) ? 0 : 1;
      const bNow = sb && isSellerAvailableNow(sb) ? 0 : 1;
      if (aNow !== bNow) return aNow - bNow;
      return a.estimatedDetourMinutes - b.estimatedDetourMinutes;
    });
}

export function getAvailabilityLabel(status: SellerAvailabilityStatus): string {
  return AVAILABILITY_OPTIONS.find((o) => o.value === status)?.label ?? "Pickup";
}

export function getAvailabilityColor(status: SellerAvailabilityStatus): string {
  switch (status) {
    case "available_now":
      return "bg-sunflower-200 text-sunflower-900 ring-1 ring-sunflower-400";
    case "available_today":
      return "bg-sage-100 text-sage-800";
    case "pickup_by_appointment":
      return "bg-lavender-100 text-lavender-800";
    case "temporarily_unavailable":
      return "bg-tomato-100 text-tomato-700";
    case "vacation":
      return "bg-warm-200 text-warm-600";
    default:
      return "bg-sage-100 text-sage-700";
  }
}

export function formatSellerPickupWindows(seller: Seller): string {
  const { weekdayPickup, weekendPickup } = seller;
  const parts: string[] = [];
  if (weekdayPickup) parts.push(`Weekdays ${weekdayPickup.open} – ${weekdayPickup.close}`);
  if (weekendPickup) parts.push(`Weekends ${weekendPickup.open} – ${weekendPickup.close}`);
  if (parts.length > 0) return parts.join(" · ");
  return seller.pickupHours.length > 0 ? "See pickup hours" : "Contact seller";
}

export function getSellerAvailabilityLine(seller: Seller): string | null {
  if (seller.availabilityStatus === "vacation") {
    return "Vacation mode — pickup paused";
  }

  if (seller.availabilityStatus === "temporarily_unavailable") {
    return "Temporarily unavailable for pickup";
  }

  if (isSellerAvailableNow(seller)) {
    return "Available now for pickup";
  }

  if (seller.availabilityStatus === "pickup_by_appointment") {
    return "Pickup by appointment";
  }

  if (seller.availabilityStatus === "available_today") {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const isWeekend = today === "Saturday" || today === "Sunday";
    const window = isWeekend ? seller.weekendPickup : seller.weekdayPickup;
    if (window) {
      return `Available today ${window.open} – ${window.close}`;
    }
    return "Available today — see pickup hours";
  }

  return formatSellerPickupWindows(seller);
}

export function canAcceptPickup(seller: Seller): boolean {
  return isSellerPickupReady(seller);
}
