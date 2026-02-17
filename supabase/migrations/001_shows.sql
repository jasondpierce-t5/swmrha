-- ============================================================================
-- Migration: 001_shows.sql
-- Description: Create shows table with RLS policies, updated_at trigger,
--              and seed data from existing static show schedule.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the shows table
-- --------------------------------------------------------------------------
CREATE TABLE shows (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  subtitle   text,
  dates      text        NOT NULL,
  location   text        NOT NULL,
  venue      text        NOT NULL,
  links      jsonb       NOT NULL DEFAULT '[]'::jsonb,
  notes      jsonb       NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer     NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- --------------------------------------------------------------------------
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. RLS Policies
-- --------------------------------------------------------------------------

-- Public read access (anon + authenticated)
CREATE POLICY shows_select_policy ON shows
  FOR SELECT
  USING (true);

-- Admin-only insert
CREATE POLICY shows_insert_policy ON shows
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admin-only update
CREATE POLICY shows_update_policy ON shows
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admin-only delete
CREATE POLICY shows_delete_policy ON shows
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- --------------------------------------------------------------------------
-- 4. updated_at trigger function
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shows_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------------------------
-- 5. Seed data: existing shows from src/data/shows.ts
-- --------------------------------------------------------------------------

-- Show 1: The Route 66 Slide
INSERT INTO shows (name, subtitle, dates, location, venue, links, notes, sort_order)
VALUES (
  'The Route 66 Slide',
  'Derby & Rookie Scooter Shootout',
  'April 4-6, 2025',
  'Carthage, MO',
  'Lucky J Arena and Steakhouse',
  '[
    {"label": "Show Bill", "url": "https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_e6c453135fff43afac82bd2e806bcfe7.pdf", "external": true},
    {"label": "Stall and RV Reservation Maps", "url": "/shows/reserve", "external": false},
    {"label": "Paid Warm Up Reservation", "url": "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-54952261-2025", "external": true},
    {"label": "Online Entries", "url": "https://www.whitehorseshowmgt.com/showcalendar", "external": true},
    {"label": "Results", "url": "https://www.whitehorseshowmgt.com/post/smrha-route-66-slide-4-4-4-6", "external": true},
    {"label": "Photos & Video", "url": "https://www.tdphoto.org/", "external": true}
  ]'::jsonb,
  '[]'::jsonb,
  0
);

-- Show 2: The Patriot Slide
INSERT INTO shows (name, subtitle, dates, location, venue, links, notes, sort_order)
VALUES (
  'The Patriot Slide',
  'Pre Futurity & Freestyle',
  'July 19-20, 2025',
  'Carthage, MO',
  'Lucky J Arena and Steakhouse',
  '[
    {"label": "Show Bill", "url": "https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_d351c9264b6d4c6fa825d2342d71434a.pdf", "external": true},
    {"label": "Stall and RV Reservation Maps", "url": "/shows/reserve", "external": false},
    {"label": "Paid Warm Up Reservation", "url": "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-57185231-2025", "external": true},
    {"label": "Online Entries", "url": "/shows/reserve", "external": false},
    {"label": "Draws and Results", "url": "/results", "external": false},
    {"label": "Photos & Video", "url": "/results", "external": false},
    {"label": "Live Web Feed", "url": "https://www.tdphoto.org/events/2024_events/patriot_slide_pre-futurity__freestyle_july_2021_2024/", "external": true}
  ]'::jsonb,
  '["$10 discount on each Stall, if paying with CC online by July 13th, 2025"]'::jsonb,
  1
);
