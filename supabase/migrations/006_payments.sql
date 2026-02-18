-- ============================================================================
-- Migration: 006_payments.sql
-- Description: Create payments table for tracking membership dues and renewal
--              payments processed via Stripe Checkout, with RLS policies and
--              indexes for performance.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the payments table
-- --------------------------------------------------------------------------
-- Tracks all payment transactions. Writes are managed exclusively by
-- server-side code (checkout action + webhook handler) using the Supabase
-- service role key, which bypasses RLS. Members can only read their own
-- payment records.
-- --------------------------------------------------------------------------

CREATE TABLE public.payments (
  id                          uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id                   uuid        NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  amount_cents                integer     NOT NULL,
  payment_type                text        NOT NULL CHECK (payment_type IN ('membership_dues', 'membership_renewal')),
  membership_type_slug        text,
  description                 text,
  stripe_checkout_session_id  text        UNIQUE,
  stripe_payment_intent_id    text,
  status                      text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- --------------------------------------------------------------------------

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. RLS Policies
-- --------------------------------------------------------------------------
-- Only SELECT policies are created for authenticated users. All writes
-- (INSERT/UPDATE) are performed by the service role key (admin client),
-- which bypasses RLS entirely.
-- --------------------------------------------------------------------------

-- Members can read their own payments
CREATE POLICY payments_select_own ON public.payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = member_id);

-- Admins can read all payments
CREATE POLICY payments_select_admin ON public.payments
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- --------------------------------------------------------------------------
-- 4. Indexes for query performance
-- --------------------------------------------------------------------------

CREATE INDEX idx_payments_member_id ON public.payments (member_id);
CREATE INDEX idx_payments_stripe_checkout_session_id ON public.payments (stripe_checkout_session_id);

-- --------------------------------------------------------------------------
-- 5. Updated_at trigger
-- --------------------------------------------------------------------------
-- Reuses the update_updated_at() function created in 001_shows.sql.
-- --------------------------------------------------------------------------

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
