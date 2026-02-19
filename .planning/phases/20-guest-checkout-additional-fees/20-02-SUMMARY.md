---
phase: 20-guest-checkout-additional-fees
plan: "02"
subsystem: admin-fee-items-ui
tags: [additional-fees, admin-ui, crud-pages, navigation, fee-management]

# Dependency graph
requires:
  - phase: 20-01
    provides: FeeItemRow/FeeItemInsert types, fee-items.ts CRUD actions (getFeeItems, createFeeItem, updateFeeItem, deleteFeeItem)
  - phase: 17-membership-payments
    provides: Admin page patterns (membership-types list/new/edit), DeleteMembershipTypeButton pattern, MembershipTypeForm pattern
provides:
  - Admin CRUD pages for fee items at /admin/fees
  - DeleteFeeItemButton client component
  - FeeItemForm shared client component for create/edit
  - Fee Items entry in admin sidebar navigation
affects: [20-03-purchase-ui, 20-04-member-purchase, 21-payment-admin]

# Tech tracking
tech-stack:
  added: []
  patterns: [admin-crud-pages, delete-confirmation-button, shared-form-component]

key-files:
  created:
    - src/app/admin/fees/page.tsx
    - src/app/admin/fees/new/page.tsx
    - src/app/admin/fees/[id]/edit/page.tsx
    - src/components/DeleteFeeItemButton.tsx
    - src/components/FeeItemForm.tsx
  modified:
    - src/lib/admin-navigation.ts

key-decisions:
  - "Shared FeeItemForm component handles both create and edit modes (following MembershipTypeForm pattern)"
  - "Show column in list page uses Map lookup from getShows() to resolve show_id to name"
  - "Price input accepts dollars, converts to cents on submit (price_cents = Math.round(priceFloat * 100))"
  - "Max quantity per order field uses empty string for unlimited (null in database)"
  - "Edit page fetches all fee items via getFeeItems() and filters by ID (no dedicated getFeeItemById)"
  - "Category dropdown: stall, banquet, vendor, other — displayed capitalized in table"

patterns-established:
  - "Fee item admin CRUD follows membership-types pattern exactly (list/new/edit page structure)"
  - "DeleteFeeItemButton follows DeleteMembershipTypeButton pattern (useTransition, window.confirm, router.push with success param)"

issues-created: []

# Metrics
duration: ~5 min
completed: 2026-02-18
---

# Phase 20 Plan 02: Admin Fee Items UI

**Admin CRUD pages for managing additional fee items (stall fees, banquet tickets, vendor spaces) and admin navigation integration**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-18
- **Completed:** 2026-02-18
- **Tasks:** 2/2 (all auto)
- **Files created:** 5
- **Files modified:** 1

## Accomplishments

1. **Admin Fee Items List Page (/admin/fees)** -- Server component calling getFeeItems() with table columns: Name (with description subtitle), Category (capitalized), Price (dollars formatted as $XX.XX), Show (name from lookup or "All Shows"), Active (green/red badge), Actions (Edit link + Delete button). Includes success banner for CRUD operations, error state, empty state with add link. Follows membership-types list page layout exactly.

2. **Admin Create Fee Item Page (/admin/fees/new)** -- Server component wrapper fetching shows list, rendering FeeItemForm client component. Form fields: Name (required, maxLength 200), Description (textarea, optional), Category (select: stall/banquet/vendor/other), Price in USD (dollar input with $ prefix, converts to cents), Show (optional select with "All Shows" default + DB shows), Max Quantity Per Order (number, empty = unlimited), Sort Order (number, default 0), Active (checkbox, default checked). Validates price > 0 and max quantity if provided.

3. **Admin Edit Fee Item Page (/admin/fees/[id]/edit)** -- Server component fetching fee items and shows in parallel via Promise.all. Finds fee item by ID, returns 404 if not found. Pre-populates FeeItemForm with existing values (price_cents converted to dollars for display). Submits via updateFeeItem action.

