# GEMINI.md

## Project Overview

This project is a **multi-tenant SaaS CRM** built with:

- **Nuxt 3 + TypeScript**
- **Supabase** (Postgres, Auth, RLS, RPC)
- **Stripe** (subscriptions, trials, billing)
- **PrimeVue + Chart.js** (dashboard UI)
- **pnpm** as the package manager (not npm)

The system supports:
- Multiple shops (multi-tenant)
- Modular features (Inventory, Invoicing, etc.)
- Paid subscription plans with trials
- Strict access blocking when payment is due

---

## Core Architecture

### Shops
- Every user belongs to one or more **shops**
- A shop has members with roles (`owner`, `employee`)
- All business data is scoped by `shop_id`

### Modules
- Features are modular (e.g. `inventory`)
- Plans enable/disable modules per shop
- Module access is enforced at:
  - Database level (RLS)
  - RPC level
  - Frontend UI level

---

## Subscription & Billing Model

### Stripe
- Stripe is the **single source of truth** for billing state
- **Stripe Checkout (subscription mode)** is used
- Trials are handled **by Stripe**, not manually
- Stripe API version used: **`2024-06-20`**
- All Stripe usage is server-side only

Stripe SDK initialization (server only):

```ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});
````

---

## Database Tables (Key Ones)

### `shop_subscriptions`

* One **current** subscription per shop (`is_current = true`)
* Old subscriptions are kept for history
* Status mirrors Stripe exactly

Important columns:

* `shop_id`
* `plan_id`
* `status`
* `trial_ends_at`
* `current_period_start`
* `current_period_end`
* `stripe_customer_id`
* `stripe_subscription_id`
* `stripe_price_id`
* `is_current`

---

## Subscription States

### Allowed access

* `active`
* `trialing` (only if trial has not expired)

### Blocked access

* `pending_payment`
* `incomplete`
* `past_due`
* `unpaid`
* `canceled`

---

## Single Source of Truth for Access Control

### Supabase Function

```sql
shop_access_state(shop_id uuid) → jsonb
```

Returns:

```json
{
  "allowed": true | false,
  "reason": "ok | trial_expired | past_due | unpaid | canceled | pending_payment"
}
```

This function is used by:

* RLS policies
* RPC functions
* Nuxt middleware
* UI state checks

No access logic is duplicated anywhere else.

---

## Backend Enforcement (MANDATORY)

### Row Level Security (RLS)

All write operations are blocked if payment is due.

Example:

```sql
(shop_access_state(shop_id)->>'allowed')::boolean = true
```

Applied to:

* products
* invoices
* invoice_items
* inventory
* services
* store_entries

Even if frontend is bypassed, the database rejects writes.

---

### RPC Protection

All RPC functions must guard access.

Example:

```sql
if (shop_access_state(shop)->>'allowed')::boolean is not true then
  raise exception 'Payment required';
end if;
```

This applies to:

* `dashboard_metrics`
* FIFO accounting functions
* Any future analytics or mutations

---

## Frontend Enforcement (Nuxt)

### Global Middleware

`/middleware/subscription.global.ts`

Responsibilities:

* Runs on every route
* Redirects to `/billing` if payment is required
* Allows:

  * `/`
  * `/auth/*`
  * `/billing/*`

Frontend access **never replaces backend enforcement**, only complements it.

---

### UI Locking

* Sidebar links disabled when access is blocked
* Actions visually disabled
* Clear messaging explaining why access is blocked

---

## Billing Flow

### Signup

1. User signs up (OTP or magic link)
2. Supabase function `setup_shop_for_new_user()` runs:

   * creates shop
   * creates owner shop member
   * creates **pending_payment** subscription row
   * applies plan modules

---

### Checkout

* Endpoint: `/api/billing/checkout`
* Creates Stripe Checkout Session (subscription mode)
* Creates Stripe customer if missing
* Applies trial days if plan includes trial
* Redirects user to Stripe-hosted checkout

---

### Success Page

* Route: `/billing/success`
* Calls `/api/billing/verify`
* Verifies Stripe session server-side
* Updates **current** subscription row

---

### Webhooks (Authoritative)

* Endpoint: `/api/stripe/webhook`
* Uses `readRawBody` and Stripe signature verification
* Handles:

  * `customer.subscription.created`
  * `customer.subscription.updated`
  * `customer.subscription.deleted`

Webhooks are the **final authority**.
Frontend verification is only a convenience.

---

## Dashboard & Metrics

### RPC

```sql
dashboard_metrics(shop_id uuid) → jsonb
```

Returns:

```json
{
  "total_revenue": number,
  "total_cogs": number,
  "total_profit": number,
  "total_units_sold": number,
  "daily_sales": [
    { "day": "YYYY-MM-DD", "revenue": number, "cogs": number, "profit": number }
  ],
  "profit_by_product": [
    {
      "product_id": uuid,
      "product_name": text,
      "revenue": number,
      "cogs": number,
      "profit": number
    }
  ]
}
```

---

## FIFO Accounting

* FIFO is enforced in Supabase
* Vendor invoices add stock batches
* Client invoices consume stock FIFO
* COGS calculated per invoice item
* Profit = revenue − COGS
* Discounts and extra discounts are included correctly

---

## Inventory Module

* Inventory is a **separate module**
* Includes:

  * products
  * stock tracking
  * vendor invoices
* Vendor invoices increase stock
* Client invoices decrease stock
* Module can be disabled per plan

---

## Deployment (Netlify)

* Nuxt deployed as serverless via Nitro
* API routes exposed as Netlify Functions
* pnpm is used for build and install

Required environment variables:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=anon_xxx
SUPABASE_SERVICE_KEY=service_role_xxx
NUXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

---

## Debugging

* Use Netlify Runtime Logs
* Or:

```bash
netlify logs:function
```

Stripe CLI is used **only for local development**, not Netlify.

---

## Non-Negotiable Rules

1. Never trust frontend for access control
2. Stripe is the billing authority
3. RLS must block unpaid users
4. Webhooks are mandatory
5. Only one current subscription per shop
6. All access checks go through `shop_access_state`

---

## Status

This system is:

* Production-grade
* Secure by default
* Scalable
* Ready for additional modules and plans

---

## Future Extensions

* Stripe Customer Portal
* Plan upgrades/downgrades
* Grace periods
* Coupons & promo codes
* Multi-currency support

```

---

If you want next, I can:
- audit this doc for **completeness vs your actual schema**
- split it into `ARCHITECTURE.md` + `BILLING.md`
- generate a `README.md` for contributors
- generate onboarding docs for new devs

Just tell me.
```
