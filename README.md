# RouteFarm

**Find fresh local products on your way with minimal detour.**

RouteFarm is a responsive web application MVP that helps users discover and reserve local products available along their daily routes — eggs, vegetables, honey, flowers, bouquets, and more from sellers in Norridge, Park Ridge, Des Plaines, and surrounding Illinois communities.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**

This is a **frontend prototype** using mock data only. No backend or real APIs are connected.

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
| Login | `/login` | Sign in |
| Signup | `/signup` | Create account |

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
