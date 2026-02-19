# Roadmap: SWMRHA Website Rebuild

## Overview

A ground-up rebuild of the SWMRHA website from a downloaded Wix site to a modern Next.js 16 application with Supabase backend. Features a dark western-professional aesthetic inspired by NRHA.com, admin panel for content management, and live data on all public pages.

## Domain Expertise

None

## Completed Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-7) — SHIPPED 2026-02-14
- ✅ [v1.1 Admin & Management](milestones/v1.1-ROADMAP.md) (Phases 8-13) — SHIPPED 2026-02-16
- ✅ **v2.0 Member Portal & Payments** — Phases 14-21 — SHIPPED 2026-02-18

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>✅ v1.0 MVP (Phases 1-7) - SHIPPED 2026-02-14</summary>

- [x] Phase 1: Foundation & Theme (3/3 plans) — completed 2026-02-12
- [x] Phase 2: Content Extraction (3/3 plans) — completed 2026-02-12
- [x] Phase 3: Home & About Pages (2/2 plans) — completed 2026-02-13
- [x] Phase 4: Shows & Results Pages (2/2 plans) — completed 2026-02-13
- [x] Phase 5: Membership & Resources (2/2 plans) — completed 2026-02-13
- [x] Phase 6: Gallery, Sponsors & Contact (2/2 plans) — completed 2026-02-13
- [x] Phase 7: Polish & Deployment (3/3 plans) — completed 2026-02-14

</details>

<details>
<summary>✅ v1.1 Admin & Management (Phases 8-13) - SHIPPED 2026-02-16</summary>

- [x] Phase 8: Navigation Consolidation (1/1 plans) — completed 2026-02-16
- [x] Phase 9: Authentication & Admin Foundation (3/3 plans) — completed 2026-02-16
- [x] Phase 10: Show Schedule Management (3/3 plans) — completed 2026-02-16
- [x] Phase 11: Sponsor Management (3/3 plans) — completed 2026-02-16
- [x] Phase 12: Results & Standings Management (3/3 plans) — completed 2026-02-16
- [x] Phase 13: Admin Polish & Testing (3/3 plans) — completed 2026-02-16

</details>

### ✅ v2.0 Member Portal & Payments — SHIPPED 2026-02-18

**Milestone Goal:** Full member portal with Stripe-powered payments for membership dues, show entries, and additional fees — with both member accounts and guest checkout.

#### Phase 14: Stripe Foundation & Member Auth — Complete

**Goal**: Set up Stripe SDK, create member registration/login separate from admin, email verification
**Depends on**: Previous milestone complete
**Completed**: 2026-02-17

Plans:
- [x] 14-01: Stripe SDK Foundation (server/client utilities, webhook handler)
- [x] 14-02: Members Database & Auth Infrastructure (members table, middleware, email confirm)
- [x] 14-03: Member Registration & Login Pages (registration, login, LayoutWrapper update)

#### Phase 15: Member Portal & Profiles — Complete

**Goal**: Build member dashboard shell, profile management, payment history UI
**Depends on**: Phase 14
**Completed**: 2026-02-17

Plans:
- [x] 15-01: Member Portal Shell & Dashboard (layout, sidebar, header, dashboard, member actions)
- [x] 15-02: Profile Management & Payment History (profile view/edit, payment history placeholder)

#### Phase 16: Membership Management — Complete

**Goal**: Membership types/tiers in Supabase, admin CRUD for membership configuration, pricing
**Depends on**: Phase 15
**Completed**: 2026-02-17

Plans:
- [x] 16-01: Database & Server Actions (membership_types table, types, CRUD actions, admin nav)
- [x] 16-02: Admin Membership Types UI & Public Page (admin CRUD pages, dynamic public tiers)
- [x] 16-03: Admin Members UI (member list, edit form, delete, status badges)

#### Phase 17: Membership Payments — Complete

**Goal**: Stripe checkout for dues, renewal tracking, receipts, membership status updates
**Depends on**: Phase 16
**Completed**: 2026-02-17

Plans:
- [x] 17-01: Payments Data Layer & Checkout Session (migration, types, admin client, checkout action)
- [x] 17-02: Webhook Fulfillment & Checkout Pages (fulfillment handler, success/cancel pages)
- [x] 17-03: Checkout UI & Payment History (pay-dues page, payment history, dashboard CTAs)

#### Phase 18: Show Entry System — Complete

**Goal**: Show class/event management, entry selection UI, pricing configuration
**Depends on**: Phase 17
**Completed**: 2026-02-17

Plans:
- [x] 18-01: Show Classes Database & Server Actions (migration, types, CRUD actions)
- [x] 18-02: Admin Show Class Management UI (list, create, edit, delete pages)
- [x] 18-03: Show Entries Database & Server Actions (entries + junction tables, types, entry actions)
- [x] 18-04: Member Show Entry UI & Dashboard Integration (multi-step form, entries list, navigation)

#### Phase 19: Show Entry Payments — Complete

**Goal**: Stripe checkout for show entries, confirmation flow, entry tracking in member portal
**Depends on**: Phase 18
**Completed**: 2026-02-17

Plans:
- [x] 19-01: Entry Checkout Session & Webhook Fulfillment (server actions, multi-line-item checkout, payment dispatch)
- [x] 19-02: Entry Payment UI & Checkout Flow (PayEntryButton, Save & Pay, context-aware success/cancel)

#### Phase 20: Guest Checkout & Additional Fees — Complete

**Goal**: Guest checkout flow for non-members, stall fees, banquet tickets, other event charges
**Depends on**: Phase 19
**Completed**: 2026-02-18

Plans:
- [x] 20-01: Additional Fees Data Layer (migration, types, CRUD + checkout + fulfillment actions)
- [x] 20-02: Admin Fee Items UI (list, create, edit, delete pages + navigation)
- [x] 20-03: Guest Purchase UI & Checkout Flow (public /purchase page, success/cancel pages)
- [x] 20-04: Member Fee Purchase & Integration (member portal purchase, checkout updates, navigation)

#### Phase 21: Payment Admin & Polish — Complete

**Goal**: Admin payment dashboard, refund processing, reports, UAT across all payment flows
**Depends on**: Phase 20
**Completed**: 2026-02-18

Plans:
- [x] 21-01: Admin Payment Data Layer & Payments List (server actions, list page, navigation, dashboard)
- [x] 21-02: Payment Detail & Refund Processing (detail page, Stripe refund, UAT checkpoint)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → ... → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21

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
| 14. Stripe Foundation & Member Auth | v2.0 | 3/3 | Complete | 2026-02-17 |
| 15. Member Portal & Profiles | v2.0 | 2/2 | Complete | 2026-02-17 |
| 16. Membership Management | v2.0 | 3/3 | Complete | 2026-02-17 |
| 17. Membership Payments | v2.0 | 3/3 | Complete | 2026-02-17 |
| 18. Show Entry System | v2.0 | 4/4 | Complete | 2026-02-17 |
| 19. Show Entry Payments | v2.0 | 2/2 | Complete | 2026-02-17 |
| 20. Guest Checkout & Additional Fees | v2.0 | 4/4 | Complete | 2026-02-18 |
| 21. Payment Admin & Polish | v2.0 | 2/2 | Complete | 2026-02-18 |
