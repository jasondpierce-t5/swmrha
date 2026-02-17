-- ============================================================================
-- Migration: 003_results.sql
-- Description: Create results table with RLS policies, updated_at trigger,
--              and seed data from existing static results links.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the results table
-- --------------------------------------------------------------------------
CREATE TABLE results (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  label      text        NOT NULL,
  url        text        NOT NULL,
  category   text        NOT NULL,
  sort_order integer     NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- --------------------------------------------------------------------------
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. RLS Policies
-- --------------------------------------------------------------------------

-- Public read access (anon + authenticated)
CREATE POLICY results_select_policy ON results
  FOR SELECT
  USING (true);

-- Admin-only insert
CREATE POLICY results_insert_policy ON results
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admin-only update
CREATE POLICY results_update_policy ON results
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admin-only delete
CREATE POLICY results_delete_policy ON results
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- --------------------------------------------------------------------------
-- 4. updated_at trigger (reuse function from 001_shows.sql)
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER results_updated_at
  BEFORE UPDATE ON results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------------------------
-- 5. Seed data: existing results from src/data/shows.ts resultsLinks array
-- --------------------------------------------------------------------------

-- Current year results (category: 'current_year', sort_order 0-9)
INSERT INTO results (label, url, category, sort_order) VALUES
  ('2025 Rt 66 Slide Results', 'https://www.whitehorseshowmgt.com/post/smrha-route-66-slide-4-4-4-6', 'current_year', 0);

-- Past results (category: 'past_results', sort_order 10-19)
INSERT INTO results (label, url, category, sort_order) VALUES
  ('2024 Year End Champions', 'https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_dbad005d02bf4896a5341a3fccf75ddf.xlsx?dn=2023-YEAR-END.xlsx', 'past_results', 10),
  ('2024 Show Results', 'https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_95ee650547674add91f6eda6358fe319.pdf', 'past_results', 11),
  ('RESULTS 2024 Patriot Slide Show', 'https://www.whitehorseshowmgt.com/post/smrha-patriot-slide-7-20-7-21', 'past_results', 12),
  ('Photos from 2023 Patriot Slide Show', 'https://tdphoto.org/events/2024_events/patriot_slide_pre-futurity__freestyle_july_2021_2024/#splash', 'past_results', 13);

-- Standings (category: 'standings', sort_order 20+)
INSERT INTO results (label, url, category, sort_order) VALUES
  ('Current GAG Standings', 'https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_b7c68a7860fe47aaab076b87939301bc.pdf', 'standings', 20);
