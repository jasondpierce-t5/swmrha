---
phase: 16-membership-management
plan: "03"
subsystem: membership-management
tags: [admin-members-ui, member-list, member-edit, status-badges, delete-member]

# Dependency graph
requires:
  - phase: 16-membership-management
    plan: "01"
    provides: Admin member management server actions (getMembers, getMemberById, updateMemberAdmin, deleteMember), membership types actions (getMembershipTypes)
provides:
  - Admin members list page at /admin/members
  - Admin member edit page at /admin/members/[id]/edit
  - AdminMemberForm component with personal info, address, and membership sections
  - DeleteMemberButton component with confirmation dialog
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [admin-member-list-table, admin-member-edit-form, color-coded-status-badges, membership-type-dropdown]

key-files:
  created:
    - src/app/admin/members/page.tsx
    - src/app/admin/members/[id]/edit/page.tsx
    - src/components/AdminMemberForm.tsx
    - src/components/DeleteMemberButton.tsx
  modified: []

key-decisions:
  - "StatusBadge and TypeBadge replicated in admin list page (same pattern as member portal dashboard) rather than shared component — keeps pages self-contained"
  - "DeleteMemberButton created alongside list page (Task 1) since the list page imports it, even though it is also used on the edit page"
  - "Membership type dropdown shows price for admin context: 'Individual — $50.00/yr'"
  - "Email displayed as read-only info line below edit page header, not in form (from auth, not editable)"
  - "State field defaults to 'MO' for new/empty values — SWMRHA is Missouri-based"

patterns-established:
  - "Admin member list with color-coded status badges: green=active, yellow=pending, red=expired/suspended"
  - "Admin member edit form with three sections: Personal Information, Address, Membership"
  - "Expiry date highlighted in red when past due"

issues-created: []

# Metrics
duration: ~5 min
completed: 2026-02-17
---

# Phase 16 Plan 03: Admin Members UI

**Admin member list page with status badges, member edit page with form and delete button**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 2/2 (both auto)
- **Files created:** 4
- **Files modified:** 0

## Accomplishments

1. **Admin Members List Page** -- Created `/admin/members` page following the established admin list pattern (shows/page.tsx). Table displays Name, Email, Type (gold badge), Status (color-coded badge: green=active, yellow=pending, red=expired/suspended), Member Since, Expiry (highlighted red if past due), and Actions (Edit link + DeleteMemberButton). Includes success banners for ?success=updated|deleted, error state, and empty state. No "Add Member" button since members self-register.

2. **DeleteMemberButton Component** -- Created client component following DeleteShowButton.tsx pattern. Accepts memberId and memberName props. Confirms deletion with "Delete member [name]? This will remove their account and cannot be undone." Uses useTransition and redirects to /admin/members?success=deleted on success.

3. **AdminMemberForm Component** -- Created client component following ShowForm.tsx pattern with three form sections: Personal Information (first_name required, last_name required, phone), Address (address_line1, address_line2, city, state defaulting to MO, zip), and Membership (type dropdown populated from DB with price display, status dropdown with 4 options, start date, expiry date). Uses useTransition, calls updateMemberAdmin on submit, redirects to /admin/members?success=updated.

4. **Admin Member Edit Page** -- Created `/admin/members/[id]/edit` page following admin/shows/[id]/edit pattern. Async server component that fetches member by ID and membership types in parallel via Promise.all. Shows back link, member name in header, email as read-only info line, AdminMemberForm, and DeleteMemberButton in the header area.

## Task Commits

| Task | Commit Message | Hash |
|------|---------------|------|
| Task 1: Admin members list page | feat(16-03): create admin members list page with status badges | `12bda49` |
| Task 2: Admin member edit page | feat(16-03): create admin member edit page with form and delete button | `b585fbb` |

## Files Created
- `src/app/admin/members/page.tsx` -- Admin members list page with table, badges, and actions
- `src/app/admin/members/[id]/edit/page.tsx` -- Admin member edit page with form and delete
- `src/components/AdminMemberForm.tsx` -- Member edit form with personal info, address, and membership sections
- `src/components/DeleteMemberButton.tsx` -- Delete button with confirmation dialog

## Files Modified
None.

## Decisions Made
1. **Badge components inline** -- StatusBadge and TypeBadge are defined inline in the list page, matching the pattern from the member portal dashboard. This keeps each page self-contained without requiring a shared components import.
2. **Promise.all for parallel fetching** -- The edit page fetches member data and membership types in parallel for better performance.
3. **State default 'MO'** -- Address state field defaults to 'MO' since SWMRHA is a Missouri-based association.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## Verification Checks
- [x] `npm run build` succeeds without errors
- [x] Admin members list shows table with all columns
- [x] Status badges are color-coded correctly (green=active, yellow=pending, red=expired/suspended)
- [x] Edit page loads member data and populates form
- [x] Membership type dropdown shows options from membership_types table with price
- [x] Delete confirmation works

## Next Phase Readiness
- Phase 16 admin UI is complete -- membership types UI (16-02) and members UI (16-03) both operational
- Admin can view all members, edit membership details, and delete members
- Ready for Phase 17 membership payments integration

---
*Phase: 16-membership-management*
*Completed: 2026-02-17*
