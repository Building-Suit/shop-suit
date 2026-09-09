# Building Suit — Shop Suit monorepo

`pnpm` workspace containing the Shop Suit product family:

| Path | What it is |
|---|---|
| `apps/shop-crm` | Nuxt 4 application (landing, auth BFF, billing, portal base) |
| `packages/api-layer` | Shared Nuxt module: typed contracts, auth/billing factories, Colada adapter, server REST utils, generated DB types |
| `supabase/` | Canonical Supabase CLI project (migrations, DB smoke tests, seed) |
| `docs/rebuild/` | Rebuild documentation: audit, DB contract, parity matrix, security review, validation |

## Quick start

```bash
pnpm install
cp apps/shop-crm/.env.example apps/shop-crm/.env   # fill in; never commit
supabase start && supabase db reset                # local stack (root-level CLI)
pnpm run dev:shop-crm
```

## Root scripts

```bash
pnpm run dev:shop-crm          # dev server
pnpm run build:shop-crm        # production build
pnpm run typecheck:shop-crm    # vue-tsc typecheck
pnpm run module:test           # api-layer unit tests
pnpm run module:lint           # api-layer eslint
```

## Supabase

All Supabase tooling runs from the repository root against `./supabase`
(no nested `supabase/supabase`):

```bash
supabase start | status | stop
supabase db reset                      # deterministic replay of migrations + seed
supabase gen types typescript --local  # regenerate api-layer DB types
```

Database behavior is regression-tested:

```bash
docker exec -i supabase_db_shop-suit psql -U postgres -d postgres \
  < supabase/tests/db_smoke_test.sql
```

## Design system

Shop Suit implements the Building Suit Design System (Manrope / IBM Plex Sans
Arabic, Building Navy + Premium Gold, navy dark theme). See
`docs/rebuild/design-system.md`.
