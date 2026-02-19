---
phase: 20-guest-checkout-additional-fees
plan: "01"
subsystem: additional-fees-data-layer
tags: [additional-fees, guest-checkout, stripe-checkout, migration, server-actions, crud]

# Dependency graph
requires:
  - phase: 17-membership-payments
    provides: Payments table, admin client, checkout session pattern, webhook fulfillment handler
  - phase: 19-show-entry-payments
    provides: Payment type dispatch in fulfillment.ts, entry checkout session pattern
provides:
  - additional_fee_types table for configurable fee items
  - fee_purchases table for tracking individual fee item purchases
  - Payments table guest support (nullable member_id, guest_email, guest_name)
  - FeeItemRow, FeeItemInsert, FeePurchaseRow TypeScript types
  - 6 fee item CRUD/query server actions
  - createFeeCheckoutSession for member and guest checkout flows
  - getFeePurchasesByPayment for success page display
  - fulfillFeePurchase handler in webhook fulfillment
affects: [20-02-purchase-ui, 20-03-admin-fees, 21-payment-admin]

# Tech tracking
tech-stack:
  added: []
  patterns: [guest-checkout-flow, dual-auth-checkout, fee-purchase-fulfillment]

key-files:
  created:
    - supabase/migrations/009_additional_fees.sql
    - src/lib/actions/fee-items.ts
    - src/lib/actions/fee-checkout.ts
  modified:
    - src/types/database.ts
    - src/lib/actions/fulfillment.ts

key-decisions:
  - "additional_fee_types RLS allows both authenticated and anon SELECT for public purchase pages"
  - "fee_purchases RLS matches on purchaser_email via subquery to members table for member access"
  - "PaymentRow.member_id made nullable to support guest payments without member accounts"
  - "Guest checkout uses customer_email in Stripe session; member checkout uses stored customer ID"
  - "Fee checkout stores guest_email/guest_name on payment only for guest flow (null for members)"
  - "fulfillFeePurchase confirms all fee_purchases by payment_id in a single update"
  - "Guest fallback payment creation in webhook uses metadata for guest_email/guest_name"

patterns-established:
  - "Dual-auth checkout: single action handles both authenticated member and unauthenticated guest flows"
  - "Guest payment pattern: null member_id with guest_email/guest_name for guest identification"
  - "Fee purchase fulfillment: bulk status update of fee_purchases by payment_id"

issues-created: []

# Metrics
duration: ~8 min
completed: 2026-02-18
---

# Phase 20 Plan 01: Additional Fees Data Layer & Checkout

**Database migration for additional fee types and fee purchases, TypeScript types, admin CRUD actions, dual-auth checkout session, and webhook fulfillment for additional fee payments**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-18
- **Completed:** 2026-02-18
- **Tasks:** 3/3 (all auto)
- **Files created:** 3
- **Files modified:** 2

## Accomplishments

1. **Migration 009 (additional_fee_types + fee_purchases + payments ALTER)** -- Created `additional_fee_types` table with all specified columns (name, description, price_cents, category, show_id, max_quantity_per_order, is_active, sort_order, timestamps). RLS allows authenticated + anon SELECT for public purchase pages. Created `fee_purchases` table with payment_id FK, quantity tracking, price snapshots (unit_price_cents, total_cents), purchaser info, and status. RLS allows admin full read and member read by email match. Altered payments table: member_id nullable, added guest_email/guest_name columns, expanded payment_type CHECK to include all 4 types, added guest_email index.

2. **TypeScript Types (database.ts)** -- Added `FeeItemRow` interface matching additional_fee_types schema, `FeeItemInsert` type (Omit id/timestamps), and `FeePurchaseRow` interface matching fee_purchases schema. Updated `PaymentRow` with nullable member_id and new guest_email/guest_name fields.

3. **Fee Items CRUD Actions (fee-items.ts)** -- Created 6 server actions: `getFeeItems` (admin-only, all items), `getActiveFeeItems` (public, active only), `getActiveFeeItemsForShow` (public, active items for show or general), `createFeeItem` (admin, with validation), `updateFeeItem` (admin, partial updates), `deleteFeeItem` (admin). All follow established patterns from show-classes.ts with admin role checks, sanitizeSupabaseError, and path revalidation.

4. **Fee Checkout Session (fee-checkout.ts)** -- Created `createFeeCheckoutSession` that handles both authenticated member and unauthenticated guest flows in a single action. Member flow: authenticates user, fetches profile, gets/creates Stripe customer. Guest flow: requires guestEmail/guestName, validates email format. Both flows: validates fee items exist and are active, checks max_quantity_per_order, builds multi-line-item Stripe session, inserts pending payment (with guest fields for guests), inserts fee_purchase records with price snapshots. Also created `getFeePurchasesByPayment` query helper.

