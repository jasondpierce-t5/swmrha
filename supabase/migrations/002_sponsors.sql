-- ============================================================================
-- Migration: 002_sponsors.sql
-- Description: Create sponsors table with RLS policies, Supabase Storage
--              bucket for logo uploads, updated_at trigger, and seed data
--              from existing static sponsor data.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the sponsors table
-- --------------------------------------------------------------------------
CREATE TABLE sponsors (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  level       text        NOT NULL,
  image_url   text,
  website_url text,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- --------------------------------------------------------------------------
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. RLS Policies
-- --------------------------------------------------------------------------

-- Public read access (anon + authenticated)
CREATE POLICY sponsors_select_policy ON sponsors
  FOR SELECT
  USING (true);

-- Admin-only insert
CREATE POLICY sponsors_insert_policy ON sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admin-only update
CREATE POLICY sponsors_update_policy ON sponsors
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admin-only delete
CREATE POLICY sponsors_delete_policy ON sponsors
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

CREATE TRIGGER sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------------------------
-- 5. Supabase Storage bucket for sponsor logos
-- --------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsor-logos', 'sponsor-logos', true);

-- --------------------------------------------------------------------------
-- 6. Storage RLS policies
-- --------------------------------------------------------------------------

-- Public read access for sponsor logos
CREATE POLICY sponsor_logos_select_policy ON storage.objects
  FOR SELECT
  USING (bucket_id = 'sponsor-logos');

-- Admin-only upload
CREATE POLICY sponsor_logos_insert_policy ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'sponsor-logos'
    AND (auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Admin-only update
CREATE POLICY sponsor_logos_update_policy ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'sponsor-logos'
    AND (auth.jwt()->'app_metadata'->>'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'sponsor-logos'
    AND (auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Admin-only delete
CREATE POLICY sponsor_logos_delete_policy ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'sponsor-logos'
    AND (auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- --------------------------------------------------------------------------
-- 7. Seed data: existing sponsors from src/data/sponsors.ts
--    Sort order by tier: Platinum=0, Diamond=10, Gold=20, Silver=30, Bronze=40
--    Within each tier, ordered alphabetically by name.
-- --------------------------------------------------------------------------

-- Platinum sponsors (sort_order 0-9)
INSERT INTO sponsors (name, level, image_url, website_url, sort_order) VALUES
  ('Cowtown USA', 'Platinum', '/images/sponsors/cowtown-usa.jpg', 'https://cowtownusainc.com/', 0),
  ('Its All About Ruf', 'Platinum', '/images/sponsors/its-all-about-ruf.jpg', 'https://tmreining.com/stallions/its-all-about-ruf/', 1),
  ('Merhow Trailers', 'Platinum', '/images/sponsors/merhow-trailers.jpg', 'https://merhow.com/', 2);

-- Diamond sponsors (sort_order 10-19)
INSERT INTO sponsors (name, level, image_url, website_url, sort_order) VALUES
  ('Equine Oasis', 'Diamond', '/images/sponsors/equine-oasis.jpg', 'http://equineoasis.com/', 10);

-- Gold sponsors (sort_order 20-29)
INSERT INTO sponsors (name, level, image_url, website_url, sort_order) VALUES
  ('RDS Financing', 'Gold', '/images/sponsors/rds-financing.jpg', 'https://www.rdsfinancing.com/about.aspx', 20),
  ('Stateline Tack', 'Gold', '/images/sponsors/stateline-tack.jpg', 'https://www.statelinetack.com/', 21);

-- Silver sponsors (sort_order 30-39)
INSERT INTO sponsors (name, level, image_url, website_url, sort_order) VALUES
  ('Aussie Flair Performance Horses', 'Silver', '/images/sponsors/aussie-flair.jpg', 'https://www.facebook.com/joeandelizabethhartin', 30),
  ('Lipps Horse Training', 'Silver', '/images/sponsors/lipps.jpg', 'http://www.lippshorsetraining.com/', 31),
  ('Reining Horse Unlimited', 'Silver', '/images/sponsors/reining-horse-unlimited.jpg', 'https://www.facebook.com/Reininghorsesunlimited/', 32),
  ('Shaffhauser Stables', 'Silver', '/images/sponsors/shaffhauser-stables.jpg', 'https://www.facebook.com/randy.schaffhauser', 33);

-- Bronze sponsors (sort_order 40-49)
INSERT INTO sponsors (name, level, image_url, website_url, sort_order) VALUES
  ('Circle X', 'Bronze', '/images/sponsors/circle-x.jpg', NULL, 40),
  ('Rocking H LLC', 'Bronze', '/images/sponsors/rocking-h.jpg', 'https://www.facebook.com/RockingHLLC', 41);
