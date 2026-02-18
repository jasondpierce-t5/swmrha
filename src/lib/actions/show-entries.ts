'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
  ShowEntryRow,
  ShowEntryClassRow,
  ShowEntryWithClasses,
  ShowClassRow,
  CreateShowEntryInput,
} from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code === '23505') return 'This entry already exists.';
  if (code.startsWith('PGRST')) return 'Unable to process request. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

/** Paths to revalidate after show entry mutations. */
const REVALIDATE_PATHS = ['/member/entries', '/member/enter-show', '/admin/shows'];

function revalidateEntryPaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch all entries for the authenticated member, ordered by most recent first.
 * Includes the show name and selected classes for each entry.
 */
export async function getMemberEntries(): Promise<
  (ShowEntryWithClasses & { show_name: string })[] | { error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Fetch entries for this member
  const { data: entries, error: entriesError } = await supabase
    .from('show_entries')
    .select('*')
    .eq('member_id', user.id)
    .order('created_at', { ascending: false });

  if (entriesError) {
    return { error: sanitizeSupabaseError(entriesError) };
  }

  if (!entries || entries.length === 0) {
    return [];
  }

  const entryRows = entries as ShowEntryRow[];

  // Gather unique show IDs to fetch show names
  const showIds = [...new Set(entryRows.map((e) => e.show_id))];
  const { data: shows, error: showsError } = await supabase
    .from('shows')
    .select('id, name')
    .in('id', showIds);

  if (showsError) {
    return { error: sanitizeSupabaseError(showsError) };
  }

  const showNameMap = new Map<string, string>();
  for (const show of shows ?? []) {
    showNameMap.set(show.id, show.name);
  }

  // Fetch all entry classes for these entries
  const entryIds = entryRows.map((e) => e.id);
  const { data: entryClasses, error: classesError } = await supabase
    .from('show_entry_classes')
    .select('*')
    .in('entry_id', entryIds);

  if (classesError) {
    return { error: sanitizeSupabaseError(classesError) };
  }

  const classMap = new Map<string, ShowEntryClassRow[]>();
  for (const ec of (entryClasses as ShowEntryClassRow[]) ?? []) {
    const existing = classMap.get(ec.entry_id) ?? [];
    existing.push(ec);
    classMap.set(ec.entry_id, existing);
  }

  // Assemble enriched results
  return entryRows.map((entry) => ({
    ...entry,
    classes: classMap.get(entry.id) ?? [],
    show_name: showNameMap.get(entry.show_id) ?? 'Unknown Show',
  }));
}

/**
 * Fetch entries for the authenticated member for a specific show.
 * Includes selected classes for each entry.
 */
export async function getMemberEntriesForShow(
  showId: string,
): Promise<ShowEntryWithClasses[] | { error: string }> {
  if (!showId || showId.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: entries, error: entriesError } = await supabase
    .from('show_entries')
    .select('*')
    .eq('member_id', user.id)
    .eq('show_id', showId)
    .order('created_at', { ascending: false });

  if (entriesError) {
    return { error: sanitizeSupabaseError(entriesError) };
  }

  if (!entries || entries.length === 0) {
    return [];
  }

  const entryRows = entries as ShowEntryRow[];
  const entryIds = entryRows.map((e) => e.id);

  const { data: entryClasses, error: classesError } = await supabase
    .from('show_entry_classes')
    .select('*')
    .in('entry_id', entryIds);

  if (classesError) {
    return { error: sanitizeSupabaseError(classesError) };
  }

  const classMap = new Map<string, ShowEntryClassRow[]>();
  for (const ec of (entryClasses as ShowEntryClassRow[]) ?? []) {
    const existing = classMap.get(ec.entry_id) ?? [];
    existing.push(ec);
    classMap.set(ec.entry_id, existing);
  }

  return entryRows.map((entry) => ({
    ...entry,
    classes: classMap.get(entry.id) ?? [],
  }));
}

