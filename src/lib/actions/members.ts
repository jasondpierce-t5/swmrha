'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { MemberRow } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code.startsWith('PGRST')) return 'Unable to load profile. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Fetch the authenticated member's profile. */
export async function getMemberProfile(): Promise<MemberRow | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return data as MemberRow;
}

// ---------------------------------------------------------------------------
// Write operations (member can update own profile via RLS)
// ---------------------------------------------------------------------------

/** Fields a member is allowed to update on their own profile. */
export interface MemberProfileUpdate {
  first_name: string;
  last_name: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip?: string;
}

/** Update the authenticated member's profile. */
export async function updateMemberProfile(
  data: MemberProfileUpdate,
): Promise<MemberRow | { error: string }> {
  // --- Validate required fields ---
  const firstName = data.first_name?.trim() ?? '';
  const lastName = data.last_name?.trim() ?? '';

  if (!firstName) {
    return { error: 'First name is required.' };
  }
  if (!lastName) {
    return { error: 'Last name is required.' };
  }
  if (firstName.length > 100) {
    return { error: 'First name must be 100 characters or fewer.' };
  }
  if (lastName.length > 100) {
    return { error: 'Last name must be 100 characters or fewer.' };
  }

  // --- Validate optional fields ---
  const phone = data.phone?.trim() || null;
  const addressLine1 = data.address_line1?.trim() || null;
  const addressLine2 = data.address_line2?.trim() || null;
  const city = data.city?.trim() || null;
  const state = data.state?.trim() || null;
  const zip = data.zip?.trim() || null;

  if (phone && phone.length > 20) {
    return { error: 'Phone number must be 20 characters or fewer.' };
  }
  if (city && city.length > 100) {
    return { error: 'City must be 100 characters or fewer.' };
  }
  if (state && state.length > 2) {
    return { error: 'State must be 2 characters or fewer.' };
  }
  if (zip && zip.length > 10) {
    return { error: 'ZIP code must be 10 characters or fewer.' };
  }

  // --- Authenticate ---
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // --- Update ---
  const { data: row, error } = await supabase
    .from('members')
    .update({
      first_name: firstName,
      last_name: lastName,
      phone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      zip,
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/member');
  revalidatePath('/member/profile');

  return row as MemberRow;
}
