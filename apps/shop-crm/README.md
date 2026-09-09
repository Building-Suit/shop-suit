# Shop CRM (Shop Suit portal)

Nuxt 4 application for the Shop Suit product family: landing site, authentication
(server-side BFF over Supabase GoTrue), billing plans, and the base for the
shop-management portal.

Part of the **Building Suit** monorepo (`pnpm` workspace):

```text
.
├── apps/shop-crm        # this app (Nuxt 4 + Tailwind v4 + shadcn-style ui)
├── packages/api-layer   # shared Nuxt module: contracts, factories, server REST utils
└── supabase/            # canonical Supabase CLI project (migrations, tests, seed)
```

## Setup

```bash
pnpm install
cp apps/shop-crm/.env.example apps/shop-crm/.env   # fill in values; never commit it
```

## Local Supabase (from the repository root)

```bash
supabase start          # first boot provisions DB + auth; ports in supabase/config.toml
supabase db reset       # replay migrations + structural seed
supabase status -o env  # copy SUPABASE_URL / SUPABASE_ANON_KEY into .env
```

DB assertions (tenant isolation, FIFO math, subscription gating):

```bash
docker exec -i supabase_db_shop-suit psql -U postgres -d postgres \
  < supabase/tests/db_smoke_test.sql
```

## Development

```bash
pnpm run dev:shop-crm            # from repo root (or: pnpm dev inside the app)
```

Type checking and validation:

```bash
pnpm run typecheck:shop-crm      # vue-tsc over all Nuxt tsconfig projects
pnpm run build:shop-crm          # production build
```

## Design system

The app implements the Building Suit Design System: Manrope + IBM Plex Sans
Arabic (self-hosted in `public/fonts`), Building Navy / Premium Gold tokens,
navy-surface dark theme, 8/12/16/24px radii, 44/48px touch targets, RTL-first
Arabic defaults. See `docs/rebuild/design-system.md`.

## Rebuild documentation

- `docs/rebuild/current-state-audit.md`
- `docs/rebuild/database-contract.md`
- `docs/rebuild/behavioral-parity.md`
- `docs/rebuild/supabase-flattening.md`
- `docs/rebuild/design-system.md`
- `docs/rebuild/security-review.md`
- `docs/rebuild/final-validation.md`
