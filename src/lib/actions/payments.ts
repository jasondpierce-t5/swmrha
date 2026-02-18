'use server';

import { createClient } from '@/lib/supabase/server';
import type { PaymentRow } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code.startsWith('PGRST')) return 'Unable to load payments. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch all payments for the authenticated member, ordered by most recent first.
 */
export async function getMemberPayments(): Promise<PaymentRow[] | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('member_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as PaymentRow[]) ?? [];
}

/**
 * Fetch a single payment by its Stripe checkout session ID.
 * Used by the checkout success page to show payment confirmation.
 * Only returns the payment if it belongs to the authenticated user.
 */
export async function getPaymentBySessionId(
  sessionId: string,
): Promise<PaymentRow | null | { error: string }> {
  if (!sessionId || sessionId.trim() === '') {
    return { error: 'Session ID is required.' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('stripe_checkout_session_id', sessionId.trim())
    .eq('member_id', user.id)
    .maybeSingle();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  return (data as PaymentRow) ?? null;
}