5. **Fulfillment Handler Updates (fulfillment.ts)** -- Added `additional_fees` case to payment type dispatch routing to new `fulfillFeePurchase` handler. Handler confirms all fee_purchases by payment_id and revalidates fee-related paths. Added guest fallback payment creation (null member_id with guest metadata from session). Updated final log line to distinguish member vs guest fulfillment.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create migration 009** - `812d950` (feat)
2. **Task 2: Add types and fee items CRUD actions** - `ff5bab1` (feat)
3. **Task 3: Create fee checkout and update fulfillment** - `1b9d7c6` (feat)

## Files Created

- `supabase/migrations/009_additional_fees.sql` -- Migration with additional_fee_types, fee_purchases tables, and payments ALTER for guest support
- `src/lib/actions/fee-items.ts` -- 6 server actions for fee item CRUD and queries
- `src/lib/actions/fee-checkout.ts` -- Dual-auth checkout session action and fee purchase query helper

## Files Modified

- `src/types/database.ts` -- Added FeeItemRow, FeeItemInsert, FeePurchaseRow; updated PaymentRow for guest support
- `src/lib/actions/fulfillment.ts` -- Added additional_fees dispatch, fulfillFeePurchase handler, guest fallback payment creation, updated log line

## Decisions Made

1. **Dual-auth checkout in single action** -- Rather than separate member and guest checkout actions, `createFeeCheckoutSession` handles both flows. The action attempts auth via `createClient().auth.getUser()` and branches based on whether a user is found. This simplifies the API surface for UI components.

2. **Guest fields on payment, not on all tables** -- Guest identification (email/name) is stored on the `payments` table and on `fee_purchases` (via purchaser_email/purchaser_name). The payment record uses null member_id with guest_email/guest_name for guest payments.

3. **Bulk fee purchase confirmation** -- Unlike entry fulfillment which confirms entries individually (for partial failure resilience), fee purchase fulfillment uses a single UPDATE ... WHERE payment_id = X since all purchases in a payment should be confirmed together.

4. **satisfies clause fix for PaymentRow** -- The existing fallback payment creation in fulfillment.ts used `satisfies Omit<PaymentRow, ...>` which broke when guest_email/guest_name were added to PaymentRow. Fixed by adding `guest_email: null, guest_name: null` to the existing member fallback insert.

## Deviations from Plan

1. **[Rule 3 - Blocking Issue] fulfillment.ts satisfies fix in Task 2** -- The PaymentRow type change (adding guest_email/guest_name) caused a TypeScript compilation error in fulfillment.ts due to the `satisfies` clause missing the new fields. Fixed by adding null defaults in the existing fallback insert. This was necessary to pass `npx tsc --noEmit` for Task 2 verification.

2. **Stripe session params typing** -- Plan suggested using `Parameters<typeof stripe.checkout.sessions.create>[0]` for typing the session params object. This resolved to `RequestOptions` due to Stripe SDK overloads, not the session create params. Fixed by using spread operator pattern (matching entry-checkout.ts) instead of a typed intermediate variable.

## Issues Encountered

None beyond the deviations noted above.

## Verification Checks

- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] Migration 009 SQL has correct FKs and CHECK constraints
- [x] FeeItemRow and FeePurchaseRow in database.ts match migration schema
- [x] PaymentRow updated with nullable member_id and guest_email/guest_name fields
- [x] 6 fee item CRUD/query actions exported from fee-items.ts
- [x] createFeeCheckoutSession handles both authenticated and guest flows
- [x] Fulfillment handler dispatches 'additional_fees' to fulfillFeePurchase
- [x] Fallback payment creation handles null member_id for guest payments
- [x] All writes use admin client (service role)

## Next Phase Readiness

- Migration 009 ready for execution in Supabase Dashboard
- Fee item CRUD actions ready for admin UI (20-02 or 20-03 admin fees page)
- Fee checkout action ready for public purchase page UI integration
- Guest checkout flow end-to-end: checkout -> Stripe -> webhook -> fulfillment
- Member checkout flow end-to-end: authenticated checkout -> Stripe -> webhook -> fulfillment
- Success page can use getFeePurchasesByPayment to display purchase details
- Guest success URL pattern (`/purchase/success`) separate from member pattern (`/member/checkout/success`)

---
*Phase: 20-guest-checkout-additional-fees*
*Completed: 2026-02-18*
