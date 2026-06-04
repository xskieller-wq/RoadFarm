# FreshDrop — Master Product & Engineering Spec

**Purpose:** Single doctrine file for Cursor and humans. Preserves current product decisions so future work does not drift, redesign, or break stable buyer flows.

**Repo:** `RoadFarm` monorepo (package name `routefarm`). **Buyer-facing brand:** FreshDrop. **Seller/admin legacy:** RouteFarm areas remain for dashboard and admin.

**Last aligned:** June 2026

---

## 1. Product north star

FreshDrop is a **buyer-first local bakery marketplace**: discover today’s fresh drops, follow neighborhood bakers, reserve pickup, and build a morning ritual—not a generic multi-category marketplace.

**Phase 1 focus:** bakery / baked goods. Other categories exist in data but are not the launch story.

**Core feelings:** warm, neighborhood, morning bakery—not candy-shop neon, not “city marketplace” chrome.

---

## 2. Non-negotiables for AI and contributors

| Rule | Detail |
|------|--------|
| **No surprise redesigns** | Do not redesign Homepage, Browse, Map, Alerts, or Account UI unless explicitly requested. |
| **No new project** | Work in this monorepo; extend `src/`, `packages/`, `supabase/`. |
| **Buyer launch first** | Homepage + buyer hub (`/buy/*`) are the hero surfaces; seller dashboard and admin are secondary. |
| **Demo must work offline** | With Supabase down or unset, app must load fast with mock/`MarketplaceContext` data. |
| **Supabase is opt-in locally** | See §7. Never block demo on auth network calls. |

---

## 3. Information architecture (current)

### Primary header nav (buyer)

| Label | Route | Notes |
|-------|-------|--------|
| Browse | `/buy` | Buyer hub / account shell; dense demo reservations, saved, follows |
| Map | `/explore` | Explore map + filters (not `/map` in main nav—`/map` is route-search) |
| Alerts | `/buy/alerts` | Drop alerts demo content |
| Account | `/buy` when signed in, `/login` when not | Uses demo `AuthProvider` or Phase 1 session when live |

**Removed from main nav (do not restore without ask):** Dashboard, “For bakers” as primary nav items.

### Key routes

| Route | Role |
|-------|------|
| `/` | Launch homepage (featured drop, compact row, more grid, sellers chips, demoted map/route) |
| `/buy` | Account |
| `/buy/alerts` | Alerts |
| `/buy/following` | Following |
| `/explore` | Map browse |
| `/map`, `/results`, `/search` | Route-based discovery (supporting) |
| `/sellers`, `/sellers/[id]` | Directory + public seller |
| `/products/[id]` | Product detail |
| `/login`, `/signup` | Auth (demo + optional Supabase) |
| `/dashboard/*` | Seller tools (Supabase-gated when live) |
| `/admin/*` | Admin (demo auth pattern) |
| `/onboarding/buyer`, `/onboarding/seller` | Phase 1 onboarding |

---

## 4. Launch homepage structure (frozen layout intent)

**File:** `src/components/home/HomePageContent.tsx`

1. **Hero / scroll background** — warm bakery food imagery (bread/sourdough), not architecture-only exteriors.
2. **Featured drop** — one hero card (`LaunchFeaturedDrop`).
3. **Compact row** — four compact cards (`LaunchCompactRow` / `LaunchCompactCard`).
4. **More drops grid** — secondary grid (`LaunchProductGrid`).
5. **Sellers locals love** — compact chips (`SellersLocalsChips`), not a heavy carousel.
6. **Map / route search** — present but **demoted** below drops; not the primary fold story.

**Data:** Default = `MarketplaceContext` bakery products → `productsToMockDrops` → `bakeryLaunchDrops`. Optional live feed only when Supabase live gate is on and feed returns items.

**Do not:** Revert to old multi-category homepage hero, huge map-first layout, or “city marketplace” art direction.

---

## 5. Buyer hub (Account / Browse / Alerts)

- Shell: `FreshDropPageShell` + `BuyerHubNav` where applicable.
- **Account** (`/buy`): reservations, saved products, preferences demo—`AccountPageContent`.
- **Alerts** (`/buy/alerts`): alert list demo.
- **Following** (`/buy/following`): follow cards; follows persist via `FollowContext` + `localStorage` with demo defaults.
- **FollowProvider** lives in `src/app/layout.tsx` (root) for cross-page sync.

---

## 6. Data & auth modes

### Demo mode (default local)

