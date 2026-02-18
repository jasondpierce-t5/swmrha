---
phase: 17-membership-payments
plan: "01"
subsystem: payments-data-layer
tags: [payments, stripe-checkout, supabase-admin, migration, server-actions]

# Dependency graph
requires:
  - phase: 14-stripe-foundation-member-auth
    provides: Stripe server SDK singleton, webhook endpoint
  - phase: 16-membership-management
    provides: membership_types table, MembershipTypeRow type, membership type actions
provides:
  - payments table with RLS (006_payments.sql migration)
  - PaymentRow TypeScript interface
  - Supabase admin client (service role key, bypasses RLS)
  - createCheckoutSession server action for Stripe Checkout
  - getMemberPayments and getPaymentBySessionId query actions
affects: [17-02-webhook-fulfillment, 17-03-checkout-ui, member-payment-history]

# Tech tracking
tech-stack:
  added: []
  patterns: [supabase-admin-client, stripe-checkout-session, payment-type-resolution]

key-files:
  created:
    - supabase/migrations/006_payments.sql
    - src/lib/supabase/admin.ts
    - src/lib/actions/checkout.ts
    - src/lib/actions/payments.ts
  modified:
    - src/types/database.ts
    - .env.local.example

key-decisions:
  - "Payments table has SELECT-only RLS policies for authenticated users; all writes via service role admin client"
  - "Supabase admin client uses service role key (not NEXT_PUBLIC_ prefixed) to stay server-only"
  - "Payment type resolved dynamically from member status: pending->membership_dues, active/expired->membership_renewal"
  - "Stripe customer created on first checkout and stored in members.stripe_customer_id via admin client"
  - "Pending payment record inserted before returning checkout URL; webhook handles final status update"

patterns-established:
  - "Admin Supabase client: createAdminClient() from @/lib/supabase/admin — bypasses RLS for system operations"
  - "Checkout flow: authenticate -> validate -> create/retrieve Stripe customer -> create session -> insert pending payment -> return URL"
  - "Payment query scoping: all queries filtered by auth.uid() = member_id via both RLS and explicit WHERE"

issues-created: []

# Metrics
duration: ~8 min
completed: 2026-02-17
---

# Phase 17 Plan 01: Payments Data Layer & Checkout Session

**Database migration for payments table, Supabase admin client, Stripe checkout session action, and payment query actions**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 2/2 (both auto)
- **Files created:** 4
- **Files modified:** 2

## Accomplishments

1. **Payments Migration (006)** -- Created `payments` table with all specified columns (id, member_id, amount_cents, payment_type, membership_type_slug, description, stripe_checkout_session_id, stripe_payment_intent_id, status, timestamps). RLS enabled with SELECT-only policies for members (own rows) and admins (all rows). Indexes on member_id and stripe_checkout_session_id for query performance. Updated_at trigger reuses existing function. No INSERT/UPDATE/DELETE policies for regular users -- all writes via service role.

2. **PaymentRow Type** -- Added `PaymentRow` interface to `database.ts` matching the migration schema exactly. Follows established pattern with string types for timestamps and nullable fields.

3. **Supabase Admin Client** -- Created `createAdminClient()` using `@supabase/supabase-js` with service role key. Disables auto token refresh and session persistence. Server-only usage (webhook handlers, system operations). SUPABASE_SERVICE_ROLE_KEY added to `.env.local.example`.

4. **Checkout Session Action** -- `createCheckoutSession(membershipTypeSlug)` authenticates user, fetches member profile and active membership type by slug, creates or retrieves Stripe customer (storing new IDs via admin client), creates Stripe Checkout Session with correct line_items/metadata/URLs, inserts pending payment record, and returns the checkout URL. Payment type resolved dynamically from membership status.

5. **Payment Query Actions** -- `getMemberPayments()` returns all payments for the authenticated member ordered by created_at DESC. `getPaymentBySessionId(sessionId)` returns a single payment by checkout session ID, scoped to the authenticated user. Both follow established patterns with sanitizeSupabaseError and input validation.

## Task Commits

| Task | Commit Message | Hash |
|------|---------------|------|
| Task 1: Migration + types + admin client | feat(17-01): create payments table migration, types, and Supabase admin client | `0af8578` |
| Task 2: Checkout + payment actions | feat(17-01): create Stripe checkout session and payment query server actions | `91b0c52` |

## Files Created

- `supabase/migrations/006_payments.sql` -- Payments table, RLS, indexes, trigger
- `src/lib/supabase/admin.ts` -- Supabase admin client (service role key)
- `src/lib/actions/checkout.ts` -- createCheckoutSession server action
- `src/lib/actions/payments.ts` -- getMemberPayments, getPaymentBySessionId server actions

## Files Modified

- `src/types/database.ts` -- Added PaymentRow interface
- `.env.local.example` -- Added SUPABASE_SERVICE_ROLE_KEY

## Decisions Made

1. **SELECT-only RLS for payments** -- Regular users can only read payments via RLS. All INSERT/UPDATE operations are performed by the admin client (service role key) which bypasses RLS entirely. This ensures payments can only be created/modified by system code (checkout action, webhook handler).

2. **Dynamic payment type resolution** -- Instead of a static payment_type, the checkout action determines whether this is `membership_dues` (for pending members) or `membership_renewal` (for active/expired members) based on the member's current membership_status.

3. **Stripe customer persistence** -- On first checkout, a Stripe customer is created and stored in `members.stripe_customer_id` via the admin client. Subsequent checkouts reuse the existing customer ID.

4. **Non-blocking error handling for secondary operations** -- If storing the Stripe customer ID or inserting the pending payment record fails, the checkout still proceeds. The webhook handler will reconcile state on payment completion.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## Verification Checks

- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] PaymentRow interface in database.ts matches migration schema
- [x] Admin client created with service role key pattern
- [x] Checkout action creates Stripe session with correct line_items and metadata
- [x] Payment query actions properly scoped to authenticated member

## Next Phase Readiness

- Payments migration ready for execution in Supabase Dashboard
- Checkout session action ready for UI integration (17-03 checkout pages)
- Payment query actions ready for payment history page
- Webhook handler (Phase 14) has placeholder for `checkout.session.completed` ready for 17-02 fulfillment logic
- Admin client available for webhook fulfillment (update payment status, activate membership)

---
*Phase: 17-membership-payments*
*Completed: 2026-02-17*
