---
phase: 16-membership-management
plan: "01"
subsystem: membership-management
tags: [membership-types, admin-members, server-actions, migration, rls]

# Dependency graph
requires:
  - phase: 14-stripe-foundation-member-auth
    provides: Members table, auth infrastructure, RLS patterns
  - phase: 15-member-portal-profiles
    provides: MemberRow type, member actions pattern, member portal shell
provides:
  - membership_types table with RLS and seed data
  - MembershipTypeRow and MembershipTypeInsert TypeScript types
  - Membership type CRUD server actions (6 functions)
  - Admin member management server actions (4 functions)
  - Admin navigation with Members and Membership Types items
affects: [16-02-admin-membership-types-ui, 16-03-admin-members-ui, 17-membership-payments]

# Tech tracking
tech-stack:
  added: []
  patterns: [membership-type-crud, admin-member-management, public-rls-read]

key-files:
  created:
    - supabase/migrations/005_membership_types.sql
    - src/lib/actions/membership-types.ts
    - src/lib/actions/admin-members.ts
  modified:
    - src/types/database.ts
    - src/lib/admin-navigation.ts

key-decisions:
  - "No FK constraint from members.membership_type to membership_types — loosely coupled via slug convention"
  - "Public (unauthenticated) read access for active membership types — needed for public pricing page"
  - "AdminMemberUpdate excludes id, email, created_at, updated_at — email is from auth.users, not editable"
  - "Membership status validation enforces enum: pending, active, expired, suspended"

patterns-established:
  - "Public RLS policy: SELECT with is_active filter, no auth required"
  - "Admin member management: separate actions file from member self-service (admin-members.ts vs members.ts)"
  - "Slug validation: lowercase alphanumeric with hyphens only"

issues-created: []

# Metrics
duration: ~8 min
completed: 2026-02-17
---

# Phase 16 Plan 01: Membership Types Data Layer & Admin Actions

**Database migration, TypeScript types, CRUD server actions for membership types, admin member management actions, and admin navigation updates**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 2/2 (both auto)
- **Files created:** 3
- **Files modified:** 2

## Accomplishments

1. **Membership Types Migration (005)** -- Created `membership_types` table with all specified columns (id, name, slug, description, price_cents, duration_months, benefits jsonb, sort_order, is_active, timestamps). RLS policies allow public read of active types and admin full CRUD. Updated_at trigger reuses existing function. Seeded with 4 default types (Individual $50, Family $75, Youth $25, Lifetime $500).

2. **TypeScript Types** -- Added `MembershipTypeRow` interface and `MembershipTypeInsert` type to `database.ts`, following the established pattern with Omit for auto-generated fields and optional defaults.

3. **Membership Type Server Actions** -- Created `membership-types.ts` with 6 exported functions: `getMembershipTypes()`, `getActiveMembershipTypes()`, `getMembershipType(id)`, `createMembershipType(data)`, `updateMembershipType(id, data)`, `deleteMembershipType(id)`. All follow the shows.ts pattern with sanitizeSupabaseError, input validation, and path revalidation.

4. **Admin Member Management Actions** -- Created `admin-members.ts` with 4 exported functions: `getMembers()`, `getMemberById(id)`, `updateMemberAdmin(id, data)`, `deleteMember(id)`. The `AdminMemberUpdate` interface allows updating all fields including system fields (membership_type, membership_status, dates, stripe_customer_id).

5. **Admin Navigation** -- Added "Members" (UserGroupIcon, /admin/members) and "Membership Types" (TagIcon, /admin/membership-types) nav items after Results.

## Task Commits

| Task | Commit Message | Hash |
|------|---------------|------|
| Task 1: Migration + types | feat(16-01): create membership_types table migration and TypeScript types | `74166de` |
| Task 2: Actions + nav | feat(16-01): create membership management server actions and update admin nav | `edd008c` |

## Files Created
- `supabase/migrations/005_membership_types.sql` -- Table, RLS, trigger, seed data
- `src/lib/actions/membership-types.ts` -- 6 CRUD server actions for membership types
- `src/lib/actions/admin-members.ts` -- 4 admin member management server actions

## Files Modified
- `src/types/database.ts` -- Added MembershipTypeRow and MembershipTypeInsert types
- `src/lib/admin-navigation.ts` -- Added Members and Membership Types nav items

## Decisions Made
1. **No FK constraint** -- members.membership_type remains a text field loosely coupled to membership_types.slug by convention, as specified in the plan. This avoids migration complexity while maintaining data consistency through matching slug values.
2. **Public RLS for active types** -- The SELECT policy on membership_types has no auth requirement and filters `is_active = true`, enabling the public pricing/membership page to display tiers without authentication.
3. **Separate admin-members.ts** -- Admin member management lives in its own file separate from the member self-service `members.ts`, keeping admin-level operations (system field updates, delete) cleanly separated from member-facing actions (profile self-edit).

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## Verification Checks
- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] Migration SQL has valid syntax (table, RLS, trigger, seed)
- [x] All server action functions are exported and importable
- [x] Admin navigation includes both new items

## Next Phase Readiness
- Membership type CRUD actions ready for admin UI (16-02)
- Admin member management actions ready for members UI (16-03)
- Migration ready for execution in Supabase Dashboard
- Public `getActiveMembershipTypes()` ready for Phase 17 Stripe checkout integration

---
*Phase: 16-membership-management*
*Completed: 2026-02-17*
