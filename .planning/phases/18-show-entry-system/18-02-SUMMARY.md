---
phase: 18-show-entry-system
plan: "02"
subsystem: admin-class-management-ui
tags: [show-classes, admin-ui, crud, forms, price-input, fee-cents]

# Dependency graph
requires:
  - phase: 18-show-entry-system/01
    provides: show_classes table, ShowClassRow/ShowClassInsert types, 6 CRUD server actions
  - phase: 10-show-schedule-management
    provides: shows table, ShowRow types, getShow action, admin show pages
provides:
  - Admin show classes list page (/admin/shows/[id]/classes)
  - Admin create class page (/admin/shows/[id]/classes/new)
  - Admin edit class page (/admin/shows/[id]/classes/[classId]/edit)
  - ShowClassForm client component
  - DeleteShowClassButton client component
  - "Classes" action link on admin shows list
affects: [18-03-member-entry-ui]

# Tech tracking
tech-stack:
  added: []
  patterns: [fee-cents-price-input, admin-crud-pages, delete-confirmation-dialog]

key-files:
  created:
    - src/app/admin/shows/[id]/classes/page.tsx
    - src/app/admin/shows/[id]/classes/new/page.tsx
    - src/app/admin/shows/[id]/classes/[classId]/edit/page.tsx
    - src/components/ShowClassForm.tsx
    - src/components/DeleteShowClassButton.tsx
  modified:
    - src/app/admin/shows/page.tsx

key-decisions:
  - "DeleteShowClassButton created in Task 1 (not Task 2) since the classes list page imports it — minor deviation from plan task boundaries"
  - "Fee input uses $ prefix with dollar input, converts to cents via Math.round(parseFloat * 100) — consistent with MembershipTypeForm pattern"
  - "Edit page includes Danger Zone section with DeleteShowClassButton below the form"
  - "Classes list page accepts both success and error searchParams for message banners"
  - "className prop on DeleteShowClassButton aliased to classDisplayName to avoid collision with React's className prop"

patterns-established:
  - "Show sub-resource admin pages follow /admin/shows/[id]/{resource} URL pattern"
  - "Delete buttons in edit pages wrapped in Danger Zone section with red styling"

issues-created: []

# Metrics
duration: ~5 min
completed: 2026-02-17
---

# Phase 18 Plan 02: Admin Show Class Management UI

**Admin CRUD pages and components for managing show classes within each show's management area**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17
- **Completed:** 2026-02-17
- **Tasks:** 2/2 (both auto)
- **Files created:** 5
- **Files modified:** 1

## Accomplishments

1. **Show Classes List Page** -- Created `/admin/shows/[id]/classes` with table displaying class name, fee (formatted as $X.XX), level, sort order, active/inactive status badges, and Edit/Delete action buttons. Includes success/error message banners via searchParams, empty state message, back link to shows list, and "Add Class" button.

2. **Admin Shows Page Update** -- Added "Classes" link with ListBulletIcon in the actions column of the admin shows list, linking to `/admin/shows/${show.id}/classes` for each show.

3. **ShowClassForm Component** -- Client component following MembershipTypeForm pattern with fee dollar-to-cents conversion ($prefix input), name (required), level (optional), sort order, and active checkbox. Uses useState, useTransition for pending state, validation, and redirects to classes list on success.

4. **Create/Edit Pages** -- New class page at `/admin/shows/[id]/classes/new` with ShowClassForm in create mode. Edit page at `/admin/shows/[id]/classes/[classId]/edit` with ShowClassForm in edit mode plus Danger Zone section containing DeleteShowClassButton.

5. **DeleteShowClassButton Component** -- Client component following DeleteShowButton pattern with confirmation dialog, calls deleteShowClass server action, and redirects to classes list with success message.

## Task Commits

| Task | Commit Message | Hash |
|------|---------------|------|
| Task 1: List page + Shows link | feat(18-02): create show classes list page and add Classes link to admin shows | `ee77fb6` |
| Task 2: Form + Create/Edit pages | feat(18-02): add ShowClassForm component and create/edit pages for show classes | `c6a374c` |

## Files Created

- `src/app/admin/shows/[id]/classes/page.tsx` -- Show classes list page with table, badges, messages
- `src/app/admin/shows/[id]/classes/new/page.tsx` -- Create new class page
- `src/app/admin/shows/[id]/classes/[classId]/edit/page.tsx` -- Edit class page with danger zone
- `src/components/ShowClassForm.tsx` -- Reusable form component for create/edit
- `src/components/DeleteShowClassButton.tsx` -- Delete button with confirmation dialog

## Files Modified

- `src/app/admin/shows/page.tsx` -- Added ListBulletIcon import and "Classes" link in actions column

## Deviations from Plan

1. **DeleteShowClassButton created in Task 1** -- The plan assigns DeleteShowClassButton to Task 2, but the classes list page (Task 1) imports it. Moved creation to Task 1 to ensure the build compiles after each task commit. The component was built complete (not a stub), so Task 2 did not need to modify it.

## Verification Checks

- [x] `npx tsc --noEmit` passes
- [x] `npm run build` succeeds without errors
- [x] Admin shows list has "Classes" action link for each show
- [x] Classes list page renders with table showing class data with correct fee formatting
- [x] Create form saves new class with correct cents conversion
- [x] Edit form loads existing data and saves updates
- [x] Delete button removes class with confirmation
- [x] All navigation links work (back links, success redirects)
- [x] All three new routes appear in build output

## Next Phase Readiness

- Admin class management UI complete and ready for use
- Show classes can be created, listed, edited, and deleted through admin interface
- Member entry UI (18-03) can now build on these patterns

---
*Phase: 18-show-entry-system*
*Completed: 2026-02-17*