/**
 * Admin-only: Fetch ALL entries for a show (used by admin views in Phase 21).
 * Uses admin client to bypass member-only RLS.
 * Includes classes and member name for each entry.
 */
export async function getShowEntries(
  showId: string,
): Promise<
  (ShowEntryWithClasses & { member_name: string })[] | { error: string }
> {
  if (!showId || showId.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  // Verify the caller is authenticated and is an admin
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Check admin role from app_metadata
  const role = user.app_metadata?.role;
  if (role !== 'admin') {
    return { error: 'Admin access required.' };
  }

  const adminClient = createAdminClient();

  const { data: entries, error: entriesError } = await adminClient
    .from('show_entries')
    .select('*')
    .eq('show_id', showId)
    .order('created_at', { ascending: false });

  if (entriesError) {
    return { error: sanitizeSupabaseError(entriesError) };
  }

  if (!entries || entries.length === 0) {
    return [];
  }

  const entryRows = entries as ShowEntryRow[];

  // Fetch member names for all entries
  const memberIds = [...new Set(entryRows.map((e) => e.member_id))];
  const { data: members, error: membersError } = await adminClient
    .from('members')
    .select('id, first_name, last_name')
    .in('id', memberIds);

  if (membersError) {
    return { error: sanitizeSupabaseError(membersError) };
  }

  const memberNameMap = new Map<string, string>();
  for (const m of members ?? []) {
    memberNameMap.set(m.id, `${m.first_name} ${m.last_name}`);
  }

  // Fetch all entry classes
  const entryIds = entryRows.map((e) => e.id);
  const { data: entryClasses, error: classesError } = await adminClient
    .from('show_entry_classes')
    .select('*')
    .in('entry_id', entryIds);

  if (classesError) {
    return { error: sanitizeSupabaseError(classesError) };
  }

  const classMap = new Map<string, ShowEntryClassRow[]>();
  for (const ec of (entryClasses as ShowEntryClassRow[]) ?? []) {
    const existing = classMap.get(ec.entry_id) ?? [];
    existing.push(ec);
    classMap.set(ec.entry_id, existing);
  }

  return entryRows.map((entry) => ({
    ...entry,
    classes: classMap.get(entry.id) ?? [],
    member_name: memberNameMap.get(entry.member_id) ?? 'Unknown Member',
  }));
}

// ---------------------------------------------------------------------------
// Write operations (via admin client — service role bypasses RLS)
// ---------------------------------------------------------------------------

/**
 * Create one or more show entries for the authenticated member.
 * All entries must be for the same show. Each entry is a horse/rider combo
 * with selected class IDs. Class fees are snapshotted at entry time.
 */
export async function createShowEntries(
  entries: CreateShowEntryInput[],
): Promise<ShowEntryWithClasses[] | { error: string }> {
  // --- Input validation ---
  if (!entries || entries.length === 0) {
    return { error: 'At least one entry is required.' };
  }

  // All entries must have the same show_id
  const showId = entries[0].show_id;
  if (!showId || showId.trim() === '') {
    return { error: 'Show ID is required.' };
  }

  for (const entry of entries) {
    if (entry.show_id !== showId) {
      return { error: 'All entries must be for the same show.' };
    }

    if (!entry.horse_name || entry.horse_name.trim() === '') {
      return { error: 'Horse name is required for each entry.' };
    }
    if (entry.horse_name.trim().length > 200) {
      return { error: 'Horse name must be 200 characters or fewer.' };
    }

    if (!entry.rider_name || entry.rider_name.trim() === '') {
      return { error: 'Rider name is required for each entry.' };
    }
    if (entry.rider_name.trim().length > 200) {
      return { error: 'Rider name must be 200 characters or fewer.' };
    }

    if (!entry.class_ids || entry.class_ids.length === 0) {
      return { error: 'At least one class must be selected for each entry.' };
    }
  }

  // --- Authenticate ---
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  try {
    // --- Fetch active show classes to validate class_ids and get fee_cents ---
    const allClassIds = [...new Set(entries.flatMap((e) => e.class_ids))];

    const adminClient = createAdminClient();

    const { data: showClasses, error: classError } = await adminClient
      .from('show_classes')
      .select('*')
      .eq('show_id', showId)
      .eq('is_active', true)
      .in('id', allClassIds);

    if (classError) {
      return { error: sanitizeSupabaseError(classError) };
    }

    if (!showClasses || showClasses.length === 0) {
      return { error: 'No valid active classes found for this show.' };
    }

    const classRows = showClasses as ShowClassRow[];
    const classMap = new Map<string, ShowClassRow>();
    for (const c of classRows) {
      classMap.set(c.id, c);
    }

    // Validate all requested class_ids exist in active classes
    for (const entry of entries) {
      for (const classId of entry.class_ids) {
        if (!classMap.has(classId)) {
          return { error: `Class "${classId}" is not available for this show.` };
        }
      }
    }

    // --- Create entries and entry classes ---
    const createdEntries: ShowEntryWithClasses[] = [];

    for (const input of entries) {
      // Calculate total_cents from selected classes
      const totalCents = input.class_ids.reduce((sum, classId) => {
        const cls = classMap.get(classId)!;
        return sum + cls.fee_cents;
      }, 0);

      // Insert the entry
      const { data: entryRow, error: entryError } = await adminClient
        .from('show_entries')
        .insert({
          show_id: showId,
          member_id: user.id,
          horse_name: input.horse_name.trim(),
          rider_name: input.rider_name.trim(),
          total_cents: totalCents,
          status: 'draft',
        })
        .select()
        .single();

      if (entryError || !entryRow) {
        return { error: sanitizeSupabaseError(entryError ?? { message: 'Failed to create entry.' }) };
      }

      const entry = entryRow as ShowEntryRow;

      // Insert entry classes with fee snapshot
      const classInserts = input.class_ids.map((classId) => ({
        entry_id: entry.id,
        class_id: classId,
        fee_cents: classMap.get(classId)!.fee_cents,
      }));

      const { data: classRows, error: classInsertError } = await adminClient
        .from('show_entry_classes')
        .insert(classInserts)
        .select();

      if (classInsertError) {
        return { error: sanitizeSupabaseError(classInsertError) };
      }

      createdEntries.push({
        ...entry,
        classes: (classRows as ShowEntryClassRow[]) ?? [],
      });
    }

    revalidateEntryPaths();

    return createdEntries;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to create show entries:', message);
    return { error: 'Unable to create entries. Please try again.' };
  }
}

/**
 * Cancel a show entry. Only allowed if the entry belongs to the authenticated
 * member and its status is 'draft'.
 */
export async function cancelShowEntry(
  entryId: string,
): Promise<{ success: boolean } | { error: string }> {
  if (!entryId || entryId.trim() === '') {
    return { error: 'Entry ID is required.' };
  }

  // --- Authenticate ---
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  try {
    // Verify entry belongs to current member and check status
    const { data: entry, error: fetchError } = await supabase
      .from('show_entries')
      .select('id, member_id, status')
      .eq('id', entryId)
      .eq('member_id', user.id)
      .maybeSingle();

    if (fetchError) {
      return { error: sanitizeSupabaseError(fetchError) };
    }

    if (!entry) {
      return { error: 'Entry not found.' };
    }

    if (entry.status !== 'draft') {
      return { error: 'Only draft entries can be cancelled.' };
    }

    // Update status to cancelled via admin client
    const adminClient = createAdminClient();

    const { error: updateError } = await adminClient
      .from('show_entries')
      .update({ status: 'cancelled' })
      .eq('id', entryId);

    if (updateError) {
      return { error: sanitizeSupabaseError(updateError) };
    }

    revalidateEntryPaths();

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to cancel show entry:', message);
    return { error: 'Unable to cancel entry. Please try again.' };
  }
}
