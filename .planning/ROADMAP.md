# Roadmap: SWMRHA Website Rebuild

## Overview

A ground-up rebuild of the SWMRHA website from a downloaded Wix site to a modern Next.js 16 application with Supabase backend. Features a dark western-professional aesthetic inspired by NRHA.com, admin panel for content management, and live data on all public pages.

## Domain Expertise

None

## Completed Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-7) — SHIPPED 2026-02-14
- ✅ [v1.1 Admin & Management](milestones/v1.1-ROADMAP.md) (Phases 8-13) — SHIPPED 2026-02-16
- 🚧 **v2.0 Member Portal & Payments** — Phases 14-21 (in progress)

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

### 🚧 v2.0 Member Portal & Payments (In Progress)

**Milestone Goal:** Full member portal with Stripe-powered payments for membership dues, show entries, and additional fees — with both member accounts and guest checkout.

#### Phase 14: Stripe Foundation & Member Auth

**Goal**: Set up Stripe SDK, create member registration/login separate from admin, email verification
**Depends on**: Previous milestone complete
**Research**: Likely (Stripe API integration, member auth coexisting with admin auth)
**Research topics**: Stripe SDK setup for Next.js, Stripe webhooks, member vs admin auth patterns in Supabase
**Plans**: TBD

Plans:
- [ ] 14-01: TBD (run /gsd:plan-phase 14 to break down)

#### Phase 15: Member Portal & Profiles

**Goal**: Build member dashboard shell, profile management, payment history UI
**Depends on**: Phase 14
**Research**: Unlikely (internal UI patterns from v1.1 admin panel)
**Plans**: TBD

Plans:
- [ ] 15-01: TBD

#### Phase 16: Membership Management

**Goal**: Membership types/tiers in Supabase, admin CRUD for membership configuration, pricing
**Depends on**: Phase 15
**Research**: Unlikely (established CRUD patterns from v1.1)
**Plans**: TBD

Plans:
- [ ] 16-01: TBD

#### Phase 17: Membership Payments

**Goal**: Stripe checkout for dues, renewal tracking, receipts, membership status updates
**Depends on**: Phase 16
**Research**: Likely (Stripe Checkout API, webhook handling, subscription patterns)
**Research topics**: Stripe Checkout Sessions, payment intents, webhook verification, receipt generation
**Plans**: TBD

Plans:
- [ ] 17-01: TBD

#### Phase 18: Show Entry System

**Goal**: Show class/event management, entry selection UI, pricing configuration
**Depends on**: Phase 17
**Research**: Unlikely (extending existing show data from v1.1)
**Plans**: TBD

Plans:
- [ ] 18-01: TBD

#### Phase 19: Show Entry Payments

**Goal**: Stripe checkout for show entries, confirmation flow, entry tracking in member portal
**Depends on**: Phase 18
**Research**: Likely (Stripe payment integration for entry fees)
**Research topics**: Multi-item Stripe Checkout, line items for entries, payment confirmation flows
**Plans**: TBD

Plans:
- [ ] 19-01: TBD

#### Phase 20: Guest Checkout & Additional Fees

**Goal**: Guest checkout flow for non-members, stall fees, banquet tickets, other event charges
**Depends on**: Phase 19
**Research**: Likely (guest checkout without auth, Stripe payment links or sessions)
**Research topics**: Stripe guest checkout patterns, anonymous payment sessions, fee configuration
**Plans**: TBD

Plans:
- [ ] 20-01: TBD

#### Phase 21: Payment Admin & Polish

**Goal**: Admin payment dashboard, refund processing, reports, UAT across all payment flows
**Depends on**: Phase 20
**Research**: Unlikely (extending established admin patterns from v1.1)
**Plans**: TBD

Plans:
- [ ] 21-01: TBD

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
| 14. Stripe Foundation & Member Auth | v2.0 | 0/? | Not started | - |
| 15. Member Portal & Profiles | v2.0 | 0/? | Not started | - |
| 16. Membership Management | v2.0 | 0/? | Not started | - |
| 17. Membership Payments | v2.0 | 0/? | Not started | - |
| 18. Show Entry System | v2.0 | 0/? | Not started | - |
| 19. Show Entry Payments | v2.0 | 0/? | Not started | - |
| 20. Guest Checkout & Additional Fees | v2.0 | 0/? | Not started | - |
| 21. Payment Admin & Polish | v2.0 | 0/? | Not started | - |
