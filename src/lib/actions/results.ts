'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ResultRow, ResultInsert, ResultUpdate } from '@/types/database';

/** Valid category values for results. */
const VALID_CATEGORIES = ['current_year', 'past_results', 'standings'] as const;

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Fetch all results ordered by category ASC, then sort_order ASC. */
export async function getResults(): Promise<ResultRow[] | { error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('results')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return (data as ResultRow[]) ?? [];
}

/** Fetch a single result by ID. Returns null when no row matches. */
export async function getResult(
  id: string,
): Promise<ResultRow | null | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Result ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  return (data as ResultRow) ?? null;
}

// ---------------------------------------------------------------------------
// Write operations (admin-only via RLS)
// ---------------------------------------------------------------------------

/** Insert a new result. Validates required fields before sending to Supabase. */
export async function createResult(
  data: ResultInsert,
): Promise<ResultRow | { error: string }> {
  // Validate required fields
  if (!data.label || data.label.trim() === '') {
    return { error: 'Result label is required.' };
  }
  if (!data.url || data.url.trim() === '') {
    return { error: 'Result URL is required.' };
  }
  if (!data.category || data.category.trim() === '') {
    return { error: 'Result category is required.' };
  }
  if (!VALID_CATEGORIES.includes(data.category as typeof VALID_CATEGORIES[number])) {
    return { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('results')
    .insert({
      label: data.label.trim(),
      url: data.url.trim(),
      category: data.category.trim(),
      sort_order: data.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/results');
  revalidatePath('/results');

  return row as ResultRow;
}

/** Update an existing result. Only sends provided fields to Supabase. */
export async function updateResult(
  data: ResultUpdate,
): Promise<ResultRow | { error: string }> {
  if (!data.id || data.id.trim() === '') {
    return { error: 'Result ID is required.' };
  }

  // Validate category if provided
  if (data.category !== undefined) {
    if (!data.category || data.category.trim() === '') {
      return { error: 'Result category cannot be empty.' };
    }
    if (!VALID_CATEGORIES.includes(data.category as typeof VALID_CATEGORIES[number])) {
      return { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` };
    }
  }

  // Build an update payload containing only the fields that were provided.
  const updates: Record<string, unknown> = {};

  if (data.label !== undefined) updates.label = data.label;
  if (data.url !== undefined) updates.url = data.url;
  if (data.category !== undefined) updates.category = data.category;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;

  if (Object.keys(updates).length === 0) {
    return { error: 'No fields provided to update.' };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('results')
    .update(updates)
    .eq('id', data.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/results');
  revalidatePath('/results');

  return row as ResultRow;
}

/** Delete a result by ID. */
export async function deleteResult(
  id: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Result ID is required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('results').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/results');
  revalidatePath('/results');

  return { success: true };
}
