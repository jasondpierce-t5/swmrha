-- ============================================================================
-- Migration: 008_show_entries.sql
-- Description: Create show_entries and show_entry_classes tables for tracking
--              member horse/rider entries and class selections per show, with
--              RLS policies, indexes, unique constraints, and updated_at trigger.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the show_entries table
-- --------------------------------------------------------------------------
-- Tracks each horse/rider entry submitted by a member for a show.
-- Writes are managed exclusively by server-side code using the Supabase
-- service role key (admin client), which bypasses RLS. Members can only
-- read their own entry records; admins can read all.
-- --------------------------------------------------------------------------

CREATE TABLE public.show_entries (
  id           uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  show_id      uuid        NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  member_id    uuid        NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  horse_name   text        NOT NULL,
  rider_name   text        NOT NULL,
  status       text        NOT NULL DEFAULT 'draft'
                           CHECK (status IN ('draft', 'pending_payment', 'confirmed', 'cancelled')),
  total_cents  integer     NOT NULL DEFAULT 0,
  payment_id   uuid        REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. Create the show_entry_classes junction table
-- --------------------------------------------------------------------------
-- Maps each entry to the classes it has selected. fee_cents is a snapshot
-- of the class fee at entry time (in case admin changes price later).
-- --------------------------------------------------------------------------

CREATE TABLE public.show_entry_classes (
  id         uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id   uuid        NOT NULL REFERENCES public.show_entries(id) ON DELETE CASCADE,
  class_id   uuid        NOT NULL REFERENCES public.show_classes(id) ON DELETE CASCADE,
  fee_cents  integer     NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entry_id, class_id)
);

-- --------------------------------------------------------------------------
-- 3. Enable Row Level Security
-- --------------------------------------------------------------------------

ALTER TABLE public.show_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.show_entry_classes ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 4. RLS Policies for show_entries
-- --------------------------------------------------------------------------
-- Only SELECT policies are created for authenticated users. All writes
-- (INSERT/UPDATE/DELETE) are performed by the service role key (admin client),
-- which bypasses RLS entirely.
-- --------------------------------------------------------------------------

-- Members can read their own entries
CREATE POLICY "Members can read own entries"
  ON public.show_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = member_id);

-- Admins can read all entries
CREATE POLICY "Admins can read all entries"
  ON public.show_entries
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- --------------------------------------------------------------------------
-- 5. RLS Policies for show_entry_classes
-- --------------------------------------------------------------------------

-- Members can read own entry classes
CREATE POLICY "Members can read own entry classes"
  ON public.show_entry_classes
  FOR SELECT
  TO authenticated
  USING (entry_id IN (SELECT id FROM public.show_entries WHERE member_id = auth.uid()));

-- Admins can read all entry classes
CREATE POLICY "Admins can read all entry classes"
  ON public.show_entry_classes
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- --------------------------------------------------------------------------
-- 6. Indexes
-- --------------------------------------------------------------------------

CREATE INDEX idx_show_entries_show_id ON public.show_entries (show_id);
CREATE INDEX idx_show_entries_member_id ON public.show_entries (member_id);
CREATE INDEX idx_show_entries_payment_id ON public.show_entries (payment_id);
CREATE INDEX idx_show_entry_classes_entry_id ON public.show_entry_classes (entry_id);

-- --------------------------------------------------------------------------
-- 7. Updated_at trigger on show_entries (reuse existing function from 001_shows.sql)
-- --------------------------------------------------------------------------

CREATE TRIGGER show_entries_updated_at
  BEFORE UPDATE ON public.show_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
