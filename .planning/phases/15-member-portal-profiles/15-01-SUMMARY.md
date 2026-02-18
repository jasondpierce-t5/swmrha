---
phase: 15-member-portal-profiles
plan: "01"
subsystem: member-portal
tags: [member-portal, layout, dashboard, auth, server-actions]
requires: [14-02, 14-03]
provides: [member-layout-shell, member-dashboard, member-profile-action]
affects: [LayoutWrapper, database-types]
tech-stack: [Next.js 16, Tailwind CSS v4, Supabase SSR, Heroicons]
key-files:
  - src/components/MemberLayoutShell.tsx
  - src/components/MemberSidebar.tsx
  - src/components/MemberHeader.tsx
  - src/app/member/(portal)/layout.tsx
  - src/app/member/(portal)/page.tsx
  - src/app/member/logout/route.ts
  - src/lib/member-navigation.ts
  - src/lib/actions/members.ts
  - src/types/database.ts
  - src/components/LayoutWrapper.tsx
key-decisions:
  - Used (portal) route group to separate authenticated member routes from login/register
  - Extracted member navigation into dedicated config file (member-navigation.ts) matching admin pattern
  - MemberLayoutShell follows AdminLayoutShell pattern exactly for consistency
duration: ~15 minutes
completed: 2026-02-17
---

# 15-01 Summary: Member Portal Shell & Dashboard

## Performance
- Plan read + context analysis: ~2 min
- Task 1 implementation: ~6 min
- Task 2 implementation: ~4 min
- Verification + commits: ~3 min
- Total: ~15 min

## Accomplishments
1. **Member Portal Layout Shell** -- Created MemberLayoutShell, MemberSidebar, and MemberHeader components mirroring the admin panel pattern with dark western theme, responsive sidebar, and mobile hamburger menu.
2. **Member Navigation Config** -- Created `member-navigation.ts` with Dashboard, My Profile, and Payment History nav items, following the `admin-navigation.ts` pattern.
3. **Authenticated Route Layout** -- Created `(portal)` route group with server-side auth check, member name fetching, and redirect to login for unauthenticated users.
4. **Member Logout** -- Created POST route handler at `/member/logout` that signs out and redirects to `/member/login`.
5. **LayoutWrapper Update** -- Simplified fullscreen route check to `pathname.startsWith("/member")` so all member portal routes use their own layout shell.
6. **MemberRow Type** -- Added complete `MemberRow` interface to `database.ts` matching the members table schema.
7. **getMemberProfile Action** -- Server action with auth check and Supabase error sanitization, following the `shows.ts` pattern.
8. **Member Dashboard Page** -- Full dashboard with welcome banner, membership status card (type/status/dates with color-coded badges), profile summary card, quick links grid, and payment history empty state.

## Task Commits
| Task | Commit | Hash |
|------|--------|------|
| Task 1: Member layout components | feat(15-01): create member portal layout shell and components | `5f7c440` |
| Task 2: Dashboard page + action | feat(15-01): create member dashboard page and getMemberProfile action | `42a123b` |

## Files Created
- `src/components/MemberLayoutShell.tsx` -- Client component composing sidebar + header + content
- `src/components/MemberSidebar.tsx` -- Client component with nav links, View Site, Sign out
- `src/components/MemberHeader.tsx` -- Client component with page title, user name, sign out
- `src/lib/member-navigation.ts` -- Navigation config for member portal
- `src/app/member/(portal)/layout.tsx` -- Server layout with auth check
- `src/app/member/(portal)/page.tsx` -- Dashboard with live member data
- `src/app/member/logout/route.ts` -- POST handler for sign out
- `src/lib/actions/members.ts` -- getMemberProfile server action

## Files Modified
- `src/types/database.ts` -- Added MemberRow interface
- `src/components/LayoutWrapper.tsx` -- Simplified member route check

## Decisions Made
1. **Route Group Architecture**: Used Next.js `(portal)` route group to separate authenticated member routes from login/register/logout. This prevents the auth-checking layout from wrapping the login page (which would cause a redirect loop). Login/register pages remain directly under `/member/` without the portal shell.
2. **Navigation Config Extraction**: Created a dedicated `member-navigation.ts` file rather than inlining navigation data, matching the established `admin-navigation.ts` pattern for consistency and reusability.
3. **userName over userEmail**: Member layout displays user's name (first_name + last_name) instead of email, since member profiles have name fields unlike the admin panel which only uses email.

## Deviations from Plan
1. **Route Group Addition**: Plan specified `src/app/member/layout.tsx` but this was changed to `src/app/member/(portal)/layout.tsx` using a route group. This was necessary to prevent the auth-checking layout from wrapping login/register pages, which would cause redirect loops. This is an auto-fix blocker deviation.
2. **Navigation Config File**: Plan did not explicitly call for a separate `member-navigation.ts` file, but the admin pattern uses `admin-navigation.ts` and both MemberSidebar and MemberHeader need the navigation config. Auto-added for pattern consistency.
3. **Dashboard page location**: Changed from `src/app/member/page.tsx` to `src/app/member/(portal)/page.tsx` as a consequence of the route group change. URL path remains `/member` as intended.

## Issues Encountered
- None. Build passed on both verification runs without errors.

## Next Phase Readiness
- Member portal shell is ready for profile editing (15-02) and payment history (Phase 17)
- The `(portal)` route group structure cleanly supports adding new authenticated member pages
- `getMemberProfile()` action is available for reuse in profile edit pages
- Quick links point to `/member/profile/edit` and `/member/payments` which will be created in subsequent plans
