---
phase: 18-show-entry-system
plan: "03"
subsystem: show-entries-data-layer
tags: [show-entries, migration, rls, server-actions, crud, fee-cents, junction-table]

# Dependency graph
requires:
  - phase: 10-show-schedule-management
    provides: shows table, ShowRow types
  - phase: 17-membership-payments
    provides: payments table, createAdminClient(), fee_cents integer pricing pattern
  - phase: 18-01
    provides: show_classes table (007_show_classes.sql), ShowClassRow types, CRUD actions
provides:
  - show_entries table with RLS (008_show_entries.sql migration)
  - show_entry_classes junction table with RLS (008_show_entries.sql migration)
  - ShowEntryRow, ShowEntryClassRow, ShowEntryWithClasses, CreateShowEntryInput TypeScript interfaces
  - 5 server actions (getMemberEntries, getMemberEntriesForShow, getShowEntries, createShowEntries, cancelShowEntry)
affects: [19-entry-payment-integration, 21-admin-entry-views, member-entry-ui]

# Tech tracking
tech-stack:
  added: []
  patterns: [admin-client-writes, fee-cents-snapshot, junction-table, batch-entry-creation]

key-files:
  created:
    - supabase/migrations/008_show_entries.sql
    - src/lib/actions/show-entries.ts
  modified:
    - src/types/database.ts

key-decisions:
  - "Write operations use createAdminClient() (service role) to bypass RLS, consistent with payments pattern"
  - "RLS: SELECT-only for members (own data), admin SELECT-all via app_metadata role check, no INSERT/UPDATE/DELETE policies"
  - "show_entry_classes.fee_cents snapshots the class fee at entry time to protect against later price changes"
  - "total_cents on show_entries is calculated as sum of selected class fees at creation time"
  - "payment_id column on show_entries is nullable, ready for Phase 19 payment integration"
  - "Entry status CHECK constraint: draft, pending_payment, confirmed, cancelled"
  - "cancelShowEntry only allows cancellation of draft entries"
  - "createShowEntries validates all class_ids against active show_classes before inserting"
  - "All entries in a batch must share the same show_id"

patterns-established:
  - "Show entry CRUD via admin client for writes, regular client for reads"
  - "Fee snapshot pattern: junction table stores fee_cents at entry time"
  - "Batch entry creation with per-entry class selection and total calculation"
  - "Revalidation paths for show entry mutations: /member/entries, /member/enter-show, /admin/shows"

issues-created: []

# Metrics
duration: ~5 min
completed: 2026-02-17
---

# Phase 18 Plan 03: Show Entries Database & Server Actions

**Database migration for show_entries and show_entry_classes tables with RLS, TypeScript types, and 5 CRUD server actions for member entry management**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 2/2 (both auto)
- **Files created:** 2
- **Files modified:** 1

## Accomplishments

1. **Show Entries Migration (008)** -- Created `show_entries` table (uuid PK, show_id FK with CASCADE, member_id FK with CASCADE, horse_name, rider_name, status with CHECK constraint, total_cents, payment_id FK to payments with SET NULL, timestamps) and `show_entry_classes` junction table (uuid PK, entry_id FK with CASCADE, class_id FK with CASCADE, fee_cents snapshot, created_at, UNIQUE on entry_id+class_id). RLS enabled on both tables with SELECT-only policies for members (own data) and admins (all data). Indexes on show_id, member_id, payment_id, and entry_id. Reuses `update_updated_at()` trigger for show_entries.

2. **TypeScript Types** -- Added `ShowEntryRow`, `ShowEntryClassRow`, `ShowEntryWithClasses`, and `CreateShowEntryInput` interfaces to `database.ts` following established patterns. ShowEntryWithClasses extends ShowEntryRow with classes array. CreateShowEntryInput captures show_id, horse_name, rider_name, and class_ids array for batch entry creation.

3. **Server Actions** -- Created 5 server actions in `show-entries.ts`:
   - `getMemberEntries()` -- All entries for authenticated member with show names and classes, ordered by created_at DESC
   - `getMemberEntriesForShow(showId)` -- Entries for a specific show with classes
   - `getShowEntries(showId)` -- Admin-only: all entries for a show with member names and classes (uses admin client)
   - `createShowEntries(entries[])` -- Batch creation with class fee validation, fee_cents snapshot, total_cents calculation, draft status
   - `cancelShowEntry(entryId)` -- Cancel draft entries only, verifies ownership
   All actions include input validation, sanitizeSupabaseError, auth checks, and path revalidation.

## Task Commits

| Task | Commit Message | Hash |
|------|---------------|------|
| Task 1: Migration | feat(18-03): create show_entries and show_entry_classes table migration with RLS | `4040fe0` |
| Task 2: Types + Actions | feat(18-03): add ShowEntry types and CRUD server actions for show entries | `79b7cf5` |

## Files Created

- `supabase/migrations/008_show_entries.sql` -- Tables, RLS policies, indexes, unique constraint, trigger
- `src/lib/actions/show-entries.ts` -- 5 server actions with 'use server' directive

## Files Modified

- `src/types/database.ts` -- Added ShowEntryRow, ShowEntryClassRow, ShowEntryWithClasses, CreateShowEntryInput interfaces

## Decisions Made

1. **Admin client for writes** -- All write operations (create, update/cancel) use `createAdminClient()` with service role key to bypass RLS, consistent with the payments pattern from Phase 17. Read operations use the regular Supabase client with RLS for member-scoped access.

2. **Fee snapshot pattern** -- `show_entry_classes.fee_cents` captures the class fee at the time of entry creation. If an admin later changes a class price, existing entries retain their original fee amounts. `total_cents` on the entry row is the pre-calculated sum.

3. **Admin role check in getShowEntries** -- Uses `user.app_metadata?.role` check in the server action before using admin client, ensuring only admins can access all entries.

4. **Batch creation** -- `createShowEntries` accepts an array of entries to support submitting multiple horse/rider combos at once, but all must be for the same show.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Checks

- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] ShowEntryRow and ShowEntryClassRow interfaces match migration schema
- [x] All 5 actions exported from show-entries.ts
- [x] Migration uses correct sequential number (008)
- [x] RLS follows payments pattern (SELECT-only for users, writes via admin client)
- [x] Entry creation validates class_ids against active show_classes
- [x] fee_cents snapshot captured in show_entry_classes at creation time

## Next Phase Readiness

- Migration ready for execution in Supabase Dashboard
- Server actions ready for member entry UI integration
- Types ready for entry form components
- payment_id column ready for Phase 19 payment integration
- getShowEntries admin action ready for Phase 21 admin views

---
*Phase: 18-show-entry-system*
*Completed: 2026-02-17*
