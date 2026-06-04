# RouteFarm — Supabase Manual Test Report

**Date:** June 2026 (updated after infrastructure fix)  
**Command:** `npx supabase start` → `npm run db:reset` → `npm run setup:env` → `npm run test:supabase`  
**Result:** **27 / 27 PASS**

---

## Root cause: seed failure

| Issue | Cause | Fix |
|-------|--------|-----|
| `function routefarm_seed_demo_user(...) does not exist` | Supabase seed runner splits SQL on `;`, which broke the PL/pgSQL `CREATE FUNCTION` body. `SELECT routefarm_seed_demo_user(...)` ran without a valid function. | Removed helper function; use plain `INSERT` statements in `supabase/seed.sql`. |
| `invalid input syntax for type uuid: "t1000001-..."` | Template/product IDs used non-hex prefixes (`t`, `p`, `i`). UUIDs only allow `0-9a-f`. | Renamed to `f1000001` (templates), `c1000001` (products), `e1000001` (identities). |
| E2E env missing | `supabase status -o env` outputs `ANON_KEY` / `API_URL`, not `NEXT_PUBLIC_*`. | `scripts/setup-env-local.mjs` maps to Next.js variable names. |

---

## Manual test plan results

| # | Test | Result |
|---|------|--------|
| 1 | `supabase start` + `db reset` + seed | **PASS** |
| 2 | `.env.local` via `npm run setup:env` | **PASS** |
| 3 | **Signup** (new buyer) | **PASS** |
| 4 | **Signup** (new seller) | **PASS** |
| 5 | **Login** (seeded seller `harbor@demo.routefarm.local`) | **PASS** |
| 6 | **Login** (seeded buyer `buyer@demo.routefarm.local`) | **PASS** |
| 7 | **Buyer onboarding** (save + complete flag) | **PASS** |
| 8 | **Buyer redirect** (new buyer → `/onboarding/buyer`) | **PASS** |
| 9 | **Buyer redirect** (completed → `/`) | **PASS** |
| 10 | **Seller onboarding** (profile + template + product) | **PASS** |
| 11 | **Seller redirect** (new seller → `/onboarding/seller`) | **PASS** |
| 12 | **Seller approval** → feed repopulates | **PASS** (0 → 1 feed row after approve) |
| 13 | **Seller products** (seeded seller ≥ 2) | **PASS** |
| 14 | **Feed population** (seed ≥ 12 items) | **PASS** (12 items) |
| 15 | **Redirects** (seller login → `/dashboard`) | **PASS** |
| 16 | **Dashboard access** (onboarded seller) | **PASS** |
| 17 | **Logout** clears session | **PASS** |
| 18 | **Feed API** (REST `home_feed_items`) | **PASS** |

---

## Seeded demo data (after `db reset`)

| Email | Password | Role |
|-------|----------|------|
| `harbor@demo.routefarm.local` | `RouteFarmDemo1!` | Seller (approved, featured) |
| `sunrise@demo.routefarm.local` | `RouteFarmDemo1!` | Seller |
| `loafhouse@demo.routefarm.local` | `RouteFarmDemo1!` | Seller |
| `celebration@demo.routefarm.local` | `RouteFarmDemo1!` | Seller |
| `elm@demo.routefarm.local` | `RouteFarmDemo1!` | Seller |
| `buyer@demo.routefarm.local` | `RouteFarmDemo1!` | Buyer (onboarding done) |

**Feed:** 12 products — paczki, sourdough, donuts, pastries, rolls, cakes, cookies.

**Example URLs:**
- Seller: `/sellers/harbor-street-bakery`
- Product: `/products/c1000001-0001-4001-8001-000000000001`

---

## Homepage verification

```bash
npm run dev
```

With `NEXT_PUBLIC_USE_SUPABASE=true` in `.env.local`:

1. Open `http://localhost:3000`
2. Section **“Live from your marketplace”** shows 12 seeded items
3. Product links use `/products/c1000001-...` IDs

---

## Commands reference

```bash
npx supabase start
npm run db:reset
npm run setup:env
npm run test:supabase
npm run dev
```

---

## Files changed

| File | Change |
|------|--------|
| `supabase/seed.sql` | Inline auth INSERTs; valid UUIDs; removed `routefarm_seed_demo_user` |
| `scripts/setup-env-local.mjs` | Map `API_URL` / `ANON_KEY` → `NEXT_PUBLIC_*` |
| `docs/QA_SUPABASE_TEST_REPORT.md` | This report |
