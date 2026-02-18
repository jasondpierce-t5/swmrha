---
phase: 18-show-entry-system
plan: "01"
subsystem: show-classes-data-layer
tags: [show-classes, migration, rls, server-actions, crud, fee-cents]

# Dependency graph
requires:
  - phase: 10-show-schedule-management
    provides: shows table, ShowRow types, CRUD actions, update_updated_at() trigger function
  - phase: 17-membership-payments
    provides: createAdminClient(), fee_cents integer pricing pattern
provides:
  - show_classes table with RLS (007_show_classes.sql migration)
  - ShowClassRow and ShowClassInsert TypeScript interfaces
  - 6 CRUD server actions (getShowClasses, getActiveShowClasses, getShowClass, createShowClass, updateShowClass, deleteShowClass)
affects: [18-02-admin-class-management-ui, 18-03-member-entry-ui]

# Tech tracking
tech-stack:
  added: []
  patterns: [admin-client-writes, fee-cents-pricing, cross-join-seed-data]

key-files:
  created:
    - supabase/migrations/007_show_classes.sql
    - src/lib/actions/show-classes.ts
  modified:
    - src/types/database.ts

key-decisions:
  - "Write operations use createAdminClient() (service role) to bypass RLS, consistent with payments pattern"
  - "RLS: public SELECT where is_active=true, admin ALL via app_metadata role check"
  - "fee_cents integer pattern for pricing, consistent with membership_types.price_cents"
  - "UNIQUE constraint on (show_id, name) to prevent duplicate class names per show"
  - "Seed data uses CROSS JOIN to populate classes for ALL existing shows"
  - "admin-navigation.ts not modified -- classes accessed via show detail page, not top-level nav"

patterns-established:
  - "Show class CRUD via admin client for writes, regular client for reads"
  - "Revalidation paths for show class mutations: /admin/shows, /shows, /member/enter-show"

issues-created: []

# Metrics
duration: ~5 min
completed: 2026-02-17
---

# Phase 18 Plan 01: Show Classes Database & Server Actions

**Database migration for show_classes table with RLS, seed data, and 6 CRUD server actions for admin and member-facing features**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 2/2 (both auto)
- **Files created:** 2
- **Files modified:** 1

## Accomplishments

1. **Show Classes Migration (007)** -- Created `show_classes` table with full schema (uuid PK, show_id FK with CASCADE delete, name, fee_cents integer, level nullable, sort_order, is_active, timestamps). RLS enabled with public SELECT for active rows and admin ALL policy. Index on show_id for performance. UNIQUE constraint on (show_id, name) to prevent duplicates. Reuses `update_updated_at()` trigger from migration 001. Seed data inserts 9 classes for every existing show via CROSS JOIN.

2. **TypeScript Types** -- Added `ShowClassRow` interface and `ShowClassInsert` type to `database.ts` following established patterns. ShowClassInsert uses Omit pattern with optional sort_order and is_active overrides.

3. **CRUD Server Actions** -- Created 6 server actions in `show-classes.ts`:
   - `getShowClasses(showId)` -- All classes for a show (admin view, includes inactive)
   - `getActiveShowClasses(showId)` -- Active classes only (member/public view)
   - `getShowClass(id)` -- Single class by ID
   - `createShowClass(data)` -- Insert via admin client with validation
   - `updateShowClass(id, data)` -- Partial update via admin client
   - `deleteShowClass(id)` -- Delete via admin client
   All actions include input validation, sanitizeSupabaseError, and path revalidation.

## Task Commits

| Task | Commit Message | Hash |
|------|---------------|------|
| Task 1: Migration | feat(18-01): create show_classes table migration with RLS, indexes, and seed data | `8ec5f65` |
| Task 2: Types + Actions | feat(18-01): add ShowClass types and CRUD server actions for show classes | `b7cd9e7` |

## Files Created

- `supabase/migrations/007_show_classes.sql` -- Table, RLS policies, indexes, trigger, seed data
- `src/lib/actions/show-classes.ts` -- 6 CRUD server actions with 'use server' directive

## Files Modified

- `src/types/database.ts` -- Added ShowClassRow interface and ShowClassInsert type

## Decisions Made

1. **Admin client for writes** -- Write operations (create, update, delete) use `createAdminClient()` with service role key to bypass RLS, consistent with the payments pattern established in Phase 17. Read operations use the regular Supabase client with RLS.

2. **Unique constraint error handling** -- PostgreSQL error code 23505 is mapped to the user-friendly message "A class with this name already exists for this show" in sanitizeSupabaseError.

3. **No admin navigation changes** -- Show classes are accessed through the show detail page, not as a separate top-level admin navigation item.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Checks

- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] ShowClassRow interface matches migration schema
- [x] All 6 CRUD actions exported from show-classes.ts
- [x] Migration uses correct sequential number (007)
- [x] RLS policies follow established patterns
- [x] fee_cents integer pattern consistent with membership_types

## Next Phase Readiness

- Migration ready for execution in Supabase Dashboard
- Server actions ready for admin UI integration (18-02)
- Types ready for member entry UI integration (18-03)
- 9 seed classes per show ready for testing

---
*Phase: 18-show-entry-system*
*Completed: 2026-02-17*
