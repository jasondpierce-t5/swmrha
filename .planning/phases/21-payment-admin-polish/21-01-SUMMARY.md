---
phase: 21-payment-admin-polish
plan: "01"
subsystem: admin-payment-data-layer-and-list
tags: [admin-payments, server-actions, payments-list, admin-navigation, dashboard]

# Dependency graph
requires:
  - phase: 17-membership-payments
    provides: PaymentRow type, payments table, admin client, payment server actions
  - phase: 20-guest-checkout-additional-fees
    provides: Nullable member_id on payments, guest_email/guest_name fields, fee_purchases table
provides:
  - AdminPaymentRow enriched type with payer_name and payer_email
  - PaymentsSummary aggregate stats type
  - AdminPaymentDetail type with related records
  - getPaymentsAdmin, getPaymentsSummary, getPaymentByIdAdmin server actions
  - /admin/payments list page with summary stats and payment table
  - Payments nav item in admin sidebar
  - Payments card and quick action on admin dashboard
affects: [21-02-payment-detail-refund]

# Tech tracking
tech-stack:
  added: []
  patterns: [batch-member-lookup, enriched-payment-row, admin-summary-stats]

key-files:
  created:
    - src/lib/actions/admin-payments.ts
    - src/app/admin/payments/page.tsx
  modified:
    - src/lib/admin-navigation.ts
    - src/app/admin/page.tsx

key-decisions:
  - "Used batch member lookup (single IN query) to resolve payer names, avoiding N+1 queries"
  - "getPaymentsSummary fetches lightweight columns (id, amount_cents, payment_type, status) and computes aggregates in-memory rather than multiple COUNT/SUM queries for simplicity"
  - "Payment type badges color-coded: gold for membership, blue for entry fees, purple for additional fees"
  - "Guest payments identified by null member_id; shown with orange 'Guest' badge in payments table"
  - "Admin dashboard grid updated from 3-col to 4-col to accommodate Payments card"

patterns-established:
  - "Admin payment actions use createAdminClient (service role) for full cross-user visibility"
  - "AdminPaymentRow extends PaymentRow with payer_name/payer_email for display without extra queries in UI"
  - "Summary stats cards pattern: 4-card grid with icon, value, and label"

issues-created: []

# Metrics
duration: ~12min
timestamps:
  start: 2026-02-18T00:00:00Z
  end: 2026-02-18T00:12:00Z
task_count: 2
file_count: 4
---

# Phase 21 Plan 01: Admin Payment Data Layer & Payments List Summary

**Created admin payment server actions and payments list page giving admins full visibility into all payment activity across membership dues, show entries, and additional fees.**

## Accomplishments

- Created three admin payment server actions (getPaymentsAdmin, getPaymentsSummary, getPaymentByIdAdmin) with enriched types that resolve payer identity
- Built /admin/payments list page with 4-card summary stats row (total revenue, total payments, by-type breakdown, by-status breakdown)
- Built payments table with color-coded type badges (gold/blue/purple), status badges (green/yellow/red/blue), guest indicators, and View action links
- Added "Payments" nav item with CreditCardIcon to admin sidebar between Members and Membership Types
- Added Payments summary card and "View Payments" quick action to admin dashboard

## Task Commits

| Task | Hash | Description |
|------|------|-------------|
| Task 1 | `2835c49` | Create admin payment server actions |
| Task 2 | `e0d6619` | Create admin payments list page with navigation and dashboard integration |

## Files Created/Modified

- `src/lib/actions/admin-payments.ts` - New: 3 server actions + 3 exported types (AdminPaymentRow, PaymentsSummary, AdminPaymentDetail)
- `src/app/admin/payments/page.tsx` - New: Admin payments list page with summary stats and table
- `src/lib/admin-navigation.ts` - Modified: Added CreditCardIcon import and Payments nav item
- `src/app/admin/page.tsx` - Modified: Added Payments summary card and View Payments quick action

## Decisions Made

- **Batch member lookup**: Single `.in('id', memberIds)` query instead of N+1 per-payment member lookups
- **In-memory aggregation for summary**: Fetches lightweight columns and computes counts/sums in JS rather than multiple SQL aggregate queries; simpler and sufficient for expected payment volumes
- **getPaymentByIdAdmin prepared for Phase 21-02**: Fetches related show_entries (with classes) for entry_fees and fee_purchases for additional_fees, ready for detail page consumption
- **4-column dashboard grid**: Expanded from 3-col to 4-col to fit Payments card alongside Shows, Sponsors, Results

## Deviations from Plan

None.

## Issues Encountered

- OneDrive file lock caused initial `npm run build` to fail with EPERM on `.next` cache directory; resolved by clearing `.next` before rebuild. Not a code issue.

## Next Step

Ready for 21-02-PLAN.md (Payment Detail & Refund Processing)
