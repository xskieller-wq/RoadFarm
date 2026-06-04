# RouteFarm QA Checklist

**Last run:** June 2026  
**Methods:** `npm run build`, HTTP smoke (dev server), code-path audit  
**Default:** `NEXT_PUBLIC_USE_SUPABASE=false`  
**Supabase:** Code verified; live DB not run in this pass

**Status:** `working` · `partially working` · `broken` · `missing`

---

## Infrastructure

| Feature | Status |
|---------|--------|
| Production build | working |
| npm workspaces | working |
| PostGIS migration | working |
| `.env.example` | working |
| Expo mobile app | missing |

---

## Demo mode (mock / localStorage)

| Feature | Route | Status | Notes |
|---------|-------|--------|-------|
| Homepage + parallax | `/` | working | HTTP 200 |
| Explore map | `/explore` | working | |
| Sellers directory | `/sellers` | working | |
| Seller profile | `/sellers/s1` | working | |
| Product detail | `/products/p1` | working | |
| Route search / map / results | `/search`, `/map`, `/results` | working | |
| Demo login | `/login` | working | Supports `?next=` redirect |
| Demo signup (buyer) | `/signup` | working | |
| Demo signup (seller) | `/signup` | working | Fixed: waits for hydrate, unique slug |
| Seller dashboard | `/dashboard` | working | `seller@routefarm.com` |
| Dashboard CRUD | `/dashboard/*` | working | localStorage |
| Admin panel | `/admin` | working | `admin@*` email |
| Reservations | product pages | partially working | Not persisted |
| Compliance form | `/dashboard/compliance` | partially working | UI only |
| Stale `.next` cache | — | partially working | Delete `.next` if 500s |

---

## Phase 1 — Supabase

| Feature | Route | Status | Notes |
|---------|-------|--------|-------|
| Email signup | `/signup` | working | |
| Email login | `/login` | working | `postAuthRedirect` + `?next=` |
| Auth callback | `/auth/callback` | working | |
| Session middleware | — | working | Protects dashboard, onboarding, API |
| Sign out | Header / dashboard | working | Clears Supabase + demo |
| Header session | Header | working | `usePhase1Session` |
| Buyer onboarding | `/onboarding/buyer` | working | |
| Buyer home gate | `/` | working | Middleware redirect |
| Seller onboarding | `/onboarding/seller` | working | Resume if seller exists |
| Seller dashboard gate | `/dashboard` | working | Fixed: incomplete onboarding → seller flow |
| Auth route redirect | `/login`, `/signup` | working | Fixed: `postAuthRedirect` not bare `/` |
| Product templates | `/dashboard/templates` | working | |
| Seller profile (slug / uuid) | `/sellers/[id]` | working | |
| Product detail (DB id) | `/products/[id]` | working | Falls back to mock when off |
| Home feed API | `/api/phase1/feed` | working | |
| Home feed UI | `/` | partially working | Live grid only when approved items exist; else mock bakery |
| Dashboard Postgres CRUD | `/dashboard/products` etc. | partially working | Still localStorage UI |
| Admin + Supabase | `/admin` | partially working | Demo email only |
| DB seed for feed | `supabase/seed.sql` | working | 5 sellers, 12 products, feed self-check |
| Mapbox / spatial search | — | missing | Phase 2 |
| RLS | DB | partially working | Policies in SQL; manual verify |

---

## Fixes in this pass

1. **Demo seller signup** — Submit no longer fails silently before marketplace hydrate; button disabled until ready.
2. **Seller dashboard bypass** — Middleware sends incomplete sellers to `/onboarding/seller`.
3. **Logged-in auth pages** — Redirect uses `postAuthRedirect` (role/onboarding aware).
4. **Login `?next=`** — Honored after successful login (demo + Supabase).
5. **Empty Supabase feed** — Homepage keeps mock bakery grid until feed has items.
6. **Build** — Login split into `LoginForm` + `Suspense` boundary.

---

## Manual Supabase test plan

Automated: `npm run test:supabase` (after Docker + `npm run db:reset` + `npm run setup:env`)

Full report: [QA_SUPABASE_TEST_REPORT.md](./QA_SUPABASE_TEST_REPORT.md) — **27/27 PASS** (June 2026)

1. `npx supabase start` && `npm run db:reset`
2. `npm run setup:env` → `.env.local` with `NEXT_PUBLIC_*` keys
3. `npm run test:supabase` — automated manual plan
4. `npm run dev` — homepage “Live from your marketplace” (12 seeded items)
