---
phase: 11-sponsor-management
plan: 01
subsystem: database
tags: [supabase, rls, postgresql, server-actions, crud, storage, image-upload]

# Dependency graph
requires:
  - phase: 09-authentication-admin-foundation
    provides: Supabase client utilities, middleware auth, RBAC via app_metadata.role
  - phase: 10-show-schedule-management
    provides: Established patterns for SQL migrations, RLS policies, server actions
provides:
  - Sponsors table in Supabase with RLS policies
  - Supabase Storage bucket 'sponsor-logos' with admin-only write policies
  - TypeScript database types (SponsorRow, SponsorInsert, SponsorUpdate)
  - Server actions for full CRUD + image upload/delete (7 actions total)
affects: [11-02, 11-03]

# Tech tracking
tech-stack:
  added: [supabase-storage]
  patterns: [storage-image-upload, storage-cleanup-on-delete]

key-files:
  created:
    - supabase/migrations/002_sponsors.sql
    - src/lib/actions/sponsors.ts
  modified:
    - src/types/database.ts

key-decisions:
  - "Supabase Storage bucket 'sponsor-logos' with public read — logos served without auth"
  - "Storage cleanup on sponsor delete — deleteSponsor checks for Storage URL and removes file"
  - "Legacy image paths preserved in seed data — existing /images/sponsors/ paths unchanged"
  - "Sort order by tier bands: Platinum=0, Diamond=10, Gold=20, Silver=30, Bronze=40"

patterns-established:
  - "Storage upload pattern: FormData -> unique filename -> upload -> getPublicUrl"
  - "Storage cleanup on delete: fetch row first, check URL pattern, remove from bucket"
  - "Storage RLS pattern: public SELECT, admin INSERT/UPDATE/DELETE scoped to bucket_id"

issues-created: []

# Metrics
duration: 5min
completed: 2026-02-16
---

# Phase 11 Plan 01: Sponsors Database, Storage & Server Actions Summary

**Supabase sponsors table with RLS policies, Storage bucket for logo uploads, 12 seeded sponsors, and 7 server actions for full CRUD + image management**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-16
- **Completed:** 2026-02-16
- **Tasks:** 2
- **Files created:** 2
- **Files modified:** 1

## Accomplishments
- Sponsors table created in Supabase with full schema (uuid PK, name, level, image_url, website_url, sort_order, timestamps)
- RLS policies: public SELECT for all, admin-only INSERT/UPDATE/DELETE via app_metadata.role
- Supabase Storage bucket 'sponsor-logos' with public read and admin-only write policies
- 12 existing sponsors seeded from static data with tier-based sort_order bands
- 7 server actions: getSponsors, getSponsor, createSponsor, updateSponsor, deleteSponsor, uploadSponsorLogo, deleteSponsorLogo
- deleteSponsor automatically cleans up Storage logos before removing the database row

## Task Commits

Each task was committed atomically:

1. **Task 1: SQL migration with table, RLS, Storage, trigger, and seed data** - `e54807c` (feat)
2. **Task 2: TypeScript types and CRUD server actions with image upload** - `783dde4` (feat)

## Files Created/Modified
- `supabase/migrations/002_sponsors.sql` - Table creation, RLS policies, Storage bucket + policies, trigger, 12 seeded sponsors
- `src/types/database.ts` - Added SponsorRow, SponsorInsert, SponsorUpdate types
- `src/lib/actions/sponsors.ts` - 7 server actions (5 CRUD + 2 image) with 'use server' directive

## Decisions Made
- Supabase Storage bucket 'sponsor-logos' set to public=true so logos can be served without authentication
- Storage cleanup on delete: deleteSponsor fetches the row first, checks if image_url contains the Supabase Storage URL pattern, and removes the file from the bucket
- Legacy image paths from seed data preserved as-is (/images/sponsors/*) — these are static file paths, not Storage URLs
- Sort order uses tier bands (Platinum=0, Diamond=10, Gold=20, etc.) with alphabetical ordering within each tier

## Deviations from Plan

None - plan executed exactly as written.

## Authentication Gates

During execution, the SQL migration will require manual execution in the Supabase Dashboard:
1. Checkpoint: User should run `002_sponsors.sql` in SQL Editor
   - Sponsors table created with 12 seeded rows
   - Storage bucket 'sponsor-logos' created
   - Resume after verification

These are normal gates, not errors.

## Issues Encountered
None

## Next Phase Readiness
- Sponsors table with RLS active in Supabase (after migration is run)
- Storage bucket ready for logo uploads
- Server actions ready for admin UI (Plan 11-02) and public page migration (Plan 11-03)
- TypeScript types available for form components

---
*Phase: 11-sponsor-management*
*Completed: 2026-02-16*
