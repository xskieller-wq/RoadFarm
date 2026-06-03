# RouteFarm — Project Status

**Last updated:** June 2026  
**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind · client-side marketplace state

RouteFarm is a **local freshness marketplace** MVP (vegetables, fruit, flowers, eggs, honey, herbs, baked goods). Core value: **freshness labels + local pickup + seller availability** on a neighborhood map.

---

## Completed features

### Data & architecture
- Single runtime data source: `MarketplaceContext` + `marketplace-store.ts`
- Browser persistence: `localStorage` key `routefarm-marketplace-v3`
- Seed bootstrap only from `src/data/seed-data.ts` (not read at runtime except initial hydrate)
- Seller availability migration for legacy status values

### Buyer experience
- Homepage with category filters, mini product map, featured sellers, freshness highlights
- Explore map (`/explore`) with filters, product pins, listing sync
- Sellers directory (`/sellers`) with badges, types, ratings
- Seller public profiles (`/sellers/[id]`) — bio, photos, videos (thumbnails), pickup sidebar, products
- Product detail pages with freshness, seller info, media, reserve CTA
- Route-based discovery (`/map`, `/results`, `/search`) using mock detour logic
- Product/seller cards show trust info, badges, availability lines, freshness labels

### Seller availability & freshness
- Statuses: Available Now, Available Today, Pickup By Appointment, Temporarily Unavailable, Vacation
- Map filtering: hides vacation + temporarily unavailable; prioritizes Available Now pins
- Per-product **freshness labels** (separate from seller availability)
- Pickup hours (weekday/weekend windows + address) with sync to seller products

### Seller dashboard (`/dashboard`)
- Auth-gated shell with nav: Overview, Profile & media, Availability, Products
- Profile: name, bio, tagline, city, address, avatar/cover URLs, garden/flower/greenhouse photos, videos
- Availability: Available Now toggle, status select, pickup hours form
- Products: list, add, edit, mark sold, remove
- Product edit: freshness, photos (main + extra URLs), video URL fields
- `useSellerDashboard()` hook with pickup sync across products

### Admin (`/admin`)
- Overview stats
- Sellers: list, approve/reject, feature, verify, badges, manual add, per-seller edit
- Products: list + inline edit (including media and seller availability)
- Reviews: visibility toggle
- Reports: resolve/dismiss

### Other
- Demo auth (buyer / seller / admin by email pattern)
- Admin + seller product forms share marketplace state (edits propagate everywhere)
- Image catalog (`src/data/images.ts`) for category fallbacks
- Seller badges (`inferSellerBadges`, `SellerBadges` component)
- Compliance UI page for regulated categories (pickled/fermented) — form only

---

## Working features (verified in browser)

| Area | Route(s) | Notes |
|------|----------|--------|
| Homepage | `/` | Loads; map + listings use live context |
| Explore | `/explore` | Map + filters + product list |
| Sellers | `/sellers` | Full directory |
| Seller profile | `/sellers/s1` | Works after clean `.next` / dev restart |
| Product page | `/products/[id]` | Detail, reserve when seller pickup-ready |
| Dashboard | `/dashboard` | Use `seller@routefarm.com` (any password) |
| Admin | `/admin` | Use `admin@routefarm.com` |
| Available Now toggle | Dashboard overview + availability | Updates map sort/highlight |
| Vacation / unavailable | Dashboard availability | Hides pins on explore/home |
| Pickup hours | Dashboard availability + profile address | Syncs to product pickup fields |
| Freshness labels | Dashboard + admin product edit | Visible on cards and detail |
| Photos / videos (URLs) | Dashboard profile + product edit | Display on public pages |
| Cross-page sync | — | Edits persist in localStorage and reflect on explore, home, profiles |

**Dev server:** `npm run dev` on port 3000.  
**Do not** run `npm run build` while dev is running (risks corrupt `.next`).

---

## Known issues

