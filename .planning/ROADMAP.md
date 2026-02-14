# Roadmap: SWMRHA Website Rebuild

## Overview

A ground-up rebuild of the SWMRHA website from a downloaded Wix site to a modern Next.js 14+ application. The journey starts with project foundation and theme, extracts all real content from the existing site, builds out each page group with a dark western-professional aesthetic inspired by NRHA.com, and culminates in a polished, deployed MVP on Vercel that proves the Wix era is over.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Theme** - Next.js 14+ project setup, Tailwind dark western theme, layout system with navigation and footer
- [x] **Phase 2: Content Extraction** - Parse all Wix HTML pages, create static data files, organize and optimize images
- [x] **Phase 3: Home & About Pages** - Home page with hero imagery, events preview, welcome message; About page with mission, board of directors
- [x] **Phase 4: Shows & Results Pages** - Show schedule page, show results/standings page, event detail layouts
- [x] **Phase 5: Membership & Resources** - Membership info, rules/classes, Green as Grass buckle program, FAQ, Find a Trainer
- [ ] **Phase 6: Gallery, Sponsors & Contact** - Photo/video gallery, sponsors page with logos, contact page with form
- [ ] **Phase 7: Polish & Deployment** - SEO/meta tags, accessibility audit, performance optimization, responsive testing, Vercel deployment

## Phase Details

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
- [ ] 03-01: Home page — hero section, upcoming events cards, welcome message, quick links
- [ ] 03-02: About page — mission/history section, board of directors grid with photos

### Phase 4: Shows & Results Pages
**Goal**: A Shows & Events page with schedule, dates, locations, classes, and entry info; a Results/Standings page displaying points standings and past show results.
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns from Phase 3)
**Plans**: 2 plans

Plans:
- [ ] 04-01: Shows & Events page — schedule table/cards, dates, locations, classes, entry info
- [ ] 04-02: Results & Standings page — points standings tables, past show results display

### Phase 5: Membership & Resources
**Goal**: Membership page with benefits and dues, Rules & Classes page, Green as Grass buckle program page, FAQ page, and Find a Trainer page.
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns, standard page layouts)
**Plans**: 2 plans

Plans:
- [ ] 05-01: Membership page (info, benefits, dues) and Rules & Classes page (reining class descriptions, association rules)
- [ ] 05-02: Green as Grass buckle program, FAQ page, Find a Trainer page

### Phase 6: Gallery, Sponsors & Contact
**Goal**: Photo/video gallery page with existing site media, sponsors page with logos and links, contact page with form and social media links.
**Depends on**: Phase 2
**Research**: Unlikely (standard gallery patterns, contact form)
**Plans**: 2 plans

Plans:
- [ ] 06-01: Gallery page — photo/video grid with lightbox, responsive layout
- [ ] 06-02: Sponsors page (logos grid with links) and Contact page (form, region info, social links)

### Phase 7: Polish & Deployment
**Goal**: Production-ready site with SEO meta tags, accessibility compliance, optimized performance, thorough responsive testing, and live deployment on Vercel.
**Depends on**: Phases 3-6
**Research**: Likely (Vercel deployment configuration, Next.js 14 metadata API, SEO best practices)
**Research topics**: Next.js 14 generateMetadata API, Vercel project configuration, Open Graph tags for Next.js, structured data for local organizations
**Plans**: 3 plans

Plans:
- [ ] 07-01: SEO — meta tags, Open Graph, structured data, sitemap generation
- [ ] 07-02: Accessibility audit and fixes — contrast, semantic HTML, alt text, keyboard navigation
- [ ] 07-03: Performance optimization, responsive testing across devices, Vercel deployment

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation & Theme | 3/3 | Complete | 2026-02-12 |
| 2. Content Extraction | 3/3 | Complete | 2026-02-12 |
| 3. Home & About Pages | 2/2 | Complete | 2026-02-13 |
| 4. Shows & Results Pages | 2/2 | Complete | 2026-02-13 |
| 5. Membership & Resources | 2/2 | Complete | 2026-02-13 |
| 6. Gallery, Sponsors & Contact | 2/2 | Complete | 2026-02-13 |
| 7. Polish & Deployment | 3/3 | Complete | 2026-02-14 |
