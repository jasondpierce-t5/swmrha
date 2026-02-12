---
phase: 02-content-extraction
plan: 01
subsystem: data
tags: [typescript, content-extraction, wix-migration, data-modeling]

requires:
  - phase: 01-foundation-and-theme
    provides: Next.js project structure with TypeScript and App Router
provides:
  - Typed data files for all core page content (home, about, shows, membership, FAQ)
  - Shared TypeScript interfaces for content types
affects: [03-home-about, 04-shows-results, 05-membership-resources]

tech-stack:
  added: []
  patterns: [typed data files in src/data/, content extracted from Wix HTML]

key-files:
  created: [src/data/types.ts, src/data/home.ts, src/data/about.ts, src/data/shows.ts, src/data/membership.ts, src/data/faq.ts]
  modified: []

key-decisions:
  - "Board members section labeled 'Friends of The SMRHA' in Wix source, not 'Board of Directors' -- preserved original labeling context in code comments"
  - "Added MailAddress interface to types.ts beyond plan spec to properly type the mail-in address structure"
  - "Show results page is mostly dynamic iframes -- extracted only static button/link URLs that were available in the HTML"
  - "Jeromy Lipps role set to 'Contact' rather than 'President' since the Wix source only identifies him as a contact, not by title"
  - "Used unicode escape \\u201c/\\u201d for curly quotes to match exact Wix HTML content"

patterns-established:
  - "Pattern: src/data/*.ts exports typed content objects for page consumption"
  - "Pattern: Content arrays use 'as const' for literal type safety where appropriate"
  - "Pattern: External URLs preserved exactly as found in Wix HTML source"

issues-created: []

duration: 12min
completed: 2026-02-12
---

# Phase 2 Plan 1: Core Content Extraction Summary

**Created 6 typed TypeScript data files extracting all core page content from Wix HTML into structured, importable modules.**

## Performance

- **Duration:** 12 minutes
- **Started:** 2026-02-12T13:10:12Z
- **Completed:** 2026-02-12T13:22:00Z
- **Tasks:** 2
- **Files created:** 6

## Accomplishments
- Created shared TypeScript interfaces (BoardMember, ContactInfo, Event, FAQ, Sponsor, Trainer, PageContent, MailAddress, QuickLink, RelatedOrg) in types.ts
- Extracted home page content: hero title/subtitle, mission statement paragraphs, upcoming events (Route 66 Slide + Patriot Slide), quick links, related orgs, show announcements, and GAG buckle info
- Extracted about page content: mission statement, board members (4), primary contact info (Jeromy Lipps)
- Extracted show schedule: 2 events with full link sets (show bills, entries, results, photos, warm-ups), venue info, and stall discount notes
- Extracted show results: 6 external result/photo links from WhiteHorse Show Management and TD Photography
- Extracted membership content: join heading, form URLs (SignUpGenius + PDF), mail-in address, and 3 educational sections (What is Reining, breed info, Is Reining for me)
- Extracted FAQ: intro text and all 5 Q&A pairs with NRHA links
- All content verified against Wix HTML source -- no fabricated content

## Task Commits

1. **Task 1: Create data types and extract home/about content** - `d32b4fe` (feat)
2. **Task 2: Extract shows, membership, and FAQ content** - `6c547b4` (feat)

**Plan metadata:** [will be committed by main context]

## Files Created/Modified
- `src/data/types.ts` - Shared TypeScript interfaces (BoardMember, ContactInfo, Event, FAQ, Sponsor, Trainer, PageContent, MailAddress, QuickLink, RelatedOrg)
- `src/data/home.ts` - Home page content (hero, mission, events, quick links, related orgs)
- `src/data/about.ts` - About page content (mission, board members, contact)
- `src/data/shows.ts` - Show schedule (2 events), venue, results links, providers
- `src/data/membership.ts` - Join info, form URLs, mail address, educational content
- `src/data/faq.ts` - FAQ intro and 5 Q&A pairs

## Decisions Made
- Added `MailAddress`, `QuickLink`, and `RelatedOrg` interfaces to types.ts beyond the original plan spec to properly type nested data structures
- Preserved the Wix site's "Friends of The SMRHA" label for board members rather than assuming "Board of Directors"
- Set Jeromy Lipps' role to "Contact" since the Wix source does not specify a formal title
- Used `as const` assertions on content arrays where the data is fixed and benefits from literal types
- Extracted show results page links from static HTML buttons since the main results content loads via dynamic iframes

## Deviations from Plan
- Added `MailAddress`, `QuickLink`, and `RelatedOrg` interfaces to types.ts (auto-added -- needed for proper typing)
- Added `EventLink` interface as a named type for the link objects within Event (cleaner than inline type)
- Added extra home page content fields (`welcomeHeading`, `openInvitation`, `contactCallout`, `showAnnouncements`, `gagBuckleInfo`) that were present in the HTML but not explicitly listed in the plan -- included for completeness

## Issues Encountered
- The Wix HTML files are very large (600KB+) and deeply nested, requiring targeted grep/read operations rather than full file reads
- Show results page (`smrhashowresults.html`) has most content in dynamically-loaded iframes -- only static button links could be extracted
- The MQHA link in the Wix source actually points to kansasreining.com (likely a Wix bug in the original site) -- preserved the display text "www.MQHA.com" as the org name

## Next Phase Readiness
- All 6 data files are ready for consumption by page components in phases 03-05
- Types are exported and can be imported by any component via `@/data/types`
- Content data is imported via `@/data/home`, `@/data/about`, etc.
- No media/image assets extracted yet -- that will be handled in Plan 02-03

---
*Phase: 02-content-extraction*
*Completed: 2026-02-12*
