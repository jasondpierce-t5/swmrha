/**
 * Database types for the shows table.
 * Manually defined to match the schema in supabase/migrations/001_shows.sql.
 * Do NOT use Supabase CLI codegen — these are maintained by hand.
 */

/** A single link associated with a show (e.g., show bill PDF, online entries). */
export interface ShowLink {
  label: string;
  url: string;
  external: boolean;
}

/** A full row from the `shows` table. */
export interface ShowRow {
  id: string;
  name: string;
  subtitle: string | null;
  dates: string;
  location: string;
  venue: string;
  links: ShowLink[];
  notes: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Fields required to insert a new show (id and timestamps are generated). */
export type ShowInsert = Omit<ShowRow, 'id' | 'created_at' | 'updated_at'>;

/** Fields allowed when updating a show (all optional except id). */
export type ShowUpdate = Partial<ShowInsert> & { id: string };

// ---------------------------------------------------------------------------
// Sponsors table
// ---------------------------------------------------------------------------

/** A full row from the `sponsors` table. */
export interface SponsorRow {
  id: string;
  name: string;
  level: string;
  image_url: string | null;
  website_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Fields required to insert a new sponsor. */
export type SponsorInsert = Omit<SponsorRow, 'id' | 'created_at' | 'updated_at'>;

/** Fields allowed when updating a sponsor. */
export type SponsorUpdate = Partial<SponsorInsert> & { id: string };

// ---------------------------------------------------------------------------
// Results table
// ---------------------------------------------------------------------------

/** A full row from the `results` table. */
export interface ResultRow {
  id: string;
  label: string;
  url: string;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Fields required to insert a new result. */
export type ResultInsert = Omit<ResultRow, 'id' | 'created_at' | 'updated_at'>;

/** Fields allowed when updating a result. */
export type ResultUpdate = Partial<ResultInsert> & { id: string };

// ---------------------------------------------------------------------------
// Members table
// ---------------------------------------------------------------------------

/** A full row from the `members` table. */
export interface MemberRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  membership_type: string;
  membership_status: string;
  membership_start: string | null;
  membership_expiry: string | null;
  stripe_customer_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Membership Types table
// ---------------------------------------------------------------------------

/** A full row from the `membership_types` table. */
export interface MembershipTypeRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  duration_months: number | null;
  benefits: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Fields required to insert a new membership type. */
export type MembershipTypeInsert = Omit<
  MembershipTypeRow,
  'id' | 'created_at' | 'updated_at'
> & {
  sort_order?: number;
  is_active?: boolean;
  benefits?: string[];
  price_cents?: number;
};

// ---------------------------------------------------------------------------
// Payments table
// ---------------------------------------------------------------------------

/** A full row from the `payments` table. */
export interface PaymentRow {
  id: string;
  member_id: string;
  amount_cents: number;
  payment_type: string;
  membership_type_slug: string | null;
  description: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
