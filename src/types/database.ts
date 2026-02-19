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
  member_id: string | null;
  amount_cents: number;
  /** 'membership_dues' | 'membership_renewal' | 'entry_fees' | 'additional_fees' */
  payment_type: string;
  membership_type_slug: string | null;
  description: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: string;
  guest_email: string | null;
  guest_name: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Show Classes table
// ---------------------------------------------------------------------------

/** A full row from the `show_classes` table. */
export interface ShowClassRow {
  id: string;
  show_id: string;
  name: string;
  fee_cents: number;
  level: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Fields required to insert a new show class (id and timestamps are generated). */
export type ShowClassInsert = Omit<ShowClassRow, 'id' | 'created_at' | 'updated_at'> & {
  sort_order?: number;
  is_active?: boolean;
};

// ---------------------------------------------------------------------------
// Show Entries table
// ---------------------------------------------------------------------------

/** A full row from the `show_entries` table. */
export interface ShowEntryRow {
  id: string;
  show_id: string;
  member_id: string;
  horse_name: string;
  rider_name: string;
  status: string;
  total_cents: number;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Show Entry Classes junction table
// ---------------------------------------------------------------------------

/** A full row from the `show_entry_classes` junction table. */
export interface ShowEntryClassRow {
  id: string;
  entry_id: string;
  class_id: string;
  fee_cents: number;
  created_at: string;
}

/** Composite type for an entry with its selected classes. */
export interface ShowEntryWithClasses extends ShowEntryRow {
  classes: ShowEntryClassRow[];
}

/** Input type for creating entries (one horse/rider combo with class selections). */
export interface CreateShowEntryInput {
  show_id: string;
  horse_name: string;
  rider_name: string;
  class_ids: string[];
}

// ---------------------------------------------------------------------------
// Additional Fee Types table
// ---------------------------------------------------------------------------

/** A full row from the `additional_fee_types` table. */
export interface FeeItemRow {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: string;
  show_id: string | null;
  max_quantity_per_order: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Fields required to insert a new fee item (id and timestamps are generated). */
export type FeeItemInsert = Omit<FeeItemRow, 'id' | 'created_at' | 'updated_at'>;

// ---------------------------------------------------------------------------
// Fee Purchases table
// ---------------------------------------------------------------------------

/** A full row from the `fee_purchases` table. */
export interface FeePurchaseRow {
  id: string;
  payment_id: string | null;
  fee_type_id: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  show_id: string | null;
  purchaser_name: string;
  purchaser_email: string;
  status: string;
  created_at: string;
  updated_at: string;
}
