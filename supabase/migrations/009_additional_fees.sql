-- ============================================================================
-- Migration: 009_additional_fees.sql
-- Description: Create additional_fee_types and fee_purchases tables for
--              configurable fee items (stall fees, banquet tickets, etc.),
--              and alter payments table to support guest (non-member) checkout.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Part A: Create the additional_fee_types table
-- --------------------------------------------------------------------------
-- Configurable fee items that can be purchased by members or guests.
-- Examples: stall rentals, banquet tickets, vendor booth fees.
-- Writes are managed exclusively by server-side code using the Supabase
-- service role key (admin client), which bypasses RLS.
-- --------------------------------------------------------------------------

CREATE TABLE public.additional_fee_types (
  id                      uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name                    text        NOT NULL,
  description             text,
  price_cents             integer     NOT NULL,
  category                text        NOT NULL DEFAULT 'other',
  show_id                 uuid        REFERENCES public.shows(id) ON DELETE SET NULL,
  max_quantity_per_order  integer,
  is_active               boolean     NOT NULL DEFAULT true,
  sort_order              integer     NOT NULL DEFAULT 0,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- Part A.2: Enable RLS on additional_fee_types
-- --------------------------------------------------------------------------

ALTER TABLE public.additional_fee_types ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- Part A.3: RLS Policies for additional_fee_types
-- --------------------------------------------------------------------------
-- SELECT allowed for authenticated and anon (public purchase page needs access).
-- No INSERT/UPDATE/DELETE policies — writes via service role.
-- --------------------------------------------------------------------------

-- Authenticated users can read all fee types
CREATE POLICY "Authenticated users can read fee types"
  ON public.additional_fee_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Anonymous users can read all fee types (public purchase page)
CREATE POLICY "Anonymous users can read fee types"
  ON public.additional_fee_types
  FOR SELECT
  TO anon
  USING (true);

-- --------------------------------------------------------------------------
-- Part A.4: Indexes on additional_fee_types
-- --------------------------------------------------------------------------

CREATE INDEX idx_additional_fee_types_show_id ON public.additional_fee_types (show_id);
CREATE INDEX idx_additional_fee_types_is_active ON public.additional_fee_types (is_active);

-- --------------------------------------------------------------------------
-- Part A.5: Updated_at trigger (reuse function from 001_shows.sql)
-- --------------------------------------------------------------------------

CREATE TRIGGER additional_fee_types_updated_at
  BEFORE UPDATE ON public.additional_fee_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------------------------
-- Part B: Create the fee_purchases table
-- --------------------------------------------------------------------------
-- Tracks individual fee item purchases linked to a payment record.
-- Writes are managed exclusively by the admin client (service role).
-- --------------------------------------------------------------------------

CREATE TABLE public.fee_purchases (
  id                uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id        uuid        REFERENCES public.payments(id) ON DELETE SET NULL,
  fee_type_id       uuid        NOT NULL REFERENCES public.additional_fee_types(id),
  quantity          integer     NOT NULL DEFAULT 1,
  unit_price_cents  integer     NOT NULL,
  total_cents       integer     NOT NULL,
  show_id           uuid        REFERENCES public.shows(id) ON DELETE SET NULL,
  purchaser_name    text        NOT NULL,
  purchaser_email   text        NOT NULL,
  status            text        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- Part B.2: Enable RLS on fee_purchases
-- --------------------------------------------------------------------------

ALTER TABLE public.fee_purchases ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- Part B.3: RLS Policies for fee_purchases
-- --------------------------------------------------------------------------
-- SELECT-only for authenticated users where email matches or admin.
-- No INSERT/UPDATE/DELETE policies — writes via service role.
-- --------------------------------------------------------------------------

-- Admins can read all fee purchases
CREATE POLICY "Admins can read all fee purchases"
  ON public.fee_purchases
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Members can read their own fee purchases (by matching email to their member record)
CREATE POLICY "Members can read own fee purchases"
  ON public.fee_purchases
  FOR SELECT
  TO authenticated
  USING (
    purchaser_email IN (
      SELECT email FROM public.members WHERE id = auth.uid()
    )
  );

-- --------------------------------------------------------------------------
-- Part B.4: Indexes on fee_purchases
-- --------------------------------------------------------------------------

CREATE INDEX idx_fee_purchases_payment_id ON public.fee_purchases (payment_id);
CREATE INDEX idx_fee_purchases_fee_type_id ON public.fee_purchases (fee_type_id);
CREATE INDEX idx_fee_purchases_purchaser_email ON public.fee_purchases (purchaser_email);

-- --------------------------------------------------------------------------
-- Part B.5: Updated_at trigger
-- --------------------------------------------------------------------------

CREATE TRIGGER fee_purchases_updated_at
  BEFORE UPDATE ON public.fee_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------------------------
-- Part C: ALTER payments table for guest support
-- --------------------------------------------------------------------------
-- Make member_id nullable for guest payments, add guest contact fields,
-- and expand the payment_type CHECK constraint to include 'additional_fees'.
-- --------------------------------------------------------------------------

-- C.1: Make member_id nullable (guests have no member account)
ALTER TABLE public.payments ALTER COLUMN member_id DROP NOT NULL;

-- C.2: Add guest contact columns
ALTER TABLE public.payments ADD COLUMN guest_email text;
ALTER TABLE public.payments ADD COLUMN guest_name text;

-- C.3: Drop existing payment_type CHECK constraint and recreate with all 4 types
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_payment_type_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_payment_type_check
  CHECK (payment_type IN ('membership_dues', 'membership_renewal', 'entry_fees', 'additional_fees'));

-- C.4: Index on guest_email for guest payment lookup
CREATE INDEX idx_payments_guest_email ON public.payments (guest_email);

-- Note: Existing RLS policies use `auth.uid() = member_id` which naturally
-- handles null member_id (null != uid, so guests can't see other payments).
-- Guest payment lookup is handled via admin client on success pages.
