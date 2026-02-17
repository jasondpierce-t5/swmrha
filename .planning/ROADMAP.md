# Roadmap: SWMRHA Website Rebuild

## Overview

A ground-up rebuild of the SWMRHA website from a downloaded Wix site to a modern Next.js 14+ application. The journey starts with project foundation and theme, extracts all real content from the existing site, builds out each page group with a dark western-professional aesthetic inspired by NRHA.com, and culminates in a polished, deployed MVP on Vercel that proves the Wix era is over.

## Domain Expertise

None

## Milestones

- ✅ **v1.0 MVP** - Phases 1-7 (shipped 2026-02-14)
- ✅ **v1.1 Admin & Management** - Phases 8-13 (shipped 2026-02-16)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>✅ v1.0 MVP (Phases 1-7) - SHIPPED 2026-02-14</summary>

### Phase 1: Foundation & Theme
**Goal**: A working Next.js 14+ app with Tailwind CSS, the dark western-professional theme established (colors, typography, spacing), and a responsive layout shell with navigation and footer — ready to receive page content.
**Depends on**: Nothing (first phase)
**Research**: Likely (NRHA.com design reference for western aesthetic, Next.js 14 App Router patterns)
**Research topics**: NRHA.com visual design patterns (colors, typography, layout), Next.js 14 App Router project structure, Tailwind dark theme configuration
**Plans**: 3 plans

Plans:
- [x] 01-01: Next.js 14+ project initialization with TypeScript, Tailwind CSS, App Router
- [x] 01-02: Dark western theme system — color palette, typography, Tailwind config
- [x] 01-03: Layout shell — responsive header with navigation, footer, page wrapper

### Phase 2: Content Extraction
**Goal**: All usable content from `./currentsite/` extracted into organized static data files and optimized images — the single source of truth for all page content.
**Depends on**: Phase 1
**Research**: Unlikely (internal HTML parsing, content organization)
**Plans**: 3 plans

Plans:
- [x] 02-01: Parse core page HTML (home, about, membership, shows, results, FAQ)
- [x] 02-02: Parse supplementary pages (sponsors, trainers, Green as Grass, stall/map info) and extract structured data
- [x] 02-03: Organize and optimize images — logos, board photos, event flyers, action shots

### Phase 3: Home & About Pages
**Goal**: A visually impressive home page with bold hero, upcoming events, welcome message, and quick links; an About page with mission/history and board of directors with photos.
**Depends on**: Phase 2
**Research**: Unlikely (building pages with established theme and extracted content)
**Plans**: 2 plans

Plans:
- [x] 03-01: Home page — hero section, upcoming events cards, welcome message, quick links
- [x] 03-02: About page — mission/history section, board of directors grid with photos

### Phase 4: Shows & Results Pages
**Goal**: A Shows & Events page with schedule, dates, locations, classes, and entry info; a Results/Standings page displaying points standings and past show results.
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns from Phase 3)
**Plans**: 2 plans

Plans:
- [x] 04-01: Shows & Events page — schedule table/cards, dates, locations, classes, entry info
- [x] 04-02: Results & Standings page — points standings tables, past show results display

### Phase 5: Membership & Resources
**Goal**: Membership page with benefits and dues, Rules & Classes page, Green as Grass buckle program page, FAQ page, and Find a Trainer page.
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns, standard page layouts)
**Plans**: 2 plans

Plans:
- [x] 05-01: Membership page (info, benefits, dues) and Rules & Classes page (reining class descriptions, association rules)
- [x] 05-02: Green as Grass buckle program, FAQ page, Find a Trainer page

### Phase 6: Gallery, Sponsors & Contact
**Goal**: Photo/video gallery page with existing site media, sponsors page with logos and links, contact page with form and social media links.
**Depends on**: Phase 2
**Research**: Unlikely (standard gallery patterns, contact form)
**Plans**: 2 plans

Plans:
- [x] 06-01: Gallery page — photo/video grid with lightbox, responsive layout
- [x] 06-02: Sponsors page (logos grid with links) and Contact page (form, region info, social links)

### Phase 7: Polish & Deployment
**Goal**: Production-ready site with SEO meta tags, accessibility compliance, optimized performance, thorough responsive testing, and live deployment on Vercel.
**Depends on**: Phases 3-6
**Research**: Likely (Vercel deployment configuration, Next.js 14 metadata API, SEO best practices)
**Research topics**: Next.js 14 generateMetadata API, Vercel project configuration, Open Graph tags for Next.js, structured data for local organizations
**Plans**: 3 plans

Plans:
- [x] 07-01: SEO — meta tags, Open Graph, structured data, sitemap generation
- [x] 07-02: Accessibility audit and fixes — contrast, semantic HTML, alt text, keyboard navigation
- [x] 07-03: Performance optimization, responsive testing across devices, Vercel deployment

</details>

