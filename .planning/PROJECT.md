# SWMRHA Website Rebuild

## What This Is

A ground-up rebuild of the Southwest Missouri Reining Horse Association (SWMRHA) website, replacing the outdated Wix site with a modern Next.js application. The MVP is a static, visually impressive site that demonstrates a massive upgrade to secure stakeholder buy-in before adding backend features (payments, membership, admin).

## Core Value

The site must deliver an immediate visual "wow" — a professional, western-aesthetic design inspired by NRHA.com that makes approval effortless and proves the Wix era is over.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Home page with bold hero imagery, upcoming events, welcome message, quick links
- [ ] About page with mission/history, board of directors/officers with photos
- [ ] Shows & Events page with schedule, dates, locations, classes, entry info
- [ ] Results / Standings page with points standings and past show results
- [ ] Membership page with info, benefits, dues structure (static — no payments)
- [ ] Rules & Classes page with reining class descriptions, association rules, linked documents
- [ ] Gallery page with photo/video gallery from existing site media
- [ ] Sponsors page with logos and links
- [ ] Contact page with contact form, region info, social media links
- [ ] NRHA-inspired dark western-professional theme (deep navy/black, white text, accent colors)
- [ ] Mobile-first responsive design (barn/showground usage)
- [ ] All content extracted from `./currentsite/` — no placeholder text
- [ ] Image optimization (next/image, lazy loading, responsive, appropriate formats)
- [ ] SEO basics (meta tags, Open Graph, structured titles)
- [ ] Accessibility (proper contrast, semantic HTML, alt text)
- [ ] Professional navigation with dropdowns
- [ ] Card-based content layouts for events and news

### Out of Scope

- Database / backend (Supabase) — future phase post-approval
- Authentication / user accounts — future phase
- Stripe payments for membership & show entries — future phase
- Admin panel / CMS — future phase
- Dynamic content management — content is hardcoded/static data files for MVP

## Context

- The current Wix site has been fully downloaded to `./currentsite/` — this is the primary source for all content, images, videos, documents, and site structure
- Design inspiration from https://nrha.com — dark, western-professional aesthetic adapted for SWMRHA's regional scale
- Target audience checks the site from barns and show grounds on mobile devices
- This is a demonstration MVP — the goal is visual proof that justifies continued investment in a modern platform
- Additional pages beyond the 9 listed should be included if discovered in `./currentsite/`

## Constraints

- **Tech stack**: Next.js 14+ (App Router), Tailwind CSS, TypeScript — non-negotiable
- **Deployment**: Vercel
- **Content source**: All text/media must come from `./currentsite/` — no fabricated content
- **Static MVP**: No server-side data, no API routes needed for v1

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14+ App Router | Modern React framework with built-in image optimization and SSG | — Pending |
| Tailwind CSS for styling | Rapid styling with utility classes, easy dark theme implementation | — Pending |
| Static MVP first | Prove the visual upgrade before investing in backend complexity | — Pending |
| NRHA.com as design reference | Establishes credibility through association with the national organization's aesthetic | — Pending |

---
*Last updated: 2026-02-12 after initialization*
