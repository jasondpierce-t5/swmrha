---
phase: 14-stripe-foundation-member-auth
plan: 02
subsystem: auth
tags: [supabase, rls, members, middleware, email-verification, triggers]

# Dependency graph
requires:
  - phase: 09-auth-admin-foundation
    provides: Supabase SSR auth, middleware route protection, RBAC via app_metadata
provides:
  - Members table with RLS policies
  - Auto-create member profile trigger on signup
  - /member/* route protection in middleware
  - Role-aware auth callback (admin→/admin, member→/member)
  - Email confirmation route (/auth/confirm)
affects: [member-portal, membership-management, membership-payments]

# Tech tracking
tech-stack:
  added: []
  patterns: [split-trigger-before-after, role-aware-redirect, member-route-protection]

key-files:
  created: [supabase/migrations/004_members_table.sql, src/app/auth/confirm/route.ts]
  modified: [src/lib/supabase/middleware.ts, src/app/auth/callback/route.ts]

key-decisions:
  - "Split signup trigger into BEFORE INSERT (set role) and AFTER INSERT (create profile) to avoid FK violation"
  - "Members table uses auth.users id as primary key (1:1 relationship)"
  - "Default state='MO' for Southwest Missouri association"
  - "Email confirmation via /auth/confirm with token_hash (separate from PKCE callback)"

patterns-established:
  - "Member route protection: /member/* requires any authenticated user"
  - "Role-aware auth callback: checks app_metadata.role for redirect target"
  - "Split triggers for FK-constrained child table creation"

issues-created: []

# Metrics
duration: 6min
completed: 2026-02-17
---

# Phase 14 Plan 02: Members Database & Auth Infrastructure Summary

**Members table with RLS, split signup triggers, middleware route protection, and email confirmation flow**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-17T19:24:00Z
- **Completed:** 2026-02-17T19:35:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 4

## Accomplishments
- Members table with full profile fields, membership tracking, and Stripe customer ID placeholder
- RLS policies: members see own data, admins see all
- Split triggers: BEFORE INSERT sets role, AFTER INSERT creates member profile
- Middleware protects /member/* routes (redirect to /member/login)
- Role-aware auth callback redirects admin→/admin, member→/member
- Email confirmation route handles token_hash verification

## Task Commits

Each task was committed atomically:

1. **Task 1: Create members table SQL migration** - `14171ed` (feat)
2. **Task 2: Update middleware and auth routes** - `cc50a78` (feat)
3. **Task 3: Run SQL migration** - checkpoint:human-action (executed in Supabase Dashboard)
4. **Fix: Split trigger into BEFORE/AFTER** - `8972fb2` (fix)

## Files Created/Modified
- `supabase/migrations/004_members_table.sql` - Members table, RLS, triggers
- `src/lib/supabase/middleware.ts` - Added /member/* route protection
- `src/app/auth/callback/route.ts` - Role-aware redirect after code exchange
- `src/app/auth/confirm/route.ts` - Email verification token_hash handler

## Decisions Made
- Split signup trigger into BEFORE/AFTER INSERT — BEFORE INSERT can modify NEW (set role), AFTER INSERT can reference parent row (FK constraint satisfied)
- Members.id is auth.users.id (uuid) — 1:1 relationship, CASCADE delete
- Default membership_status='pending', membership_type='individual'
- Email confirmation uses separate /auth/confirm route (token_hash flow, not PKCE)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Split BEFORE INSERT trigger into BEFORE + AFTER**
- **Found during:** Checkpoint verification (user reported "Database error saving new user")
- **Issue:** Single BEFORE INSERT trigger tried to INSERT into members table before auth.users row existed, violating FK constraint
- **Fix:** Split into set_member_role() BEFORE INSERT (modifies NEW.raw_app_meta_data) and create_member_profile() AFTER INSERT (inserts member row after auth.users exists)
- **Files modified:** supabase/migrations/004_members_table.sql
- **Verification:** User successfully registered after fix
- **Committed in:** 8972fb2

---

**Total deviations:** 1 auto-fixed (1 bug), 0 deferred
**Impact on plan:** Bug fix essential for correct signup flow. No scope creep.

## Issues Encountered
- BEFORE INSERT trigger FK violation — fixed by splitting into two triggers (see deviations)

## Next Phase Readiness
- Members table ready for member portal (Phase 15)
- Auth infrastructure supports both admin and member roles
- Email confirmation flow operational
- Middleware protects member routes

---
*Phase: 14-stripe-foundation-member-auth*
*Completed: 2026-02-17*
