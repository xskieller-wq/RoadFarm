/** Bakery-first MVP categories (Phase 1 launch) */
export const BAKERY_CATEGORIES = [
  "Polish Paczki",
  "Donuts",
  "Bread",
  "Cakes",
  "Pastries",
  "Cookies",
] as const;

export const DEFAULT_MAP_CENTER = {
  lat: 41.9654,
  lng: -87.8078,
  label: "Norridge, IL",
} as const;

export const ONBOARDING_ROUTES = {
  buyer: "/onboarding/buyer",
  seller: "/onboarding/seller",
  login: "/login",
  signup: "/signup",
  feed: "/",
  sellerDashboard: "/dashboard",
} as const;
