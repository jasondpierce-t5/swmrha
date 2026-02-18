-- ============================================================================
-- Migration: 005_membership_types.sql
-- Description: Create membership_types table for configurable membership tiers
--              with pricing, RLS policies, updated_at trigger, and seed data.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the membership_types table
-- --------------------------------------------------------------------------
-- Stores configurable membership tiers with pricing for Stripe checkout.
-- The slug column matches by convention with members.membership_type (text).
-- No FK constraint — kept loosely coupled intentionally.
-- --------------------------------------------------------------------------

CREATE TABLE public.membership_types (
  id               uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text        NOT NULL UNIQUE,
  slug             text        NOT NULL UNIQUE,
  description      text,
  price_cents      integer     NOT NULL DEFAULT 0,
  duration_months  integer,
  benefits         jsonb       DEFAULT '[]'::jsonb,
  sort_order       integer     NOT NULL DEFAULT 0,
  is_active        boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- --------------------------------------------------------------------------

ALTER TABLE public.membership_types ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. RLS Policies
-- --------------------------------------------------------------------------

-- Anyone can read active membership types (public pricing page needs this)
CREATE POLICY membership_types_select_active ON public.membership_types
  FOR SELECT
  USING (is_active = true);

-- Admins can manage all membership types (CRUD)
CREATE POLICY membership_types_admin_all ON public.membership_types
  FOR ALL
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- --------------------------------------------------------------------------
-- 4. Updated_at trigger
-- --------------------------------------------------------------------------
-- Reuses the update_updated_at() function created in 001_shows.sql.
-- --------------------------------------------------------------------------

CREATE TRIGGER membership_types_updated_at
  BEFORE UPDATE ON public.membership_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- --------------------------------------------------------------------------
-- 5. Seed data — default membership types matching current hardcoded values
-- --------------------------------------------------------------------------

INSERT INTO public.membership_types (name, slug, description, price_cents, duration_months, sort_order) VALUES
  ('Individual', 'individual', 'Standard individual membership for one person', 5000, 12, 1),
  ('Family', 'family', 'Family membership covering an entire household', 7500, 12, 2),
  ('Youth', 'youth', 'Youth membership for members under 18', 2500, 12, 3),
  ('Lifetime', 'lifetime', 'One-time lifetime membership', 50000, NULL, 4);
