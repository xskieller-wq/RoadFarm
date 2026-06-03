/** RouteFarm long-term product areas — reference for nav and landing pages */

export const ROUTEFARM_AREAS = {
  buyers: {
    id: "buyers",
    label: "Buyers",
    cta: "I want to buy",
    href: "/buy",
    description:
      "Discover fresh local products from neighbors — map, route search, seller profiles, freshness, and pickup reservations.",
    features: [
      "Neighborhood product map",
      "Nearby products & filters",
      "Along My Route search",
      "Seller profiles & reviews",
      "Freshness information",
      "Pickup reservations",
    ],
    productTypes: [
      "Vegetables",
      "Fruit",
      "Flowers",
      "Bouquets",
      "Eggs",
      "Honey",
      "Baked goods",
      "Preserves",
      "Pickled foods",
    ],
  },
  sellers: {
    id: "sellers",
    label: "Growers & sellers",
    cta: "I want to sell",
    href: "/sell",
    description:
      "For people who grow, harvest, arrange, bake, or make products to share with neighbors.",
    features: [
      "Seller profile & story",
      "Product listings",
      "Garden & product photos",
      "Video tours",
      "Pickup availability",
      "Freshness settings",
      "Trust badges",
      "Grower dashboard",
    ],
  },
  admin: {
    id: "admin",
    label: "Admin",
    href: "/admin",
    loginHref: "/login",
    loginHint: "admin@routefarm.com",
    description: "Internal tools to approve sellers, curate the marketplace, and moderate the community.",
    features: [
      "Sellers & approval",
      "Products",
      "Badges & featured profiles",
      "Reviews",
      "Reports",
      "Seller photos & videos (per profile)",
    ],
  },
  growMore: {
    id: "grow-more",
    label: "Grow More",
    href: "/grow-more",
    description:
      "Future grower education — separate from the buyer marketplace. Help people start and expand backyard businesses.",
    comingSoon: true,
  },
} as const;

export const GROW_MORE_TOPICS = [
  { id: "towers", title: "Vertical Growing Towers", emoji: "🌿", blurb: "Maximize small yards with stacked growing systems." },
  { id: "beds", title: "Raised Garden Beds", emoji: "🪴", blurb: "Start with controlled soil and easier harvest access." },
  { id: "greenhouses", title: "Greenhouses", emoji: "🏡", blurb: "Extend your season for vegetables and seedlings." },
  { id: "irrigation", title: "Irrigation Systems", emoji: "💧", blurb: "Save time with drip lines and timers." },
  { id: "hydroponics", title: "Hydroponics", emoji: "🧪", blurb: "Grow without soil in compact setups." },
  { id: "seeds", title: "Seed Starting", emoji: "🌱", blurb: "Trays, heat mats, and lights for strong starts." },
  { id: "tools", title: "Gardening Tools", emoji: "🛠️", blurb: "Essential hand tools for daily garden work." },
] as const;
