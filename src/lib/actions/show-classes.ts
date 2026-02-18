'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ShowClassRow, ShowClassInsert } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code === '23505') return 'A class with this name already exists for this show.';
  if (code.startsWith('PGRST')) return 'Unable to save. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

/** Paths to revalidate after show class mutations. */
const REVALIDATE_PATHS = ['/admin/shows', '/shows', '/member/enter-show'];

function revalidateShowClassPaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Fetch all classes for a show ordered by sort_order ASC. Includes inactive classes (admin view). */
export async function getShowClasses(
  showId: string,
): Promise<ShowClassRow[] | { error: string }> {
  if (!showId || showId.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('show_classes')
    .select('*')
    .eq('show_id', showId)
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as ShowClassRow[]) ?? [];
}

/** Fetch active classes only for a show, ordered by sort_order ASC. For public/member-facing pages. */
export async function getActiveShowClasses(
  showId: string,
): Promise<ShowClassRow[] | { error: string }> {
  if (!showId || showId.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('show_classes')
    .select('*')
    .eq('show_id', showId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as ShowClassRow[]) ?? [];
}

/** Fetch a single show class by ID. Returns null when no row matches. */
export async function getShowClass(
  id: string,
): Promise<ShowClassRow | null | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Show class ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('show_classes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as ShowClassRow) ?? null;
}

// ---------------------------------------------------------------------------
// Write operations (admin-only via admin client)
// ---------------------------------------------------------------------------

/** Insert a new show class. Validates required fields before sending to Supabase. */
export async function createShowClass(
  data: ShowClassInsert,
): Promise<ShowClassRow | { error: string }> {
  // Validate required fields
  if (!data.show_id || data.show_id.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  if (!data.name || data.name.trim() === '') {
    return { error: 'Class name is required.' };
  }
  if (data.name.trim().length > 200) {
    return { error: 'Class name must be 200 characters or fewer.' };
  }

  if (data.fee_cents < 0) {
    return { error: 'Fee must be zero or greater.' };
  }

  const adminClient = createAdminClient();

  const { data: row, error } = await adminClient
    .from('show_classes')
    .insert({
      show_id: data.show_id.trim(),
      name: data.name.trim(),
      fee_cents: data.fee_cents,
      level: data.level ?? null,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidateShowClassPaths();

  return row as ShowClassRow;
}

/** Update an existing show class. Only validates and sends provided fields. */
export async function updateShowClass(
  id: string,
  data: Partial<ShowClassInsert>,
): Promise<ShowClassRow | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Show class ID is required.' };
  }

  // Validate provided fields
  if (data.name !== undefined) {
    if (data.name.trim() === '') {
      return { error: 'Class name is required.' };
    }
    if (data.name.trim().length > 200) {
      return { error: 'Class name must be 200 characters or fewer.' };
    }
  }

  if (data.fee_cents !== undefined && data.fee_cents < 0) {
    return { error: 'Fee must be zero or greater.' };
  }

  // Build update payload containing only provided fields
  const updates: Record<string, unknown> = {};

  if (data.show_id !== undefined) updates.show_id = data.show_id;
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.fee_cents !== undefined) updates.fee_cents = data.fee_cents;
  if (data.level !== undefined) updates.level = data.level;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;
  if (data.is_active !== undefined) updates.is_active = data.is_active;

  if (Object.keys(updates).length === 0) {
    return { error: 'No fields provided to update.' };
  }

  const adminClient = createAdminClient();

  const { data: row, error } = await adminClient
    .from('show_classes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidateShowClassPaths();

  return row as ShowClassRow;
}

/** Delete a show class by ID. */
export async function deleteShowClass(
  id: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Show class ID is required.' };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('show_classes')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidateShowClassPaths();

  return { success: true };
}
