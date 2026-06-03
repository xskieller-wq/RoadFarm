import type { MarketplaceState } from "@/context/marketplace-store";
import type { Seller, SellerAvailabilityStatus } from "@/lib/types";

const STORAGE_KEY = "routefarm-marketplace-v3";

function migrateSellerAvailability(status: string | undefined): SellerAvailabilityStatus {
  switch (status) {
    case "available_now":
    case "available_today":
    case "pickup_by_appointment":
    case "temporarily_unavailable":
    case "vacation":
      return status;
    case "regular":
      return "available_today";
    default:
      return "available_today";
  }
}

function migrateState(raw: MarketplaceState): MarketplaceState {
  return {
    ...raw,
    sellers: raw.sellers.map((s) => ({
      ...s,
      availabilityStatus: migrateSellerAvailability(s.availabilityStatus),
    })),
    products: raw.products.map((p) => ({
      ...p,
      photos: p.photos?.length ? p.photos : [],
      videos: p.videos ?? [],
    })),
  };
}

export function loadPersistedMarketplace(): MarketplaceState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MarketplaceState;
    if (!parsed.sellers?.length || !parsed.products?.length) return null;
    return migrateState(parsed);
  } catch {
    return null;
  }
}

export function persistMarketplace(state: MarketplaceState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or private mode */
  }
}

export function clearPersistedMarketplace(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
