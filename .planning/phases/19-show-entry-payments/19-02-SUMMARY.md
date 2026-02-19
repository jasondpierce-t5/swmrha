---
phase: 19-show-entry-payments
plan: "02"
subsystem: ui
tags: [stripe-checkout, entry-payment-ui, pay-button, save-and-pay, checkout-success, checkout-cancel]

# Dependency graph
requires:
  - phase: 19-01
    provides: createEntryCheckoutSession server action, entry fee webhook fulfillment
  - phase: 17-membership-payments
    provides: Checkout success/cancel page patterns
  - phase: 18-show-entry-system
    provides: Entries list page, ShowEntryForm, CancelEntryButton pattern
provides:
  - PayEntryButton component for draft/pending_payment entries
  - "Save & Pay Now" flow on entry form
  - Context-aware checkout success/cancel pages for entry_fees
affects: [20-guest-checkout, 21-payment-admin]

# Tech tracking
tech-stack:
  added: []
  patterns: [context-aware-checkout-pages, save-and-pay-flow]

key-files:
  created:
    - src/app/member/(portal)/entries/PayEntryButton.tsx
  modified:
    - src/app/member/(portal)/entries/page.tsx
    - src/app/member/(portal)/checkout/cancel/page.tsx
    - src/app/member/(portal)/checkout/success/page.tsx
    - src/app/member/(portal)/enter-show/ShowEntryForm.tsx

key-decisions:
  - "PayEntryButton supports both draft and pending_payment entries (allows retry on abandoned checkout)"
  - "Checkout success/cancel pages dispatch messaging based on payment_type (entry_fees vs membership)"
  - "Save & Pay Now redirects to Stripe immediately after entry creation"

patterns-established:
  - "Context-aware checkout pages: success/cancel adapt messaging based on payment.payment_type"
  - "Save-and-pay pattern: form save action chains into checkout session creation on success"

issues-created: []

# Metrics
duration: ~5 min
completed: 2026-02-17
---

# Phase 19 Plan 02: Entry Payment UI & Checkout Flow Summary

**PayEntryButton on entries list, Save & Pay Now on entry form, and context-aware Stripe checkout success/cancel pages for show entry fees**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 3/3 (2 auto + 1 checkpoint:human-verify)
- **Files modified:** 5

## Accomplishments

1. **PayEntryButton Component** — Created client component following CancelEntryButton patterns. Shows gold "Pay Now" text for draft and pending_payment entries, calls createEntryCheckoutSession, redirects to Stripe Checkout via window.location.href.

2. **Entries List Integration** — Replaced placeholder "Pay Now" spans in both EntryTableRow and EntryCard with working PayEntryButton. Draft and pending_payment entries get the pay button; pending_payment allows retry on abandoned checkout.

3. **Context-Aware Cancel Page** — Cancel page reads `?return=entries` search param and shows "Return to My Entries" link instead of "Return to Pay Dues" for entry payment cancellations.

4. **Context-Aware Success Page** — Success page checks `payment.payment_type` and shows entry-specific messaging: "Your show entries have been confirmed" instead of membership text. Action links point to /member/entries instead of payment history.

5. **Save & Pay Now on Entry Form** — Added dual-button step 3 with "Save & Pay Now" (gold, prominent) and "Save as Draft" (navy, secondary). Save & Pay chains entry creation into checkout session creation and redirects to Stripe. Shows "Redirecting to Payment..." during processing.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PayEntryButton and update entries list and cancel page** - `32862b0` (feat)
2. **Task 2: Update checkout success page and add save-and-pay to entry form** - `dab48fe` (feat)

**Checkpoint:** Task 3 human-verify — approved

## Files Created/Modified

- `src/app/member/(portal)/entries/PayEntryButton.tsx` — New client component for entry payment initiation
- `src/app/member/(portal)/entries/page.tsx` — Replaced placeholder spans with PayEntryButton for draft/pending_payment entries
- `src/app/member/(portal)/checkout/cancel/page.tsx` — Context-aware return link based on ?return param
- `src/app/member/(portal)/checkout/success/page.tsx` — Payment-type-aware messaging for entry_fees vs membership
- `src/app/member/(portal)/enter-show/ShowEntryForm.tsx` — Added Save & Pay Now dual-button flow on step 3

## Decisions Made

1. **PayEntryButton for both draft and pending_payment** — Allows retry if a user abandoned a previous Stripe checkout. The entry stays in pending_payment and can be re-initiated.

2. **Context-aware checkout pages** — Rather than creating separate success/cancel pages for entries, the existing pages dispatch on payment_type. This avoids code duplication and leverages the established patterns.

3. **Save & Pay chains into checkout** — The Save & Pay button saves entries first (creating draft records), then immediately creates a checkout session and redirects. If checkout creation fails, entries still exist as drafts for later payment.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Complete show entry payment flow operational end-to-end
- Entries list, entry form, checkout, and confirmation all wired up
- Webhook fulfillment confirms entries on payment success
- Ready for Phase 20 (Guest Checkout & Additional Fees)

---
*Phase: 19-show-entry-payments*
*Completed: 2026-02-17*
