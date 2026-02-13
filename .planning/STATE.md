# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-12)

**Core value:** The site must deliver an immediate visual "wow" — a professional, western-aesthetic design inspired by NRHA.com that makes approval effortless and proves the Wix era is over.
**Current focus:** Phase 5 — Membership & Resources

## Current Position

Phase: 4 of 7 (Shows & Results Pages) — Complete
Plan: 2 of 2 in current phase
Status: Phase complete
Last activity: 2026-02-13 — Completed 04-02-PLAN.md via parallel execution

Progress: ██████████ 71%

## Performance Metrics

**Velocity:**
- Total plans completed: 10
- Average duration: 8 min
- Total execution time: 1.4 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 Foundation & Theme | 3/3 | 45 min | 15 min |
| 02 Content Extraction | 3/3 | 28 min | 9 min |
| 03 Home & About Pages | 2/2 | 6 min | 3 min |
| 04 Shows & Results Pages | 2/2 | 6 min | 3 min |

**Recent Trend:**
- Last 5 plans: 8 min, 1 min, 5 min, 3 min, 3 min
- Trend: Stable (parallel execution maintains efficiency)

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 01-01 | Next.js 16.1.6 (not 14) | Latest stable, satisfies "14+" requirement |
| 01-01 | Tailwind CSS v4 | Ships with latest create-next-app; uses CSS-based config (@import "tailwindcss") not tailwind.config.ts |
| 01-01 | Package name "swmrha" (lowercase) | npm naming restriction on uppercase directory names |
| 01-02 | @theme inline for all tokens | Tailwind v4 CSS-based config, no tailwind.config.ts |
| 01-02 | Typography as CSS classes | .text-display, .text-heading-1/2/3 bundle font-size + line-height + weight + family |
| 01-02 | Always-dark mode | Removed prefers-color-scheme; site is always dark western theme |
| 01-02 | Montserrat + Inter via next/font/google | Replaced Geist fonts; font-display: swap for performance |
| 01-03 | Mobile menu z-[60] above header z-50 | Plan specified z-40 but header uses z-50; raised for proper layering |
| 01-03 | Hover dropdowns with 150ms debounce | Prevents flickering when moving between menu items |
| 02-01 | Added MailAddress, QuickLink, RelatedOrg, EventLink types | Proper typing for nested data structures beyond original spec |
| 02-01 | Jeromy Lipps role set to "Contact" | Wix source doesn't specify formal title |
| 02-01 | Show results: static links only | Results page uses dynamic iframes; only button URLs extractable |
| 02-02 | GAG program has 6 rules (not 5) | HTML source contains extra rule about non-placement |
| 02-02 | 7 officers/board from contact page | More detailed than 4-member home page list |
| 02-02 | Facebook link is RockingHLLC | Only social link found; not a dedicated SMRHA page |
| 02-03 | 6 additional sponsors identified from HTML links | Cowtown USA, RDS Financing, Equine Oasis, Rocking H, Aussie Flair, Shaffhauser Stables |
| 02-03 | Central image manifest pattern | src/data/images.ts as single source of truth for all image paths |
| 03-01 | Hero uses full-bleed Image with dark gradient overlay | Ensures text readability across varying background images |
| 03-01 | Quick links in 4-column desktop, 2-column mobile | Optimizes for thumb-friendly tapping on mobile devices |
| 03-02 | Placeholder avatars using UserCircleIcon | Board member photos don't exist in extracted data |
| 03-02 | Phone/email as clickable tel:/mailto: links | Mobile UX optimization - one-tap to call or email |
| 04-01 | images.events.hero1 for shows page hero | Maintains visual consistency with Phase 3 hero patterns |
| 04-01 | BuildingStorefrontIcon and TicketIcon for venue/entry | Provides visual interest and section identification |
| 04-02 | Icon selection based on link content | Trophy for champions, Camera for photos, ChartBar for standings, Document default |
| 04-02 | 3-column results grid on desktop | Optimizes space while maintaining readability |
| 04-02 | Provider URLs shown without https:// | Cleaner visual presentation |

### Deferred Issues

None yet.

### Blockers/Concerns

None — Tailwind v4 config concern from 01-01 resolved in 01-02.

## Session Continuity

Last session: 2026-02-13
Stopped at: Completed 04-02-PLAN.md via parallel execution — Phase 4 complete
Resume file: None
