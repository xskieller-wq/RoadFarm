# RouteFarm

**Find fresh local products on your way with minimal detour.**

RouteFarm is a responsive web application MVP that helps users discover and reserve local products available along their daily routes — eggs, vegetables, honey, flowers, bouquets, and more from sellers in Norridge, Park Ridge, Des Plaines, and surrounding Illinois communities.

## Tech Stack

- **Next.js 15** (App Router) — web app at repo root `src/`
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, PostgreSQL, PostGIS) — Phase 1 when enabled
- **Expo** — `apps/mobile/` scaffold (Phase 1b)
- **Mapbox** — Phase 2+

By default the app runs on **mock data** (`localStorage`). Set `NEXT_PUBLIC_USE_SUPABASE=true` and Supabase env vars to use Phase 1 auth, onboarding, seller profiles, templates, and home feed.

See [docs/PHASE1_MVP.md](docs/PHASE1_MVP.md) and [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- npm (included with Node.js)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Phase 1 with Supabase (optional)

1. Copy `.env.example` to `.env.local` and set Supabase URL + anon key.
2. Install [Supabase CLI](https://supabase.com/docs/guides/cli) and run:

```bash
supabase start
supabase db reset
```

3. Set `NEXT_PUBLIC_USE_SUPABASE=true` in `.env.local` (copy anon URL/key from `npx supabase status`).
4. `npx supabase db reset` loads **demo bakery seed** (5 approved sellers, 12 products, live home feed).
5. Optional logins (password `RouteFarmDemo1!`):
   - `buyer@demo.routefarm.local` — buyer, onboarding complete
   - `harbor@demo.routefarm.local` — Harbor Street Bakery seller
   - `sunrise@demo.routefarm.local`, `loafhouse@demo.routefarm.local`, etc.
6. Open `/` — “Live from your marketplace” shows seeded paczki, sourdough, donuts, pastries, and rolls.

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Homepage with route search |
| Route Search | `/search` | Dedicated search page |
| Results | `/results` | Products along your route |
| Map View | `/map` | Visual map of products on route |
| Product Detail | `/products/[id]` | Product info and reservation |
| Seller Profile | `/sellers/[id]` | Seller trust profile |
| Seller Dashboard | `/dashboard` | Manage products |
| Add Product | `/dashboard/products/new` | List new product |
| Compliance | `/dashboard/compliance` | Cottage food onboarding |
| Login | `/login` | Sign in (Supabase when enabled) |
| Signup | `/signup` | Create account |
| Buyer onboarding | `/onboarding/buyer` | Phase 1 |
| Seller onboarding | `/onboarding/seller` | Phase 1 |
| Product templates | `/dashboard/templates` | Seller templates |
| Home feed API | `/api/phase1/feed` | JSON feed |

## Demo Accounts

- **Buyer:** any email (e.g. `buyer@email.com`)
- **Seller:** use an email containing `seller` (e.g. `seller@email.com`)

## Mock Data

- **27 sellers** across Norridge, Park Ridge, Des Plaines, Harwood Heights, Schiller Park, and Elmwood Park
- **100+ products** across all MVP categories

## Main User Flow

1. Enter start location and destination
2. Choose maximum detour (0, 2, 5, or 10 minutes)
3. Browse products along your route
4. View product details and seller profile
5. Reserve for pickup (no payment in MVP)
