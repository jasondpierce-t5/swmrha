# SWMRHA Website Rebuild

## What This Is

A modern Next.js website for the Southwest Missouri Reining Horse Association (SWMRHA), replacing the outdated Wix site. Features a dark western-professional aesthetic inspired by NRHA.com, with a Supabase-backed admin panel, full member portal with Stripe-powered payments for membership dues, show entries, and additional fees, and guest checkout for non-members. All public pages serve live data from the database.

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
- ✓ Member registration with email verification — v2.0
- ✓ Member portal with dashboard, profile management, payment history — v2.0
- ✓ Stripe payment infrastructure (SDK, webhooks, idempotent fulfillment) — v2.0
- ✓ Membership dues/renewal payments via Stripe Checkout — v2.0
- ✓ Database-driven membership types with admin CRUD — v2.0
- ✓ Admin member management UI — v2.0
- ✓ Show class management with admin CRUD — v2.0
- ✓ Multi-step show entry registration with class selection — v2.0
- ✓ Show entry payments with multi-line-item Stripe Checkout — v2.0
- ✓ Additional fee types (stall, banquet, vendor) with admin CRUD — v2.0
- ✓ Guest checkout for non-members — v2.0
- ✓ Member fee purchase flow — v2.0
- ✓ Admin payment dashboard with summary statistics — v2.0
- ✓ Payment detail pages with refund processing — v2.0

### Active

(No active requirements — planning next milestone)

### Out of Scope

- Dynamic gallery management — gallery uses static images from original site
- Offline mode — real-time data is the current pattern
- Mobile native app — responsive web works well for barn/showground usage
- Partial refunds — current model is full refund only
- Email notifications for payment confirmations — not yet implemented
- Password reset flow for members — not yet implemented

## Context

Shipped v2.0 with 21,315 LOC (TypeScript, TSX, CSS, SQL).
Tech stack: Next.js 16.1.6, Tailwind CSS v4, Supabase (Auth, Database, Storage), Stripe, Vercel.
Database: 9 tables (shows, sponsors, results, members, membership_types, payments, show_classes, show_entries/show_entry_classes, additional_fee_types/fee_purchases) with RLS policies.
Admin panel: Full CRUD for shows, sponsors, results, membership types, members, show classes, fee items, and payments.
Member portal: Dashboard, profile, payment history, show entry registration, fee purchases.
Payment system: Stripe Checkout for membership dues/renewals, show entries, additional fees, and guest checkout.
Production URL: Deployed on Vercel with continuous deployment via GitHub.

## Constraints

- **Tech stack**: Next.js 16+ (App Router), Tailwind CSS v4, TypeScript — non-negotiable
- **Deployment**: Vercel with continuous deployment
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe (Checkout Sessions, Webhooks, Refunds API)
- **Auth**: Dual-role system — admins via `app_metadata.role`, members via `members` table with email verification

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
| Split BEFORE/AFTER INSERT triggers | FK constraint requires auth.users row before members insert | ✓ Good — resolved FK violation |
| `(portal)` route group for member routes | Prevents auth-checking layout from wrapping login pages | ✓ Good — no redirect loops |
| Loosely coupled membership_types (slug, no FK) | Flexibility for future migration | ✓ Good — convention-based matching |
| price_cents integer storage | Standard Stripe pattern, avoids floating-point issues | ✓ Good — consistent across all fee types |
| Payments SELECT-only RLS, service role writes | System-managed writes ensure payment integrity | ✓ Good — secure payment handling |
| Idempotent webhook fulfillment | Handles duplicate webhooks and race conditions | ✓ Good — robust payment processing |
| Fee snapshot in show_entry_classes | Protects against later admin price changes | ✓ Good — entry fees locked at creation |
| One Stripe line item per entry | Clear receipt itemization for horse/rider combos | ✓ Good — readable Stripe receipts |
| Nullable member_id for guest payments | Guests have no member account | ✓ Good — clean guest checkout |
| Dual-auth checkout action | Single action handles both member and guest | ✓ Good — no code duplication |
| Full refund only (no partial) | Matches simple payment model | — Pending — may need partial in future |
| Refund does NOT auto-change membership status | Admin manages status separately | ✓ Good — prevents accidental changes |

---
*Last updated: 2026-02-18 after v2.0 milestone*
