# RouteFarm — Architecture (Source of Truth)

**Product:** Local freshness marketplace — discover and reserve bakery (Phase 1 focus) and future categories from neighbors near your route.

**Phase 1 scope:** Authentication · Buyer onboarding · Seller onboarding · Seller profiles · Product templates · Home Feed

**Stack:**

| Layer | Technology |
|-------|------------|
| Web | Next.js 15, App Router, TypeScript, Tailwind |
| Mobile (Phase 1 scaffold) | React Native, Expo |
| Backend | Supabase (Auth, Postgres, Storage, Edge Functions) |
| Database | PostgreSQL + **PostGIS** (seller/product locations) |
| Maps (later phases) | Mapbox |

---

## Repository layout

```
RouteFarm/
├── apps/
│   ├── web/                 # Next.js (production web lives at repo root `src/` during transition)
│   └── mobile/              # Expo / React Native
├── packages/
│   ├── shared/              # Types, constants, validation (Zod)
│   ├── database/            # DB types + query helpers
│   └── supabase/            # Supabase client factories (browser + server)
├── supabase/
│   ├── migrations/          # SQL schema (PostGIS, RLS)
│   └── seed.sql             # Optional dev seed
├── docs/                    # Product + engineering docs (this file, PHASE1_MVP.md)
└── src/                     # Current Next.js app (integrates Phase 1 packages)
```

---

## Data model (Phase 1)

- **auth.users** — Supabase Auth
- **profiles** — `role`: buyer | seller | admin; onboarding timestamps
- **buyer_profiles** — neighborhood, map preferences
- **sellers** — public seller profile, PostGIS `location`, approval status
- **seller_onboarding_steps** — checklist state per seller
- **product_templates** — reusable listing templates per seller/category
- **products** — live listings (optional `template_id`)
- **home_feed_items** — materialized feed rows for Home Feed (products + freshness)

---

## Auth flows

1. Sign up → Supabase Auth → trigger creates `profiles` row
2. Buyer → `/onboarding/buyer` until `buyer_onboarding_completed_at` set
3. Seller → `/onboarding/seller` → creates `sellers` row → steps → dashboard
4. Middleware protects `/dashboard`, `/onboarding/*`

---

## Integration with existing prototype

The current app uses `MarketplaceContext` + `localStorage` for demo data. Phase 1 adds Supabase behind feature flag `NEXT_PUBLIC_USE_SUPABASE=true`. When false, existing mock behavior remains.

---

## References

- `PROJECT_STATUS.md` — shipped prototype features
- `src/data/routefarm-structure.ts` — buyer / seller / admin product areas
- `src/lib/types.ts` — domain types (align with `packages/shared`)
