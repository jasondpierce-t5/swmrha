'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { FeeItemRow, FeeItemInsert } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code === '23505') return 'A fee item with this name already exists.';
  if (code.startsWith('PGRST')) return 'Unable to save. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

/** Paths to revalidate after fee item mutations. */
const REVALIDATE_PATHS = ['/admin/fees', '/purchase'];

function revalidateFeePaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

/** Check if the current user is an admin. Returns true if admin, false otherwise. */
async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const role = user.app_metadata?.role;
  return role === 'admin';
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch all fee items ordered by sort_order ASC. Admin only.
 * Returns all items including inactive ones for admin management.
 */
export async function getFeeItems(): Promise<FeeItemRow[] | { error: string }> {
  const admin = await isAdmin();
  if (!admin) {
    return { error: 'Admin access required.' };
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('additional_fee_types')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as FeeItemRow[]) ?? [];
}

/**
 * Fetch active fee items ordered by sort_order ASC. Public access.
 * Used by public purchase pages — no authentication required.
 */
export async function getActiveFeeItems(): Promise<FeeItemRow[] | { error: string }> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('additional_fee_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as FeeItemRow[]) ?? [];
}

/**
 * Fetch active fee items for a specific show (or general items with no show_id).
 * Public access — no authentication required.
 */
export async function getActiveFeeItemsForShow(
  showId: string,
): Promise<FeeItemRow[] | { error: string }> {
  if (!showId || showId.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('additional_fee_types')
    .select('*')
    .eq('is_active', true)
    .or(`show_id.eq.${showId},show_id.is.null`)
    .order('sort_order', { ascending: true });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as FeeItemRow[]) ?? [];
}

// ---------------------------------------------------------------------------
// Write operations (admin-only via admin client)
// ---------------------------------------------------------------------------

/**
 * Insert a new fee item. Admin only.
 * Validates required fields before sending to Supabase.
 */
export async function createFeeItem(
  data: FeeItemInsert,
): Promise<{ success: true } | { error: string }> {
  const admin = await isAdmin();
  if (!admin) {
    return { error: 'Admin access required.' };
  }

  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    return { error: 'Fee item name is required.' };
  }
  if (data.name.trim().length > 200) {
    return { error: 'Fee item name must be 200 characters or fewer.' };
  }
  if (data.price_cents <= 0) {
    return { error: 'Price must be greater than zero.' };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.from('additional_fee_types').insert({
    name: data.name.trim(),
    description: data.description ?? null,
    price_cents: data.price_cents,
    category: data.category || 'other',
    show_id: data.show_id ?? null,
    max_quantity_per_order: data.max_quantity_per_order ?? null,
    is_active: data.is_active ?? true,
    sort_order: data.sort_order ?? 0,
  });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidateFeePaths();

  return { success: true };
}

/**
 * Update an existing fee item. Admin only.
 * Only validates and sends provided fields.
 */
export async function updateFeeItem(
  id: string,
  data: Partial<FeeItemInsert>,
): Promise<{ success: true } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Fee item ID is required.' };
  }

  const admin = await isAdmin();
  if (!admin) {
    return { error: 'Admin access required.' };
  }

  // Validate provided fields
  if (data.name !== undefined) {
    if (data.name.trim() === '') {
      return { error: 'Fee item name is required.' };
    }
    if (data.name.trim().length > 200) {
      return { error: 'Fee item name must be 200 characters or fewer.' };
    }
  }
  if (data.price_cents !== undefined && data.price_cents <= 0) {
    return { error: 'Price must be greater than zero.' };
  }

  // Build update payload containing only provided fields
  const updates: Record<string, unknown> = {};

  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.description !== undefined) updates.description = data.description;
  if (data.price_cents !== undefined) updates.price_cents = data.price_cents;
  if (data.category !== undefined) updates.category = data.category;
  if (data.show_id !== undefined) updates.show_id = data.show_id;
  if (data.max_quantity_per_order !== undefined) updates.max_quantity_per_order = data.max_quantity_per_order;
  if (data.is_active !== undefined) updates.is_active = data.is_active;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;

  if (Object.keys(updates).length === 0) {
    return { error: 'No fields provided to update.' };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('additional_fee_types')
    .update(updates)
    .eq('id', id);

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidateFeePaths();

  return { success: true };
}

/**
 * Delete a fee item by ID. Admin only.
 */
export async function deleteFeeItem(
  id: string,
): Promise<{ success: true } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Fee item ID is required.' };
  }

  const admin = await isAdmin();
  if (!admin) {
    return { error: 'Admin access required.' };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('additional_fee_types')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  revalidateFeePaths();

  return { success: true };
}
