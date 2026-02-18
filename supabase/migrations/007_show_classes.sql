-- ============================================================================
-- Migration: 007_show_classes.sql
-- Description: Create show_classes table with RLS policies, indexes, unique
--              constraint, updated_at trigger, and seed data for all shows.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the show_classes table
-- --------------------------------------------------------------------------
CREATE TABLE public.show_classes (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id    uuid        NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  fee_cents  integer     NOT NULL DEFAULT 0,
  level      text,
  sort_order integer     NOT NULL DEFAULT 0,
  is_active  boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- --------------------------------------------------------------------------
ALTER TABLE public.show_classes ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. RLS Policies
-- --------------------------------------------------------------------------

-- Anyone can read active show classes (anon + authenticated)
CREATE POLICY "Anyone can read active show classes"
  ON public.show_classes
  FOR SELECT
  USING (is_active = true);

-- Admins can manage show classes (full CRUD)
CREATE POLICY "Admins can manage show classes"
  ON public.show_classes
  FOR ALL
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- --------------------------------------------------------------------------
-- 4. updated_at trigger (reuse existing function from 001_shows.sql)
-- --------------------------------------------------------------------------
CREATE TRIGGER show_classes_updated_at
  BEFORE UPDATE ON public.show_classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------------------------
-- 5. Indexes
-- --------------------------------------------------------------------------

-- Index on show_id for filtered queries
CREATE INDEX idx_show_classes_show_id ON public.show_classes (show_id);

-- Unique constraint: no duplicate class names per show
ALTER TABLE public.show_classes
  ADD CONSTRAINT uq_show_classes_show_id_name UNIQUE (show_id, name);

-- --------------------------------------------------------------------------
-- 6. Seed data: insert classes for ALL existing shows
-- --------------------------------------------------------------------------
INSERT INTO public.show_classes (show_id, name, fee_cents, level, sort_order)
SELECT s.id, v.name, v.fee_cents, v.level, v.sort_order
FROM public.shows s
CROSS JOIN (VALUES
  ('Open Derby',                  15000, 'Open',    1),
  ('Non Pro Derby',               12500, 'Non Pro', 2),
  ('Rookie Professional Level 1', 10000, 'Rookie',  3),
  ('Rookie Professional Level 2', 10000, 'Rookie',  4),
  ('Intermediate Open',            7500, 'Open',    5),
  ('Intermediate Non Pro',         7500, 'Non Pro', 6),
  ('Prime Time Plus Open',         7500, 'Open',    7),
  ('Prime Time Plus Non Pro',      7500, 'Non Pro', 8),
  ('Youth Reining',                5000, 'Youth',   9)
) AS v(name, fee_cents, level, sort_order);
