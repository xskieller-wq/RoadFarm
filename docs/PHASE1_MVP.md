# RouteFarm — Phase 1 MVP

## Goals

Build production foundations for:

1. **Authentication** — Supabase Auth (email/password); session in cookies (SSR-safe)
2. **Buyer onboarding** — role, neighborhood, interests; gate home until complete
3. **Seller onboarding** — bakery/seller type, business name, location, pickup basics
4. **Seller profiles** — public slug, bio, cover, PostGIS location, approval state
5. **Product templates** — per-seller templates by category (title/description/freshness defaults)
6. **Home Feed** — server-driven feed of approved seller products (bakery-first)

## Out of scope (Phase 1)

- Mapbox route geometry
- Payments
- Push notifications
- Full admin panel rewrite (keep existing admin UI; wire auth only)
- React Native feature parity (scaffold only)

## Acceptance criteria

- [ ] User can sign up as buyer or seller
- [ ] Buyer completes onboarding and sees Home Feed from Supabase
- [ ] Seller completes onboarding; profile visible at `/sellers/[slug]`
- [ ] Seller can create product from template
- [ ] RLS: users only edit own profile/seller/products
- [ ] `npm run build` passes with Supabase env optional

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only
NEXT_PUBLIC_USE_SUPABASE=false      # true to enable Phase 1 backend
NEXT_PUBLIC_MAPBOX_TOKEN=           # Phase 2+
```
