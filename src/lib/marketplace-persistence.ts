import type { MarketplaceState } from "@/context/marketplace-store";
import type { Product, Seller, SellerAvailabilityStatus } from "@/lib/types";
import { isBakeryCategory } from "@/lib/categories";
import { BAKERY_PRODUCT_SEEDS } from "@/data/bakery-seed";
import { inferFreshnessLabel } from "@/lib/freshness";
import {
  getBakerAvatarImage,
  getBakerCoverImage,
  getBakeryProductImage,
} from "@/data/images";

const STORAGE_KEY = "routefarm-marketplace-v9";
const LEGACY_STORAGE_KEYS = [
  "routefarm-marketplace-v8",
  "routefarm-marketplace-v7",
  "routefarm-marketplace-v6",
] as const;

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

function refreshBakerSeller(seller: Seller, index: number): Seller {
  if (seller.sellerType !== "Baker") return seller;
  return {
    ...seller,
    avatar: getBakerAvatarImage(seller.specialties, index),
    coverPhoto: getBakerCoverImage(seller.specialties),
  };
}

function refreshProductPhoto(product: Product): Product {
  if (!isBakeryCategory(product.category)) return product;
  const url = getBakeryProductImage(product.category, product.title);
  return {
    ...product,
    photos: [{ url, type: "product" as const }],
  };
}

function rebuildBakeryProducts(sellers: Seller[], existing: Product[]): Product[] {
  const futureOnly = existing.filter((p) => !isBakeryCategory(p.category));
  let nextNum = existing.reduce((max, p) => {
    const n = parseInt(p.id.replace(/^p/, ""), 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);

  const bakery: Product[] = [];
  for (const template of BAKERY_PRODUCT_SEEDS) {
    const seller = sellers.find((s) => s.id === template.sellerId);
    if (!seller) continue;
    nextNum += 1;
    const row: Product = {
      ...template,
      id: `p${nextNum}`,
      createdAt: new Date().toISOString(),
      pickupLocation: seller.pickupLocation,
      pickupHours: seller.pickupHours,
      photos: [
        {
          url: getBakeryProductImage(template.category, template.title),
          type: "product" as const,
        },
      ],
      videos: [],
      freshnessLabel: template.freshnessLabel ?? inferFreshnessLabel(template as Product),
    };
    bakery.push(row);
  }

  return [...futureOnly, ...bakery];
}

/** Normalize persisted or seed marketplace data (bakery catalog, photos, availability). */
export function normalizeMarketplaceState(raw: MarketplaceState): MarketplaceState {
  const sellers = raw.sellers.map((s, i) =>
    refreshBakerSeller(
      {
        ...s,
        availabilityStatus: migrateSellerAvailability(s.availabilityStatus),
      },
      i
    )
  );

  return {
    ...raw,
    sellers,
    products: rebuildBakeryProducts(sellers, raw.products).map((p) =>
      refreshProductPhoto({
        ...p,
        photos: p.photos?.length ? p.photos : [],
        videos: p.videos ?? [],
      })
    ),
  };
}

export function loadPersistedMarketplace(): MarketplaceState | null {
  if (typeof window === "undefined") return null;
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MarketplaceState;
    if (!parsed.sellers?.length || !parsed.products?.length) return null;
    return normalizeMarketplaceState(parsed);
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