- `MarketplaceContext` + `AppContext` (`AuthProvider`) + `localStorage`.
- Demo login: email patterns (`admin`, `seller` in email) — see `PROJECT_STATUS.md`.
- No Supabase auth calls on Browse, Account, Alerts, Header, or layout in local demo.

### Phase 1 Supabase mode

- Feature flag: `NEXT_PUBLIC_USE_SUPABASE=true` plus URL + anon key.
- **Local dev live gate:** also requires `NEXT_PUBLIC_SUPABASE_LIVE=true` or auth/API stay off (fast demo).
- Hooks: `usePhase1Session`, `useHomeFeed`, `useSellerProfile`, etc. gated by `isPhase1SupabaseEnabled()` in `src/lib/phase1/config.ts`.

---

## 7. Supabase module wiring (stable pattern)

**Problem this solves:** `@routefarm/supabase/live` subpaths, middleware importing browser bundles, and `server.ts` (`next/headers`) leaking into client code.

### Import rules

| Consumer | Import from |
|----------|-------------|
| Client components | `@routefarm/supabase/browser` only (dynamic import when possible) |
| Server routes / RSC | `@routefarm/supabase/server` only |
| Middleware, edge | `@/lib/phase1/config` only for enablement—**never** `@routefarm/supabase` barrel |
| Cookies typing | `@routefarm/supabase/cookies` |
| Enablement check (app) | `@/lib/phase1/config` → `isPhase1SupabaseEnabled()` |
| Enablement check (package) | `packages/supabase/src/enabled.ts` → `isSupabaseEnabled()` |

### Package exports (`@routefarm/supabase`)

- `.` → browser client + `isSupabaseEnabled` (no server)
- `./browser`, `./server`, `./cookies` only
- **No** `./live`, **no** `./graceful-fetch` public subpaths

### `packages/supabase/src/index.ts`

Must **never** re-export `server.ts`.

### Client session hook

`src/lib/phase1/use-phase1-session.ts`:

- If `!isPhase1SupabaseEnabled()` → return demo/null session immediately (no `getUser`, no `getSession`, no refresh).
- If live → dynamic `import("@routefarm/supabase/browser")` then `getUser()` only inside guarded path.

### Middleware

`src/middleware.ts`: if `!isPhase1SupabaseEnabled()` → `NextResponse.next()` with no Supabase client.

---

## 8. Environment variables

```env
# Demo (typical local daily work)
NEXT_PUBLIC_USE_SUPABASE=false

# Full stack local (Supabase CLI running)
NEXT_PUBLIC_USE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<server only>
NEXT_PUBLIC_SUPABASE_LIVE=true   # required in development for real auth/API
```

---

## 9. Visual / content guardrails

- **Imagery:** food-first bakery photos; avoid wrong Pexels IDs and sprinkle-donut “bakery” clichés documented in image helpers under `src/lib/freshdrop/` and `src/data/images.ts`.
- **Categories:** launch story = bakery; `isBakeryCategory` filters homepage feed.
- **Typography / shell:** Inter; warm panels via `launch-card-styles`, `FreshDropPageShell`, `HomeScrollBackground`.

---

## 10. Phase 1 backend scope (when live)

See `docs/PHASE1_MVP.md` and `docs/ARCHITECTURE.md`:

- Auth, buyer/seller onboarding, seller profiles (slug, PostGIS), product templates, home feed API `/api/phase1/feed`.
- **Out of scope:** Mapbox routes, payments, push, full admin rewrite.

---

## 11. Dev workflow

```bash
npm run dev          # http://localhost:3000
npm run build        # only when dev server is stopped
```

If corrupt chunks: stop dev → delete `.next` → `npm run dev`.

**QA surfaces after any auth/module change:** `/`, `/buy`, `/buy/alerts`, `/explore` — must return 200 with no runtime module errors.

---

## 12. Related docs

| File | Contents |
|------|----------|
| `PROJECT_STATUS.md` | Prototype feature checklist, demo auth, known issues |
| `docs/ARCHITECTURE.md` | Stack, folders, data model |
| `docs/PHASE1_MVP.md` | Phase 1 acceptance criteria |
| `docs/QA_CHECKLIST.md` | Manual QA list |
| `.env.example` | Env template |

---

## 13. Change log (doctrine)

| Date | Note |
|------|------|
| Jun 2026 | FreshDrop launch homepage + buyer hub; header nav = Browse/Map/Alerts/Account |
| Jun 2026 | Supabase wiring stabilized: removed `@routefarm/supabase/live`; middleware uses `config` only; barrel is browser-safe |
