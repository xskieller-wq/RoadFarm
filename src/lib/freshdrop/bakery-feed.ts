import type { HomeFeedItem } from "@routefarm/shared";
import type { ProductCategory } from "@/lib/types";
import { isLaunchBakeryFeedItem } from "@/lib/freshdrop/homepage-bakery";

type BakeryDiversityKind =
  | "paczki"
  | "sourdough"
  | "rye"
  | "croissant"
  | "pastry"
  | "cookie"
  | "cake"
  | "donut"
  | "bread_other";

/** Slot order: hero → compact row (4) → lower grid (4). */
const HOMEPAGE_SLOT_SEQUENCE: BakeryDiversityKind[] = [
  "paczki",
  "sourdough",
  "rye",
  "croissant",
  "donut",
  "cookie",
  "cake",
  "pastry",
  "bread_other",
];

/** Max cards per kind on the homepage product zones (9 visible cards). */
const HOMEPAGE_KIND_CAP: Partial<Record<BakeryDiversityKind, number>> = {
  paczki: 1,
  donut: 1,
  sourdough: 1,
  rye: 1,
  croissant: 1,
  cookie: 1,
  cake: 1,
  pastry: 1,
  bread_other: 1,
};

function classifyKind(item: HomeFeedItem): BakeryDiversityKind | null {
  const t = item.title.toLowerCase();
  const cat = item.category as ProductCategory;

  if (cat === "Polish Paczki" || t.includes("paczki") || t.includes("paczek")) {
    return "paczki";
  }
  if (cat === "Donuts" || t.includes("donut")) return "donut";
  if (cat === "Cookies" || t.includes("cookie")) return "cookie";
  if (cat === "Cakes" || t.includes("cake") || t.includes("cupcake")) return "cake";
  if (t.includes("croissant")) return "croissant";
  if (t.includes("sourdough")) return "sourdough";
  if (t.includes("rye")) return "rye";
  if (
    cat === "Pastries" ||
    t.includes("pastry") ||
    t.includes("pastries") ||
    t.includes("danish") ||
    t.includes("bear claw") ||
    t.includes("palmier") ||
    t.includes("muffin") ||
    t.includes("cinnamon roll")
  ) {
    return "pastry";
  }
  if (cat === "Bread") return "bread_other";
  return null;
}

function dedupeBakery(items: HomeFeedItem[]): HomeFeedItem[] {
  const bakery = items.filter(isLaunchBakeryFeedItem);
  const seen = new Set<string>();
  const unique: HomeFeedItem[] = [];

  for (const item of bakery) {
    const key = `${item.seller_id}:${item.title.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

function bucketByKind(pool: HomeFeedItem[]): Map<BakeryDiversityKind, HomeFeedItem[]> {
  const buckets = new Map<BakeryDiversityKind, HomeFeedItem[]>();
  for (const item of pool) {
    const kind = classifyKind(item);
    if (!kind) continue;
    const list = buckets.get(kind) ?? [];
    list.push(item);
    buckets.set(kind, list);
  }
  return buckets;
}

function kindCount(counts: Map<BakeryDiversityKind, number>, kind: BakeryDiversityKind): number {
  return counts.get(kind) ?? 0;
}

function canTake(
  counts: Map<BakeryDiversityKind, number>,
  kind: BakeryDiversityKind
): boolean {
  const cap = HOMEPAGE_KIND_CAP[kind];
  if (cap === undefined) return true;
  return kindCount(counts, kind) < cap;
}

function takeFromBucket(
  buckets: Map<BakeryDiversityKind, HomeFeedItem[]>,
  kind: BakeryDiversityKind,
  used: Set<string>,
  excludeProductId?: string
): HomeFeedItem | null {
  const list = buckets.get(kind);
  if (!list?.length) return null;

  const idx = list.findIndex(
    (item) =>
      !used.has(item.product_id) &&
      (!excludeProductId || item.product_id !== excludeProductId)
  );
  if (idx < 0) return null;

  const [item] = list.splice(idx, 1);
  used.add(item.product_id);
  return item;
}

function pickForKind(
  buckets: Map<BakeryDiversityKind, HomeFeedItem[]>,
  kind: BakeryDiversityKind,
  used: Set<string>,
  counts: Map<BakeryDiversityKind, number>,
  excludeProductId?: string
): HomeFeedItem | null {
  if (!canTake(counts, kind)) return null;
  const item = takeFromBucket(buckets, kind, used, excludeProductId);
  if (item) {
    counts.set(kind, kindCount(counts, kind) + 1);
  }
  return item;
}

function pickWithFallbacks(
  buckets: Map<BakeryDiversityKind, HomeFeedItem[]>,
  primary: BakeryDiversityKind,
  fallbacks: BakeryDiversityKind[],
  used: Set<string>,
  counts: Map<BakeryDiversityKind, number>,
  excludeProductId?: string
): HomeFeedItem | null {
  const item =
    pickForKind(buckets, primary, used, counts, excludeProductId) ??
    fallbacks
      .map((kind) => pickForKind(buckets, kind, used, counts, excludeProductId))
      .find(Boolean) ??
    null;
  return item ?? null;
}

/** Curated, diverse bakery order for homepage rows (no paczki clustering in lower grids). */
export function bakeryLaunchDrops(items: HomeFeedItem[]): HomeFeedItem[] {
  const pool = dedupeBakery(items);
  const buckets = bucketByKind(pool);
  const used = new Set<string>();
  const counts = new Map<BakeryDiversityKind, number>();
  const ordered: HomeFeedItem[] = [];

  let featuredId: string | undefined;

  for (let i = 0; i < HOMEPAGE_SLOT_SEQUENCE.length; i++) {
    const kind = HOMEPAGE_SLOT_SEQUENCE[i];
    const exclude =
      kind === "paczki" && featuredId ? featuredId : undefined;

    const fallbacks: BakeryDiversityKind[] =
      kind === "donut"
        ? ["bread_other", "pastry", "cookie"]
        : kind === "croissant"
          ? ["pastry", "cookie"]
          : kind === "pastry"
            ? ["cookie", "cake", "bread_other"]
            : ["pastry", "cookie", "bread_other"];

    const pick = pickWithFallbacks(buckets, kind, fallbacks, used, counts, exclude);
    if (pick) {
      if (i === 0) featuredId = pick.product_id;
      ordered.push(pick);
    }
  }

  return ordered;
}

/** All live bakery drops for /browse (no homepage slot caps). */
export function bakeryBrowseDrops(items: HomeFeedItem[]): HomeFeedItem[] {
  return dedupeBakery(items);
}
