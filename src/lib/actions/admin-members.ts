'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { MemberRow } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Fields an admin can update on any member profile. */
export interface AdminMemberUpdate {
  first_name: string;
  last_name: string;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  membership_type: string;
  membership_status: string;
  membership_start?: string | null;
  membership_expiry?: string | null;
  stripe_customer_id?: string | null;
  avatar_url?: string | null;
}

const VALID_MEMBERSHIP_STATUSES = ['pending', 'active', 'expired', 'suspended'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code === '23505') return 'This record already exists.';
  if (code.startsWith('PGRST')) return 'Unable to save. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

// ---------------------------------------------------------------------------
// Read operations (admin-only via RLS)
// ---------------------------------------------------------------------------

/** Fetch all members ordered by last_name ASC, first_name ASC. */
export async function getMembers(): Promise<MemberRow[] | { error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as MemberRow[]) ?? [];
}

/** Fetch a single member by ID. Returns null when no row matches. */
export async function getMemberById(
  id: string,
): Promise<MemberRow | null | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Member ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as MemberRow) ?? null;
}

// ---------------------------------------------------------------------------
// Write operations (admin-only via RLS)
// ---------------------------------------------------------------------------

/** Update a member's profile with admin privileges (can change system fields). */
export async function updateMemberAdmin(
  id: string,
  data: AdminMemberUpdate,
): Promise<MemberRow | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Member ID is required.' };
  }

  // Validate required fields
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

  // Validate membership fields
  if (!data.membership_type || data.membership_type.trim() === '') {
    return { error: 'Membership type is required.' };
  }
  if (!data.membership_status || !VALID_MEMBERSHIP_STATUSES.includes(data.membership_status)) {
    return { error: `Membership status must be one of: ${VALID_MEMBERSHIP_STATUSES.join(', ')}.` };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('members')
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: data.phone ?? null,
      address_line1: data.address_line1 ?? null,
      address_line2: data.address_line2 ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      zip: data.zip ?? null,
      membership_type: data.membership_type.trim(),
      membership_status: data.membership_status,
      membership_start: data.membership_start ?? null,
      membership_expiry: data.membership_expiry ?? null,
      stripe_customer_id: data.stripe_customer_id ?? null,
      avatar_url: data.avatar_url ?? null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/members');
  revalidatePath('/member');
  revalidatePath('/member/profile');

  return row as MemberRow;
}

/** Delete a member by ID. */
export async function deleteMember(
  id: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Member ID is required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('members').delete().eq('id', id);

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/members');

  return { success: true };
}
