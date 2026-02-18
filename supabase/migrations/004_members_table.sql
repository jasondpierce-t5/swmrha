-- ============================================================================
-- Migration: 004_members_table.sql
-- Description: Create members table linked to auth.users, with RLS policies,
--              auto-create trigger for new member signups, and updated_at trigger.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create the members table
-- --------------------------------------------------------------------------
-- Each member row is linked 1:1 with an auth.users row via the id (uuid).
-- The stripe_customer_id will be populated by Phase 17 (Membership Payments).
-- Default state is 'MO' since this is the Southwest Missouri Reining Horse Association.
-- --------------------------------------------------------------------------

CREATE TABLE public.members (
  id                uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email             text        NOT NULL,
  first_name        text        NOT NULL,
  last_name         text        NOT NULL,
  phone             text,
  address_line1     text,
  address_line2     text,
  city              text,
  state             text        DEFAULT 'MO',
  zip               text,
  membership_type   text        DEFAULT 'individual',
  membership_status text        DEFAULT 'pending',
  membership_start  date,
  membership_expiry date,
  stripe_customer_id text,
  avatar_url        text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- membership_status values: 'pending' (after signup), 'active' (paid), 'expired', 'suspended'
-- membership_type values: 'individual', 'family', 'youth', 'lifetime'

-- --------------------------------------------------------------------------
-- 2. Enable Row Level Security
-- --------------------------------------------------------------------------

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 3. RLS Policies
-- --------------------------------------------------------------------------

-- Members can read their own profile
CREATE POLICY members_select_own ON public.members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Members can update their own profile
CREATE POLICY members_update_own ON public.members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all member profiles
CREATE POLICY members_select_admin ON public.members
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admins can update any member profile
CREATE POLICY members_update_admin ON public.members
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Admins can delete any member profile
CREATE POLICY members_delete_admin ON public.members
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- No INSERT policy needed for regular users — the trigger function uses
-- SECURITY DEFINER which bypasses RLS to create member rows on signup.

-- --------------------------------------------------------------------------
-- 4. Trigger function: auto-create member profile on signup
-- --------------------------------------------------------------------------
-- This BEFORE INSERT trigger on auth.users:
-- - Sets role='member' in app_metadata for non-admin signups
-- - Creates a corresponding row in public.members
-- - Extracts first_name/last_name from user_metadata (set during signUp)
-- - Skips member creation for admin accounts (they already have role='admin')
-- --------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Only create member row for non-admin signups
  IF (NEW.raw_app_meta_data->>'role') IS NULL OR (NEW.raw_app_meta_data->>'role') != 'admin' THEN
    -- Set role to 'member' in app_metadata
    NEW.raw_app_meta_data := coalesce(NEW.raw_app_meta_data, '{}'::jsonb)
      || '{"role": "member"}'::jsonb;

    -- Create member profile from user_metadata
    INSERT INTO public.members (id, email, first_name, last_name)
    VALUES (
      NEW.id,
      NEW.email,
      coalesce(NEW.raw_user_meta_data->>'first_name', ''),
      coalesce(NEW.raw_user_meta_data->>'last_name', '')
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_member();

-- --------------------------------------------------------------------------
-- 5. Updated_at trigger
-- --------------------------------------------------------------------------
-- Reuses the update_updated_at() function created in 001_shows.sql.
-- Using CREATE OR REPLACE to be safe if running standalone.
-- --------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
