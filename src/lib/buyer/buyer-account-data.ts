import type { Product, Seller, Reservation } from "@/lib/types";
import { isBakeryCategory } from "@/lib/categories";
import { formatProductFreshnessLine } from "@/lib/seller-utils";
import type {
  AlertHistoryItem,
  PickupHistoryEntry,
  ScheduledBakerBatch,
  UpcomingBatchAlert,
} from "@/lib/buyer/buyer-types";
import { formatPrice } from "@/lib/utils";

function todayMorningSlots(): string[] {
  return ["5:45 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "11:30 AM"];
}

function batchTimeForProduct(product: Product, index: number): string {
  if (product.freshnessBatchTime) return product.freshnessBatchTime;
  return todayMorningSlots()[index % todayMorningSlots().length];
}

function pickupLine(product: Product): string {
  return formatProductFreshnessLine(product);
}

export function buildUpcomingAlerts(
  products: Product[],
  sellers: Seller[],
  followedIds: Set<string>
): UpcomingBatchAlert[] {
  const sellerById = new Map(sellers.map((s) => [s.id, s]));

  return products
    .filter(
      (p) =>
        !p.sold &&
        isBakeryCategory(p.category) &&
        followedIds.has(p.sellerId) &&
        (p.freshBatchAlerts ||
          p.freshnessLabel === "Fresh Batch Time" ||
          p.freshnessLabel === "Fresh Batch Alerts" ||
          p.freshnessBatchTime)
    )
    .slice(0, 12)
    .map((p, i) => {
      const seller = sellerById.get(p.sellerId);
      return {
        id: `upcoming-${p.id}`,
        sellerId: p.sellerId,
        sellerName: seller?.name ?? "Local baker",
        sellerSlug: seller?.slug ?? "baker",
        productId: p.id,
        productTitle: p.title,
        category: p.category,
        batchTime: batchTimeForProduct(p, i),
        pickupWindow: pickupLine(p),
        imageUrl: p.photos[0]?.url ?? "",
      };
    })
    .sort((a, b) => a.batchTime.localeCompare(b.batchTime));
}

export function buildNextDropsToday(products: Product[], sellers: Seller[]): UpcomingBatchAlert[] {
  const sellerById = new Map(sellers.map((s) => [s.id, s]));

  return products
    .filter((p) => !p.sold && isBakeryCategory(p.category))
    .slice(0, 8)
    .map((p, i) => {
      const seller = sellerById.get(p.sellerId);
      return {
        id: `next-${p.id}`,
        sellerId: p.sellerId,
        sellerName: seller?.name ?? "Local baker",
        sellerSlug: seller?.slug ?? "baker",
        productId: p.id,
        productTitle: p.title,
        category: p.category,
        batchTime: batchTimeForProduct(p, i),
        pickupWindow: pickupLine(p),
        imageUrl: p.photos[0]?.url ?? "",
      };
    });
}

export function buildScheduledBatches(
  products: Product[],
  sellers: Seller[],
  followedIds: Set<string>
): ScheduledBakerBatch[] {
  return sellers
    .filter((s) => s.sellerType === "Baker" && followedIds.has(s.id))
    .map((seller) => {
      const bakerProducts = products.filter((p) => p.sellerId === seller.id && !p.sold);
      const next =
        bakerProducts.find((p) => p.freshnessBatchTime) ??
        bakerProducts.find((p) => p.freshnessLabel === "Fresh Batch Time") ??
        bakerProducts[0];

      return {
        sellerId: seller.id,
        nextBatchLabel: next?.freshnessBatchTime
          ? `Next batch · ${next.freshnessBatchTime}`
          : next?.freshnessLabel === "Made Today"
            ? "Baked today · pickup by evening"
            : "Batch posting this morning",
        nextProductTitle: next?.title ?? "Fresh drop coming soon",
        pickupWindow: next ? pickupLine(next) : "Pickup windows on profile",
      };
    });
}

export function recentDropsForSeller(products: Product[], sellerId: string, limit = 3): Product[] {
  return products
    .filter((p) => p.sellerId === sellerId && !p.sold && isBakeryCategory(p.category))
    .slice(0, limit);
}

export function buildDemoReservations(products: Product[], sellers: Seller[]): Reservation[] {
  const sellerById = new Map(sellers.map((s) => [s.id, s]));
  const picks = [
    products.find((p) => p.sellerId === "s1" && p.title.toLowerCase().includes("paczki")),
    products.find((p) => p.sellerId === "s3" && p.category === "Bread"),
  ].filter(Boolean) as Product[];

  const now = new Date();
  return picks.map((p, i) => {
    const seller = sellerById.get(p.sellerId);
    const reserved = new Date(now);
    reserved.setHours(reserved.getHours() - (i === 0 ? 2 : 26));
    return {
      id: `demo-res-${p.id}`,
      productId: p.id,
      productTitle: p.title,
      sellerName: seller?.name ?? "Local baker",
      quantity: i === 0 ? 1 : 2,
      pickupLocation: seller?.pickupLocation ?? "Neighborhood pickup",
      pickupHours: "Today · 4:00–7:00 PM",
      reservedAt: reserved.toISOString(),
      status: i === 0 ? "confirmed" : "pending",
    } satisfies Reservation;
  });
}

export function buildPickupHistory(
  reservations: Reservation[],
  products: Product[],
  sellers: Seller[]
): PickupHistoryEntry[] {
  const sellerById = new Map(sellers.map((s) => [s.id, s]));
  const fromReservations: PickupHistoryEntry[] = reservations
    .filter((r) => r.status === "picked_up")
    .map((r) => ({
      id: r.id,
      productTitle: r.productTitle,
      sellerName: r.sellerName,
      pickedUpAt: r.reservedAt,
      status: "picked_up" as const,
    }));

  if (fromReservations.length > 0) return fromReservations;

  const historyProducts = [
    products.find((p) => p.sellerId === "s1" && p.category === "Pastries"),
    products.find((p) => p.sellerId === "s5" && p.category === "Cookies"),
  ].filter(Boolean) as Product[];

  const daysAgo = [3, 8];
  return historyProducts.map((p, i) => {
    const seller = sellerById.get(p.sellerId);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo[i]);
    return {
      id: `history-${p.id}`,
      productTitle: p.title,
      sellerName: seller?.name ?? "Local baker",
      pickedUpAt: d.toISOString(),
      status: "picked_up",
    };
  });
}