| Issue | Impact | Mitigation |
|-------|--------|------------|
| Corrupt `.next` cache (`Cannot find module './vendor-chunks/clsx.js'`) | 500 on some routes (e.g. `/sellers/[id]`) | Stop dev → delete `.next` → `npm run dev` only |
| Cursor side preview shows stale Internal Server Error | Confusing UX while app works in browser | Hard-refresh preview or use external browser |
| Some seed / Pexels / Unsplash image URLs 404 | Broken images in console or UI | Fix URLs in `seed-data.ts` / `images.ts` as found |
| Video `url: "#"` in seed data | Play button is decorative; no playback | Replace with real URLs or add `<video>` player later |
| Auth session lost on page refresh | Must re-login | Expected for demo auth |
| Signup as seller uses `sellerId: "s-new"` | Dashboard has no matching seller record | Use `seller@routefarm.com` for seller QA |
| Reservations in-memory only | “Reserved” state lost on refresh | Not persisted |
| Compliance form does not save to seller | Pickled/fermented gate is UI-only | Implement backend + seller flags later |
| `npm run build` while dev running | Can break dev chunks | Run build only when dev is stopped |

---

## Remaining mock data

Everything below is **demo/seed content**, not a production database.

| Data | Source | Runtime behavior |
|------|--------|------------------|
| Sellers (~26) | `src/data/seed-data.ts` | Loaded into context; edits persist locally |
| Products (~79+) | `src/data/seed-data.ts` | Same |
| Reviews | `marketplace-store.ts` initial reviews | Admin can toggle visibility only |
| Reports | `marketplace-store.ts` initial reports | Admin resolve/dismiss only |
| Badges | `src/data/badges.ts` + inference | Assigned on seed; admin can override |
| Seller media enrichment | `src/data/seller-media.ts` | Placeholder video URLs (`#`) for some entries |
| Ratings / review counts | Seed fields on sellers | Not generated by user actions |
| Auth users | `AppContext` email rules | No real accounts |
| Reservations | `AppContext` React state | Not stored |
| Route search detours | `src/lib/route-search.ts` | Simplified mock distances |
| Grow More (`/grow-more`) | Static placeholder | Affiliate copy not wired |

**Persistence:** Only marketplace state (sellers, products, reviews, reports) in `localStorage`. Clearing `routefarm-marketplace-v3` resets to seed on next load.

**Media:** Photos and videos are **URL paste only** — no upload storage or CDN integration.

---

## Next priorities

Recommended order before new marketplace features:

1. **Stabilize dev workflow** — Document “dev only” rule; optional script to clean `.next`; fix remaining broken image URLs in seed/catalog.
2. **Complete seller QA fixes** — Wire signup to a real seller record (or block signup until backend exists); persist auth session (even if demo).
3. **Video playback** — `<video>` or embed for real URLs; hide or label `#` placeholders.
4. **Reservations MVP** — Persist to localStorage or API; seller view of incoming reservations (if in scope).
5. **Compliance persistence** — Save compliance flag per seller; enforce on product create.
6. **Backend** — Replace seed + localStorage with API/DB; real auth; file uploads for photos/videos.
7. **Production build** — Verify `npm run build` + `npm start` on clean machine without dev corruption.

**Explicitly deferred (per product direction):** subscriptions, alerts, AI, advanced reservations, Grow More affiliates, new product categories.

---

## Demo accounts (QA)

| Role | Email | Password |
|------|-------|----------|
| Seller (Green Valley Farm, `s1`) | `seller@routefarm.com` | any |
| Admin | `admin@routefarm.com` | any |
| Buyer | any other email | any |

---

## Key files

| Purpose | Path |
|---------|------|
| Marketplace state | `src/context/MarketplaceContext.tsx`, `src/context/marketplace-store.ts` |
| Persistence | `src/lib/marketplace-persistence.ts` |
| Seed data | `src/data/seed-data.ts` |
| Seller dashboard hook | `src/lib/use-seller-dashboard.ts` |
| Availability logic | `src/lib/seller-availability.ts` |
| Freshness logic | `src/lib/freshness.ts` |
| Demo auth | `src/context/AppContext.tsx` |

For manual testing, see the MVP QA checklist from the latest session (homepage → explore → sellers → profile → product → dashboard → admin → sync tests).