### ✅ v1.1 Admin & Management (Shipped 2026-02-16)

**Milestone Goal:** Enable content management capabilities for show schedules, sponsors, and results with streamlined navigation and secure admin access.

#### Phase 8: Navigation Consolidation

**Goal**: Review and streamline the navigation menu structure, remove or consolidate unneeded items, improve information architecture for better user experience.
**Depends on**: v1.0 complete
**Research**: Unlikely (internal UI reorganization)
**Plans**: TBD

Plans:
- [x] 08-01: Restructure navigation config, fix results routing, update footer

#### Phase 9: Authentication & Admin Foundation

**Goal**: Establish authentication system with user roles, create protected admin layout, implement role-based access control for management features.
**Depends on**: Phase 8
**Research**: Likely (auth provider selection, implementation patterns, role-based access)
**Research topics**: NextAuth.js vs Clerk vs Supabase Auth, role-based middleware patterns in Next.js 14, protected route strategies
**Plans**: TBD

Plans:
- [x] 09-01: Supabase auth infrastructure — packages, client utilities, middleware, auth callback
- [x] 09-02: Login page with email/password auth, unauthorized page, logout handler
- [x] 09-03: Admin layout with sidebar/header and dashboard with content cards

#### Phase 10: Show Schedule Management

**Goal**: Build admin dashboard for creating, editing, and deleting show events with dates, locations, classes, and entry information.
**Depends on**: Phase 9
**Research**: Unlikely (CRUD patterns, established UI components)
**Plans**: 3 plans

Plans:
- [x] 10-01: Shows table SQL migration, RLS policies, TypeScript types, CRUD server actions
- [x] 10-02: Admin shows list page, create/edit pages with dynamic form, delete with confirmation
- [x] 10-03: Public shows page and admin dashboard migrated to Supabase

#### Phase 11: Sponsor Management

**Goal**: Create admin interface for managing sponsors including adding/removing sponsors, uploading logos, and setting display order.
**Depends on**: Phase 9
**Research**: Likely (image upload handling, storage solution)
**Research topics**: Cloudinary vs Uploadthing vs Vercel Blob storage, Next.js 14 image upload patterns, drag-and-drop file upload UX
**Plans**: TBD

Plans:
- [x] 11-01: Sponsors table SQL migration, RLS policies, Storage bucket, TypeScript types, CRUD server actions
- [x] 11-02: Admin sponsors list page, create/edit pages with image upload form, delete with confirmation
- [x] 11-03: Public sponsors page and admin dashboard migrated to Supabase

#### Phase 12: Results & Standings Management

**Goal**: Develop admin tools for entering show results, managing point standings, and publishing results to the public site.
**Depends on**: Phase 9
**Research**: Unlikely (similar CRUD patterns from previous phases)
**Plans**: 3 plans

Plans:
- [x] 12-01: Results table SQL migration, RLS policies, TypeScript types, CRUD server actions
- [x] 12-02: Admin results list page, create/edit pages with form, delete with confirmation
- [x] 12-03: Public results page and admin dashboard migrated to Supabase

#### Phase 13: Admin Polish & Testing

**Goal**: Refine admin UX, implement comprehensive form validation, conduct thorough testing of all admin features, update deployment configuration.
**Depends on**: Phases 10-12
**Research**: Unlikely (polishing and refinement work)
**Plans**: 3 plans

Plans:
- [x] 13-01: Server-side validation enhancement, error sanitization, HTML5 form validation attributes
- [x] 13-02: Success notification banners on admin list pages, dashboard finalization
- [x] 13-03: Production build verification, comprehensive admin acceptance testing

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Foundation & Theme | v1.0 | 3/3 | Complete | 2026-02-12 |
| 2. Content Extraction | v1.0 | 3/3 | Complete | 2026-02-12 |
| 3. Home & About Pages | v1.0 | 2/2 | Complete | 2026-02-13 |
| 4. Shows & Results Pages | v1.0 | 2/2 | Complete | 2026-02-13 |
| 5. Membership & Resources | v1.0 | 2/2 | Complete | 2026-02-13 |
| 6. Gallery, Sponsors & Contact | v1.0 | 2/2 | Complete | 2026-02-13 |
| 7. Polish & Deployment | v1.0 | 3/3 | Complete | 2026-02-14 |
| 8. Navigation Consolidation | v1.1 | 1/1 | Complete | 2026-02-16 |
| 9. Authentication & Admin Foundation | v1.1 | 3/3 | Complete | 2026-02-16 |
| 10. Show Schedule Management | v1.1 | 3/3 | Complete | 2026-02-16 |
| 11. Sponsor Management | v1.1 | 3/3 | Complete | 2026-02-16 |
| 12. Results & Standings Management | v1.1 | 3/3 | Complete | 2026-02-16 |
| 13. Admin Polish & Testing | v1.1 | 3/3 | Complete | 2026-02-16 |
