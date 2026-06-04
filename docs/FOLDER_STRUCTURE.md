# RouteFarm — Folder Structure (Phase 1)

```
RouteFarm/
├── apps/
│   ├── web/
│   │   └── README.md              # Web app (src at repo root during transition)
│   └── mobile/                    # Expo React Native
│       ├── app/                     # Expo Router entry
│       ├── package.json
│       └── app.json
├── packages/
│   ├── shared/                    # Types, constants, onboarding helpers
│   │   └── src/
│   │       ├── types.ts
│   │       ├── constants.ts
│   │       ├── onboarding.ts
│   │       └── index.ts
│   ├── supabase/                  # Browser + server Supabase clients
│   │   └── src/
│   │       ├── browser.ts
│   │       ├── server.ts
│   │       └── index.ts
│   └── database/                  # Query layer (feed, profiles, sellers, templates)
│       └── src/queries/
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── 20250602000000_phase1_init.sql
│   └── seed.sql
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PHASE1_MVP.md
│   └── FOLDER_STRUCTURE.md        # this file
├── public/
├── src/                           # Next.js App Router (current web app)
│   ├── app/
│   │   ├── api/phase1/feed/       # Home feed API
│   │   ├── auth/callback/         # Supabase OAuth / magic link callback
│   │   ├── onboarding/
│   │   │   ├── buyer/
│   │   │   └── seller/
│   │   ├── dashboard/templates/   # Product templates UI
│   │   └── …                      # existing routes (/, /explore, /sellers, …)
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   │   └── phase1/                # Feature flag + auth helpers
│   └── middleware.ts              # Supabase session + onboarding gates
├── .env.example
├── package.json                   # npm workspaces root
├── tsconfig.json
├── PROJECT_STATUS.md
└── README.md
```

## Phase 1 routes (new)

| Route | Purpose |
|-------|---------|
| `/onboarding/buyer` | Buyer onboarding |
| `/onboarding/seller` | Seller profile + first template |
| `/auth/callback` | Supabase auth redirect |
| `/api/phase1/feed` | Home feed JSON |
| `/dashboard/templates` | List product templates |
