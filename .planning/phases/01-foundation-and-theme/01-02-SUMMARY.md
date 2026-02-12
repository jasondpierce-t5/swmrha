---
phase: 01-foundation-and-theme
plan: 02
subsystem: ui
tags: [tailwindcss-v4, theme, color-palette, typography, montserrat, inter, dark-theme, design-system]

# Dependency graph
requires:
  - phase: 01-01
    provides: Next.js project with Tailwind CSS v4 and globals.css
provides:
  - Dark western-professional color palette (navy/gold/teal)
  - Montserrat + Inter typography system
  - Custom font size scale (display, heading-1/2/3)
  - Living theme reference page at /theme
  - CSS custom properties for all design tokens
affects: [01-03, 03-01, 03-02, 04-01, 04-02, 05-01, 05-02, 06-01, 06-02]

# Tech tracking
tech-stack:
  added: [montserrat-font, inter-font]
  patterns: [tailwind-v4-theme-inline, css-custom-properties, dark-always-mode, next-font-google]

key-files:
  created: [src/app/theme/page.tsx]
  modified: [src/app/globals.css, src/app/layout.tsx]

key-decisions:
  - "Tailwind v4 @theme inline directive for all tokens (no tailwind.config.ts)"
  - "Typography scale as CSS classes (.text-display, .text-heading-1/2/3) rather than Tailwind utilities — composite properties require bundled font-size + line-height + weight + family"
  - "Always-dark mode (removed prefers-color-scheme media query) — site is always dark western theme"
  - "next/font/google for Montserrat and Inter (replaces Geist fonts from create-next-app)"

patterns-established:
  - "Color usage: bg-navy-800 body, bg-navy-700 cards, bg-navy-900 footer, border-navy-600 dividers"
  - "Accent pattern: gold-500 for CTAs/highlights, teal-500 for links/secondary"
  - "Text hierarchy: text-white primary, text-slate-300 secondary, text-slate-400 muted"
  - "Typography: font-heading for headings (Montserrat), font-body for body (Inter)"

issues-created: []

# Metrics
duration: 4min
completed: 2026-02-12
---

# Phase 1 Plan 2: Dark Western Theme System Summary

**Tailwind v4 theme with navy/gold/teal color palette, Montserrat + Inter typography, custom font scale, and living reference page at /theme**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-12T17:02:00Z
- **Completed:** 2026-02-12T17:06:00Z
- **Tasks:** 3/3 (2 auto + 1 checkpoint)
- **Files modified:** 3

## Accomplishments
- Full dark western-professional color palette: navy (900/800/700/600), gold (500/400/300), teal (500/400), plus semantic colors
- Montserrat headings (600/700/800 weights) and Inter body text (400/500/600) via next/font/google
- Custom typography scale: display (3.5rem/800), heading-1 (2.25rem/700), heading-2 (1.75rem/700), heading-3 (1.25rem/600)
- Living theme reference page at /theme showing color swatches, typography, cards, buttons, and text hierarchy
- CSS custom properties for all tokens, usable outside Tailwind contexts
- Gold-on-navy text selection styling, smooth scrolling

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure Tailwind v4 theme with western color palette and typography** - `9a84a30` (feat)
2. **Task 2: Create theme reference page with all design tokens** - `8d80bef` (feat)
3. **Task 3: Human verification** - Approved by user

## Files Created/Modified
- `src/app/globals.css` - Complete theme system: @theme inline tokens, CSS custom properties, typography classes, base dark styles
- `src/app/layout.tsx` - Montserrat + Inter fonts via next/font/google, updated metadata
- `src/app/theme/page.tsx` - Living style guide showing all design tokens

## Decisions Made
- **Tailwind v4 @theme inline:** Plan referenced tailwind.config.ts but project uses Tailwind v4 — all tokens defined via @theme inline directive in globals.css
- **Typography classes over utilities:** Custom font sizes (display, heading-1/2/3) implemented as CSS classes because they bundle font-size + line-height + weight + family — not expressible as single Tailwind utilities
- **Always dark mode:** Removed prefers-color-scheme media query — SWMRHA is always dark western theme, never light
- **Replaced Geist with Montserrat/Inter:** next/font/google with font-display: swap for performance

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Tailwind v4 CSS-based configuration instead of tailwind.config.ts**
- **Found during:** Task 1 (theme configuration)
- **Issue:** Plan specified updating `tailwind.config.ts` but project uses Tailwind CSS v4 which has no config file — uses CSS `@theme inline` directive instead
- **Fix:** All color, typography, and spacing tokens defined via `@theme inline { ... }` in globals.css with `--color-*`, `--font-*`, and `--radius-*` custom properties
- **Files modified:** src/app/globals.css
- **Verification:** `npm run build` passes, all Tailwind utility classes (bg-navy-800, text-gold-500, etc.) work correctly
- **Committed in:** `9a84a30`

---

**Total deviations:** 1 auto-fixed (blocking — Tailwind v4 config model)
**Impact on plan:** Necessary adaptation. Same outcome (custom theme tokens as Tailwind utilities), different mechanism (CSS vs JS config).

## Issues Encountered
None — build passes, theme renders correctly, human approved the visual aesthetic.

## Next Phase Readiness
- Theme system complete, ready for layout shell (01-03-PLAN.md)
- All custom colors available as Tailwind utilities: bg-navy-*, text-gold-*, border-teal-*, etc.
- Typography classes ready: .text-display, .text-heading-1/2/3, font-heading, font-body
- Card pattern established: bg-navy-700 rounded-card border border-navy-600

---
*Phase: 01-foundation-and-theme*
*Completed: 2026-02-12*
