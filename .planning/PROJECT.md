# SWMRHA Website Rebuild

## What This Is

A modern Next.js website for the Southwest Missouri Reining Horse Association (SWMRHA), replacing the outdated Wix site. Features a dark western-professional aesthetic inspired by NRHA.com, with a Supabase-backed admin panel for managing shows, sponsors, and results. All public pages serve live data from the database.

## Core Value

The site must deliver an immediate visual "wow" — a professional, western-aesthetic design inspired by NRHA.com that makes approval effortless and proves the Wix era is over.

## Requirements

### Validated

- ✓ Home page with bold hero imagery, upcoming events, welcome message, quick links — v1.0
- ✓ About page with mission/history, board of directors/officers with photos — v1.0
- ✓ Shows & Events page with schedule, dates, locations, classes, entry info — v1.0
- ✓ Results / Standings page with points standings and past show results — v1.0
- ✓ Membership page with info, benefits, dues structure — v1.0
- ✓ Rules & Classes page with reining class descriptions, association rules, linked documents — v1.0
- ✓ Gallery page with photo/video gallery from existing site media — v1.0
- ✓ Sponsors page with logos and links — v1.0
- ✓ Contact page with contact form, region info, social media links — v1.0
- ✓ NRHA-inspired dark western-professional theme (deep navy/black, white text, accent colors) — v1.0
- ✓ Mobile-first responsive design (barn/showground usage) — v1.0
- ✓ All content extracted from `./currentsite/` — no placeholder text — v1.0
- ✓ Image optimization (next/image, lazy loading, responsive, appropriate formats) — v1.0
- ✓ SEO basics (meta tags, Open Graph, structured titles) — v1.0
- ✓ Accessibility (proper contrast, semantic HTML, alt text) — v1.0
- ✓ Professional navigation with dropdowns — v1.0
- ✓ Card-based content layouts for events and news — v1.0
- ✓ Streamlined navigation information architecture — v1.1
- ✓ Authentication with role-based access control — v1.1
- ✓ Admin panel with dashboard — v1.1
- ✓ Show schedule CRUD management — v1.1
- ✓ Sponsor CRUD management with logo uploads — v1.1
- ✓ Results & standings CRUD management — v1.1
- ✓ Server-side validation and error handling — v1.1
- ✓ All public pages serving live Supabase data — v1.1

### Active

(No active requirements — planning next milestone)

### Out of Scope

- Stripe payments for membership & show entries — future phase
- Member portal / user accounts — future phase
- Dynamic gallery management — gallery uses static images from original site
- Offline mode — real-time data is the current pattern
- Mobile native app — responsive web works well for barn/showground usage

## Context

Shipped v1.1 with 9,195 LOC (TypeScript, TSX, CSS, SQL) across 35 routes.
Tech stack: Next.js 16.1.6, Tailwind CSS v4, Supabase (Auth, Database, Storage), Vercel.
Database: 3 tables (shows, sponsors, results) with RLS policies.
Admin panel: Full CRUD for shows, sponsors, results with live data on all public pages.
Production URL: Deployed on Vercel with continuous deployment via GitHub.

## Constraints

- **Tech stack**: Next.js 16+ (App Router), Tailwind CSS v4, TypeScript — non-negotiable
- **Deployment**: Vercel with continuous deployment
- **Backend**: Supabase (Auth, Database, Storage)
- **Auth**: Admin-only access, manually created accounts, RBAC via `app_metadata.role`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 16 App Router | Modern React framework with built-in image optimization and SSG | ✓ Good — 35 routes, all static generation |
| Tailwind CSS v4 for styling | Rapid styling with utility classes, CSS-based config | ✓ Good — dark theme implemented cleanly |
| Static MVP first (v1.0) | Prove visual upgrade before investing in backend | ✓ Good — secured buy-in for v1.1 |
| NRHA.com as design reference | Establishes credibility through national org aesthetic | ✓ Good — professional western look achieved |
| Supabase for backend | Auth, DB, Storage in one platform, generous free tier | ✓ Good — fast to implement, RLS for security |
| Three-client Supabase SSR pattern | Official `@supabase/ssr` pattern for browser/server/middleware | ✓ Good — clean separation of concerns |
| RBAC via `app_metadata.role` | Only service role can modify — users cannot self-elevate | ✓ Good — secure admin access |
| JSONB for show links/notes | Flexible arrays without join tables | ✓ Good — simplified schema |
| Plain `<img>` for Storage URLs | Supabase Storage not in `next.config` remotePatterns | ⚠️ Revisit — configure remotePatterns in future |
| No validation library | HTML5 attributes sufficient for admin scope | ✓ Good — kept dependencies minimal |
| POST-based logout | CSRF protection via form submission | ✓ Good — follows security best practices |
| Tier-based sort_order bands | Consistent sponsor ordering with room within tiers | ✓ Good — intuitive ordering |

---
*Last updated: 2026-02-16 after v1.1 milestone*
