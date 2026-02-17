# Phase 9: Authentication & Admin Foundation - Context

**Gathered:** 2026-02-16
**Status:** Ready for research

<vision>
## How This Should Work

Individual admin accounts for board members — each person gets their own email/password login so you can track who changed what. When an admin logs in, they land on a clean dashboard with sidebar navigation, content count cards, and quick-action buttons. It should feel like a real CMS, not a hack.

The admin area uses the same dark western aesthetic as the public site — cohesive branding, not a separate-looking app. The sidebar, header, and layout need to feel professional and intuitive enough for non-technical board members to navigate confidently.

Supabase is the auth provider — chosen intentionally because future features (user accounts, points tracking, member management) will need the database. This is a long-term platform investment, not just an auth solution.

</vision>

<essential>
## What Must Be Nailed

- **Admin layout & navigation** — The admin shell is the priority. Sidebar, header, professional layout that non-technical board members can navigate easily. This is the frame everything else builds on.
- **Rock-solid auth** — Proper password hashing, session management, protected routes. The admin area must be locked down.
- **Supabase integration** — Set up Supabase correctly from the start since it will be the backbone for future data features.

</essential>

<boundaries>
## What's Out of Scope

- No actual CRUD features yet — show management, sponsor management, results management all come in Phases 10-12
- No public-facing changes — regular visitors shouldn't notice anything different
- No member-facing accounts — this is admin-only, public user accounts are a future milestone
- No data migration — existing static data stays as-is until management features are built

</boundaries>

<specifics>
## Specific Ideas

- Dark theme matching the public site — same color palette, typography, western-professional feel
- Clean dashboard landing with sidebar nav, content summary cards, quick actions
- Individual accounts per admin/board member (not a shared password)
- Supabase for auth (and eventually database for users, points, accounts)

</specifics>

<notes>
## Additional Context

The user is thinking long-term: Supabase was chosen not just for auth but because future milestones will need the database for user accounts, points tracking, and member management. The auth foundation should be set up with this growth path in mind.

The admin layout is the higher priority over auth mechanics — the experience of navigating the admin area matters more than the login flow itself. Board members who use this aren't technical, so clarity and ease of use is paramount.

</notes>

---

*Phase: 09-authentication-admin-foundation*
*Context gathered: 2026-02-16*
