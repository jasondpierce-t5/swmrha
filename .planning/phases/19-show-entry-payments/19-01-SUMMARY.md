---
phase: 19-show-entry-payments
plan: "01"
subsystem: payments
tags: [stripe-checkout, entry-fees, webhook-fulfillment, multi-line-item, server-actions]

# Dependency graph
requires:
  - phase: 17-membership-payments
    provides: Payments table, admin client, checkout session pattern, webhook fulfillment handler
  - phase: 18-show-entry-system
    provides: show_entries table, show_entry_classes junction table, entry types, entry CRUD actions
provides:
  - createEntryCheckoutSession server action for multi-line-item Stripe Checkout
  - Entry fee webhook fulfillment (confirms entries with payment_id on success)
  - Payment type dispatch in fulfillCheckoutSession (entry_fees vs membership)
affects: [19-02-checkout-ui, 20-guest-checkout, 21-payment-admin]

# Tech tracking
tech-stack:
  added: []
  patterns: [multi-line-item-checkout, payment-type-dispatch, entry-confirmation-fulfillment]

key-files:
  created:
    - src/lib/actions/entry-checkout.ts
  modified:
    - src/lib/actions/fulfillment.ts

key-decisions:
  - "Entry checkout creates one Stripe line item per entry (horse/rider combo with class names as description)"
  - "Payment type dispatch in fulfillment.ts routes entry_fees vs membership payments to separate handlers"
  - "fulfillEntryPayment confirms entries individually, logging failures but continuing for remaining entries"
  - "Fallback payment creation handles null membership_type_slug for entry_fees payments"
  - "Payment record ID captured from both update and fallback insert paths for entry payment_id linking"

patterns-established:
  - "Multi-line-item checkout: one line item per entry with price_data.product_data for horse/rider name and class descriptions"
  - "Payment type dispatch: fulfillCheckoutSession routes to fulfillMembershipPayment or fulfillEntryPayment based on metadata"
  - "Entry confirmation: webhook sets status=confirmed and payment_id on each entry individually with error resilience"

issues-created: []

# Metrics
duration: ~5 min
completed: 2026-02-17
---

# Phase 19 Plan 01: Entry Checkout Session & Webhook Fulfillment

**Multi-line-item Stripe Checkout for show entry fees with payment-type-dispatched webhook fulfillment confirming entries on payment success**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 2/2 (both auto)
- **Files modified:** 2

## Accomplishments

1. **Entry Checkout Session Action** -- Created `createEntryCheckoutSession(entryIds)` server action that authenticates user, validates entry ownership/status, fetches entries and their classes, creates or retrieves Stripe customer, builds a multi-line-item Stripe Checkout Session (one line item per entry with horse/rider name and class descriptions), inserts a pending payment record with `payment_type: 'entry_fees'`, updates entries to `pending_payment` status, and returns the checkout URL.

2. **Payment Type Dispatch in Fulfillment** -- Refactored `fulfillCheckoutSession` to dispatch based on `session.metadata.payment_type`. Entry fee payments route to `fulfillEntryPayment`, membership payments route to `fulfillMembershipPayment` (extracted from original inline logic). Payment record ID is captured from both the update path and fallback insert path for linking.

3. **Entry Fee Fulfillment Handler** -- Created `fulfillEntryPayment` that parses `entry_ids` from session metadata, updates each entry to `status: 'confirmed'` with `payment_id` set to the payment record, logs individual entry failures but continues processing, and revalidates entry-related paths.

4. **Graceful Null Handling for Entry Payments** -- Fallback payment creation now handles `membership_type_slug: null` for entry fee payments and generates appropriate description text based on payment type.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create entry checkout session server action** - `d667bed` (feat)
2. **Task 2: Extend webhook fulfillment for entry payments** - `45efcb1` (feat)

## Files Created/Modified

- `src/lib/actions/entry-checkout.ts` -- New server action for multi-line-item Stripe Checkout from draft show entries
- `src/lib/actions/fulfillment.ts` -- Refactored to dispatch by payment_type; added fulfillEntryPayment and fulfillMembershipPayment helpers

## Decisions Made

1. **One line item per entry** -- Each entry (horse/rider combo) becomes a separate Stripe line item with `price_data.product_data.name` showing the horse/rider names and `description` listing class names. This gives clear itemization on the Stripe receipt.

2. **Individual entry confirmation** -- Each entry is confirmed individually in the fulfillment handler rather than a bulk update. This ensures partial failures (e.g., one entry already cancelled) don't block confirmation of remaining entries.

3. **Payment record ID capture** -- The fulfillment handler captures the payment record ID from both the update path (existing pending record) and fallback insert path (new record created by webhook). This ID is then linked to entries via `payment_id`.

4. **Null-safe fallback for entry fees** -- The fallback payment creation in the webhook handler now gracefully handles entry fee payments where `membership_type_slug` is undefined by defaulting to null, and generates a payment-type-appropriate description.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## Verification Checks

- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] entry-checkout.ts exports createEntryCheckoutSession
- [x] fulfillment.ts handles both 'entry_fees' and membership payment types
- [x] Entry checkout creates multi-line-item Stripe session (one per entry)
- [x] Webhook fulfillment updates entries to 'confirmed' with payment_id
- [x] All writes use admin client (service role)

## Next Phase Readiness

- Entry checkout action ready for UI integration (checkout button on entries page)
- Webhook fulfillment handles both payment types end-to-end
- Success/cancel pages from Phase 17 work for entry payments (same URL pattern)
- Cancel URL includes `?return=entries` for entry-specific return navigation
- Existing membership payment flow unaffected by refactoring

---
*Phase: 19-show-entry-payments*
*Completed: 2026-02-17*
