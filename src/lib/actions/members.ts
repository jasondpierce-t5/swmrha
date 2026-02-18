'use server';

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