export function buildDemoAlertHistory(sellers: Seller[]): AlertHistoryItem[] {
  const harbor = sellers.find((s) => s.id === "s1");
  const sunrise = sellers.find((s) => s.id === "s2");
  const crust = sellers.find((s) => s.id === "s3");

  const now = new Date();
  const hoursAgo = (h: number) => {
    const d = new Date(now);
    d.setHours(d.getHours() - h);
    return d.toISOString();
  };

  return [
    {
      id: "hist-1",
      at: hoursAgo(3),
      bakerName: harbor?.name ?? "Harbor Street Bakery",
      message: "Fresh paczki batch posted — 8 dozen left",
      type: "batch",
    },
    {
      id: "hist-2",
      at: hoursAgo(18),
      bakerName: crust?.name ?? "Crust & Crumb",
      message: "Country sourdough pulled at 6:30 AM",
      type: "batch",
    },
    {
      id: "hist-3",
      at: hoursAgo(28),
      bakerName: sunrise?.name ?? "Sunrise Ring Donuts",
      message: "Glazed ring dozen ready for pickup",
      type: "batch",
    },
    {
      id: "hist-4",
      at: hoursAgo(52),
      bakerName: harbor?.name ?? "Harbor Street Bakery",
      message: "Reminder: reservation pickup today by 7 PM",
      type: "reminder",
    },
    {
      id: "hist-5",
      at: hoursAgo(72),
      bakerName: crust?.name ?? "Crust & Crumb",
      message: "You reserved Soft Dinner Rolls (6)",
      type: "reserved",
    },
  ];
}

export function formatReservedAt(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return `Today · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatHistoryAt(iso: string): string {
  return formatReservedAt(iso);
}

export function reservationPriceLabel(product: Product | undefined, quantity: number): string {
  if (!product) return "";
  return formatPrice(product.price * quantity);
}
