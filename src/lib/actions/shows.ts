'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ShowRow, ShowInsert, ShowUpdate } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code === '23505') return 'A show with this name already exists.';
  if (code.startsWith('PGRST')) return 'Unable to save. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Fetch all shows ordered by sort_order ASC, then created_at DESC. */
export async function getShows(): Promise<ShowRow[] | { error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as ShowRow[]) ?? [];
}

/** Fetch a single show by ID. Returns null when no row matches. */
export async function getShow(
  id: string,
): Promise<ShowRow | null | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as ShowRow) ?? null;
}

// ---------------------------------------------------------------------------
// Write operations (admin-only via RLS)
// ---------------------------------------------------------------------------

/** Insert a new show. Validates required fields before sending to Supabase. */
export async function createShow(
  data: ShowInsert,
): Promise<ShowRow | { error: string }> {
  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    return { error: 'Show name is required.' };
  }
  if (!data.dates || data.dates.trim() === '') {
    return { error: 'Show dates are required.' };
  }
  if (!data.location || data.location.trim() === '') {
    return { error: 'Show location is required.' };
  }
  if (!data.venue || data.venue.trim() === '') {
    return { error: 'Show venue is required.' };
  }

  // String length validation
  if (data.name.trim().length > 200) {
    return { error: 'Show name must be 200 characters or fewer.' };
  }
  if (data.location.trim().length > 200) {
    return { error: 'Location must be 200 characters or fewer.' };
  }
  if (data.venue.trim().length > 200) {
    return { error: 'Venue must be 200 characters or fewer.' };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('shows')
    .insert({
      name: data.name.trim(),
      subtitle: data.subtitle ?? null,
      dates: data.dates.trim(),
      location: data.location.trim(),
      venue: data.venue.trim(),
      links: data.links ?? [],
      notes: data.notes ?? [],
      sort_order: data.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/shows');
  revalidatePath('/shows');

  return row as ShowRow;
}

/** Update an existing show. Only sends provided fields to Supabase. */
export async function updateShow(
  data: ShowUpdate,
): Promise<ShowRow | { error: string }> {
  if (!data.id || data.id.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  // String length validation (only check fields that were provided)
  if (data.name !== undefined && data.name.trim().length > 200) {
    return { error: 'Show name must be 200 characters or fewer.' };
  }
  if (data.location !== undefined && data.location.trim().length > 200) {
    return { error: 'Location must be 200 characters or fewer.' };
  }
  if (data.venue !== undefined && data.venue.trim().length > 200) {
    return { error: 'Venue must be 200 characters or fewer.' };
  }

  // Build an update payload containing only the fields that were provided.
  const updates: Record<string, unknown> = {};

  if (data.name !== undefined) updates.name = data.name;
  if (data.subtitle !== undefined) updates.subtitle = data.subtitle;
  if (data.dates !== undefined) updates.dates = data.dates;
  if (data.location !== undefined) updates.location = data.location;
  if (data.venue !== undefined) updates.venue = data.venue;
  if (data.links !== undefined) updates.links = data.links;
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;

  if (Object.keys(updates).length === 0) {
    return { error: 'No fields provided to update.' };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('shows')
    .update(updates)
    .eq('id', data.id)
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/shows');
  revalidatePath('/shows');

  return row as ShowRow;
}

/** Delete a show by ID. */
export async function deleteShow(
  id: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('shows').delete().eq('id', id);

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidatePath('/admin/shows');
  revalidatePath('/shows');

  return { success: true };
}
