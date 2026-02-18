'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { MembershipTypeRow, MembershipTypeInsert } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code === '23505') return 'A membership type with this name or slug already exists.';
  if (code.startsWith('PGRST')) return 'Unable to save. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

/** Validate slug format: lowercase alphanumeric and hyphens only. */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Fetch all membership types ordered by sort_order ASC. */
export async function getMembershipTypes(): Promise<MembershipTypeRow[] | { error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('membership_types')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as MembershipTypeRow[]) ?? [];
}

/** Fetch only active membership types ordered by sort_order ASC. For public pages. */
export async function getActiveMembershipTypes(): Promise<MembershipTypeRow[] | { error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('membership_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as MembershipTypeRow[]) ?? [];
}

/** Fetch a single membership type by ID. Returns null when no row matches. */
export async function getMembershipType(
  id: string,
): Promise<MembershipTypeRow | null | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Membership type ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('membership_types')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as MembershipTypeRow) ?? null;
}

// ---------------------------------------------------------------------------
// Write operations (admin-only via RLS)
// ---------------------------------------------------------------------------

/** Insert a new membership type. Validates required fields before sending to Supabase. */
export async function createMembershipType(
  data: MembershipTypeInsert,
): Promise<MembershipTypeRow | { error: string }> {
  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    return { error: 'Membership type name is required.' };
  }
  if (data.name.trim().length > 100) {
    return { error: 'Name must be 100 characters or fewer.' };
  }

  if (!data.slug || data.slug.trim() === '') {
    return { error: 'Slug is required.' };
  }
  if (data.slug.trim().length > 50) {
    return { error: 'Slug must be 50 characters or fewer.' };
  }
  if (!isValidSlug(data.slug.trim())) {
    return { error: 'Slug must be lowercase alphanumeric with hyphens only.' };
  }

  const priceCents = data.price_cents ?? 0;
  if (priceCents < 0) {
    return { error: 'Price must be zero or greater.' };
  }

  if (data.duration_months !== undefined && data.duration_months !== null && data.duration_months <= 0) {
    return { error: 'Duration must be greater than zero, or leave empty for lifetime.' };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('membership_types')
    .insert({
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: data.description ?? null,
      price_cents: priceCents,
      duration_months: data.duration_months ?? null,
      benefits: data.benefits ?? [],
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/membership-types');
  revalidatePath('/membership');

  return row as MembershipTypeRow;
}

/** Update an existing membership type. Only validates provided fields. */
export async function updateMembershipType(
  id: string,
  data: Partial<MembershipTypeInsert>,
): Promise<MembershipTypeRow | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Membership type ID is required.' };
  }

  // Validate provided fields
  if (data.name !== undefined) {
    if (data.name.trim() === '') {
      return { error: 'Membership type name is required.' };
    }
    if (data.name.trim().length > 100) {
      return { error: 'Name must be 100 characters or fewer.' };
    }
  }

  if (data.slug !== undefined) {
    if (data.slug.trim() === '') {
      return { error: 'Slug is required.' };
    }
    if (data.slug.trim().length > 50) {
      return { error: 'Slug must be 50 characters or fewer.' };
    }
    if (!isValidSlug(data.slug.trim())) {
      return { error: 'Slug must be lowercase alphanumeric with hyphens only.' };
    }
  }

  if (data.price_cents !== undefined && data.price_cents < 0) {
    return { error: 'Price must be zero or greater.' };
  }

  if (data.duration_months !== undefined && data.duration_months !== null && data.duration_months <= 0) {
    return { error: 'Duration must be greater than zero, or leave empty for lifetime.' };
  }

  // Build update payload containing only provided fields
  const updates: Record<string, unknown> = {};

  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.slug !== undefined) updates.slug = data.slug.trim();
  if (data.description !== undefined) updates.description = data.description;
  if (data.price_cents !== undefined) updates.price_cents = data.price_cents;
  if (data.duration_months !== undefined) updates.duration_months = data.duration_months;
  if (data.benefits !== undefined) updates.benefits = data.benefits;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;
  if (data.is_active !== undefined) updates.is_active = data.is_active;

  if (Object.keys(updates).length === 0) {
    return { error: 'No fields provided to update.' };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('membership_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/membership-types');
  revalidatePath('/membership');

  return row as MembershipTypeRow;
}

/** Delete a membership type by ID. */
export async function deleteMembershipType(
  id: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Membership type ID is required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('membership_types')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/membership-types');
  revalidatePath('/membership');

  return { success: true };
}
