---
phase: 11-sponsor-management
plan: 02
subsystem: admin
tags: [supabase, react, forms, image-upload, admin]

# Dependency graph
requires:
  - phase: 11-sponsor-management/11-01
    provides: SponsorRow/SponsorInsert/SponsorUpdate types, CRUD server actions, uploadSponsorLogo, sponsors table
provides:
  - Admin sponsors list page with table view
  - Admin sponsor create/edit pages with image upload
  - DeleteSponsorButton client component
  - SponsorForm reusable form component with image upload
affects: [11-03, 13-admin-polish-testing]

# Tech tracking
tech-stack:
  added: []
  patterns: [image-upload-with-preview, constrained-select-dropdown, storage-upload-in-form-submit]

key-files:
  created:
    - src/app/admin/sponsors/page.tsx
    - src/app/admin/sponsors/new/page.tsx
    - src/app/admin/sponsors/[id]/edit/page.tsx
    - src/components/SponsorForm.tsx
    - src/components/DeleteSponsorButton.tsx
  modified: []

key-decisions:
  - "Used plain <img> tags instead of next/image for sponsor logos — external Supabase Storage URLs not configured in next.config remotePatterns, and plan scope does not include next.config changes"
  - "Level field is a constrained SELECT dropdown with 6 options: Platinum, Diamond, Gold, Silver, Bronze, Friends"
  - "Image upload workflow: file select -> local preview via URL.createObjectURL -> upload to Storage on form submit -> use returned URL for create/update"
  - "Image removal sets image_url to null on update — old Storage files cleaned up by deleteSponsor action, not on update"

patterns-established:
  - "Image upload in form pattern: useState for File + preview URL, upload in startTransition before create/update"
  - "Constrained dropdown pattern: const array of allowed values mapped to <option> elements"
  - "Admin CRUD with image: same Server Component wrapper + Client form pattern, extended with file input"

issues-created: []

# Metrics
duration: 5min
completed: 2026-02-16
---

# Phase 11 Plan 02: Admin Sponsors CRUD UI Summary

**Admin sponsors management with list/table view, create/edit forms with logo upload and preview, constrained level dropdown, and delete with confirmation**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-16
- **Completed:** 2026-02-16
- **Tasks:** 2
- **Files created:** 5

## Accomplishments
- Admin sponsors list page at /admin/sponsors with responsive table, logo thumbnails, level color coding, and truncated website URLs
- Shared SponsorForm component handling both create and edit with image upload, preview, and removal
- Level field constrained to SELECT dropdown with 6 sponsor tiers (Platinum, Diamond, Gold, Silver, Bronze, Friends)
- Image upload integrates with Supabase Storage via uploadSponsorLogo server action
- Delete functionality with confirmation dialog via DeleteSponsorButton client component
- Empty state with BuildingStorefrontIcon and error state for failed data fetches
- Full CRUD cycle: list -> create -> edit -> delete all working end-to-end
- `npm run build` passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Admin sponsors list page with table and delete** - `a1f2d72` (feat)
2. **Task 2: Sponsor form component and create/edit pages** - `1e9ef6c` (feat)

## Files Created/Modified
- `src/app/admin/sponsors/page.tsx` - Server Component list page with table, logo thumbnails, level coloring, error/empty states
- `src/components/DeleteSponsorButton.tsx` - Client Component with confirm dialog + useTransition
- `src/components/SponsorForm.tsx` - Shared form with image upload/preview, level dropdown, all fields
- `src/app/admin/sponsors/new/page.tsx` - Create page wrapper with SponsorForm action="create"
- `src/app/admin/sponsors/[id]/edit/page.tsx` - Edit page fetching sponsor data, SponsorForm action="edit"

## Decisions Made
- Used plain `<img>` tags instead of `next/image` for sponsor logos because external Supabase Storage URLs require `remotePatterns` configuration in `next.config.ts`, which is outside the scope of this plan
- Level field implemented as a constrained `<select>` dropdown (not free text) with exactly 6 options matching the established tier system
- Image upload happens inside `startTransition` before the create/update call -- upload first, get URL, then save sponsor
- Image removal on edit sets `image_url` to `null` -- old Storage file cleanup is handled by `deleteSponsor`, not on update (matching plan guidance about leaving old paths alone)

## Deviations from Plan

- Used `<img>` instead of `next/image` for logo thumbnails in the list page to avoid build errors from unconfigured external image domains. This is a minor implementation detail that does not affect functionality.

## Issues Encountered
None

## Next Phase Readiness
- Admin sponsors CRUD complete with all 5 files
- SponsorForm pattern with image upload available for reference in future admin forms
- Ready for public page migration (11-03) to consume sponsor data from Supabase
- Level dropdown pattern reusable across the application

---
*Phase: 11-sponsor-management*
*Completed: 2026-02-16*
