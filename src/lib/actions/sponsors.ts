'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { SponsorRow, SponsorInsert, SponsorUpdate } from '@/types/database';

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Fetch all sponsors ordered by sort_order ASC, then name ASC. */
export async function getSponsors(): Promise<SponsorRow[] | { error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return (data as SponsorRow[]) ?? [];
}

/** Fetch a single sponsor by ID. Returns null when no row matches. */
export async function getSponsor(
  id: string,
): Promise<SponsorRow | null | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Sponsor ID is required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  return (data as SponsorRow) ?? null;
}

// ---------------------------------------------------------------------------
// Write operations (admin-only via RLS)
// ---------------------------------------------------------------------------

/** Insert a new sponsor. Validates required fields before sending to Supabase. */
export async function createSponsor(
  data: SponsorInsert,
): Promise<SponsorRow | { error: string }> {
  if (!data.name || data.name.trim() === '') {
    return { error: 'Sponsor name is required.' };
  }
  if (!data.level || data.level.trim() === '') {
    return { error: 'Sponsor level is required.' };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('sponsors')
    .insert({
      name: data.name.trim(),
      level: data.level.trim(),
      image_url: data.image_url ?? null,
      website_url: data.website_url ?? null,
      sort_order: data.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/sponsors');
  revalidatePath('/sponsors');

  return row as SponsorRow;
}

/** Update an existing sponsor. Only sends provided fields to Supabase. */
export async function updateSponsor(
  data: SponsorUpdate,
): Promise<SponsorRow | { error: string }> {
  if (!data.id || data.id.trim() === '') {
    return { error: 'Sponsor ID is required.' };
  }

  const updates: Record<string, unknown> = {};

  if (data.name !== undefined) updates.name = data.name;
  if (data.level !== undefined) updates.level = data.level;
  if (data.image_url !== undefined) updates.image_url = data.image_url;
  if (data.website_url !== undefined) updates.website_url = data.website_url;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;

  if (Object.keys(updates).length === 0) {
    return { error: 'No fields provided to update.' };
  }

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('sponsors')
    .update(updates)
    .eq('id', data.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/sponsors');
  revalidatePath('/sponsors');

  return row as SponsorRow;
}

/**
 * Delete a sponsor by ID. If the sponsor has a Supabase Storage logo,
 * it is removed from the bucket before deleting the row.
 */
export async function deleteSponsor(
  id: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Sponsor ID is required.' };
  }

  const supabase = await createClient();

  // Fetch sponsor to check for Storage image
  const { data: sponsor, error: fetchError } = await supabase
    .from('sponsors')
    .select('image_url')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }

  // Clean up Storage logo if it's a Supabase Storage URL
  if (sponsor?.image_url && sponsor.image_url.includes('/storage/v1/object/public/sponsor-logos/')) {
    const storagePath = sponsor.image_url.split('/storage/v1/object/public/sponsor-logos/')[1];
    if (storagePath) {
      await supabase.storage.from('sponsor-logos').remove([storagePath]);
    }
  }

  const { error } = await supabase.from('sponsors').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/sponsors');
  revalidatePath('/sponsors');

  return { success: true };
}

// ---------------------------------------------------------------------------
// Image upload operations (admin-only via Storage RLS)
// ---------------------------------------------------------------------------

/** Upload a sponsor logo to the sponsor-logos Storage bucket. */
export async function uploadSponsorLogo(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { error: 'No file provided.' };
  }

  const supabase = await createClient();

  const filename = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('sponsor-logos')
    .upload(filename, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from('sponsor-logos')
    .getPublicUrl(filename);

  return { url: publicUrlData.publicUrl };
}

/** Delete a sponsor logo from the sponsor-logos Storage bucket. */
export async function deleteSponsorLogo(
  path: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!path || path.trim() === '') {
    return { error: 'File path is required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.storage
    .from('sponsor-logos')
    .remove([path]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