4. **DeleteFeeItemButton Component** -- Client component following DeleteMembershipTypeButton pattern. Uses useTransition for pending state, window.confirm() for deletion confirmation, redirects to /admin/fees?success=deleted on success.

5. **FeeItemForm Component** -- Shared client component for create and edit modes. Manages all form field state, handles dollar-to-cents conversion, validates required fields, and calls createFeeItem or updateFeeItem actions. Follows MembershipTypeForm patterns for card-based sections, input styling, and submit/cancel buttons.

6. **Admin Navigation Update** -- Added "Fee Items" nav item with BanknotesIcon after "Membership Types" in adminNavigation array, linking to /admin/fees with description "Manage stall fees, banquet tickets, and charges".

## Task Commits

Each task was committed atomically:

1. **Task 1: Admin fee items CRUD pages** -- `ec279ce` (feat, created by parallel agent 20-03 which included these files)
2. **Task 2: Add Fee Items to admin navigation** -- `cc844b7` (feat)

## Files Created

- `src/app/admin/fees/page.tsx` -- Admin fee items list page with table, success/error/empty states
- `src/app/admin/fees/new/page.tsx` -- Admin create fee item page with server-side shows fetch
- `src/app/admin/fees/[id]/edit/page.tsx` -- Admin edit fee item page with pre-populated form
- `src/components/DeleteFeeItemButton.tsx` -- Client component for fee item deletion with confirmation
- `src/components/FeeItemForm.tsx` -- Shared client component for create/edit fee item forms

## Files Modified

- `src/lib/admin-navigation.ts` -- Added BanknotesIcon import and "Fee Items" nav entry after "Membership Types"

## Decisions Made

1. **Shared FeeItemForm component** -- Rather than separate create and edit form components, a single FeeItemForm handles both modes via `action` prop, following MembershipTypeForm pattern. Shows list is fetched server-side and passed as props.

2. **Show name resolution via Map** -- The list page builds a Map from getShows() result to efficiently look up show names by ID. Falls back to "Unknown Show" if show_id doesn't match any known show, and displays "All Shows" for null show_id.

3. **Edit page uses getFeeItems + filter** -- Since there's no dedicated getFeeItemById action, the edit page fetches all fee items and filters by ID. For the expected small number of fee items this is efficient and avoids creating an additional server action.

## Deviations from Plan

1. **[Parallel Agent Overlap] Task 1 files created by 20-03 agent** -- The parallel 20-03 agent (public fee purchase page) also created the admin fee CRUD files as part of its commit `ec279ce`. My writes produced identical content, resulting in no git diff. Task 1 effectively completed via parallel execution. Only Task 2 (admin navigation) required a new commit from this agent.

## Issues Encountered

- **Pre-existing build error from parallel agent timing** -- During initial verification, `npm run build` failed due to `src/app/purchase/page.tsx` importing `./PurchaseForm` which hadn't been committed yet by the 20-03 agent. By final verification, the parallel agent had completed its work and the build passed. Used `npx tsc --noEmit` for intermediate type checking.

## Verification Checks

- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] /admin/fees route registered in build output
- [x] /admin/fees/new route registered in build output
- [x] /admin/fees/[id]/edit route registered in build output
- [x] Fee items list page has table with Name, Category, Price, Show, Active, Actions columns
- [x] Create page has all form fields (name, description, price, category, show, max qty, active, sort order)
- [x] Edit page pre-populates form with existing values
- [x] Delete uses confirmation dialog via DeleteFeeItemButton
- [x] Price displays as dollars, stores as cents
- [x] Show column shows name or "All Shows"
- [x] Admin navigation includes "Fee Items" with BanknotesIcon after "Membership Types"

## Next Phase Readiness

- Admin can create, read, update, and delete fee items via /admin/fees
- Fee Items visible in admin sidebar navigation
- All admin CRUD operations use existing server actions from 20-01
- Pages follow established dark western-professional theme consistently
- Ready for 20-03 public purchase pages to link to fee items
- Ready for 20-04 member purchase flow integration

---
*Phase: 20-guest-checkout-additional-fees*
*Completed: 2026-02-18*
