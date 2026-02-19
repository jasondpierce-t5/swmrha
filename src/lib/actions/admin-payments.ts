'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type {
  PaymentRow,
  ShowEntryRow,
  ShowEntryClassRow,
  FeePurchaseRow,
} from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A payment row enriched with resolved payer identity. */
export interface AdminPaymentRow extends PaymentRow {
  payer_name: string;
  payer_email: string | null;
}

/** Aggregate payment statistics for the admin dashboard. */
export interface PaymentsSummary {
  total_count: number;
  total_revenue_cents: number;
  count_by_type: Record<string, number>;
  count_by_status: Record<string, number>;
}

/** A show entry with its classes, for payment detail context. */
interface ShowEntryWithClasses extends ShowEntryRow {
  show_entry_classes: ShowEntryClassRow[];
}

/** Detailed payment record with related data for admin detail view. */
export interface AdminPaymentDetail {
  payment: AdminPaymentRow;
  show_entries: ShowEntryWithClasses[];
  fee_purchases: FeePurchaseRow[];
}

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
// Read operations (admin-only via service role)
// ---------------------------------------------------------------------------

/**
 * Fetch all payments using admin client, ordered by created_at DESC.
 * Resolves payer identity: member name for member payments, guest fields for guest payments.
 * Batch-fetches member names to avoid N+1 queries.
 */
export async function getPaymentsAdmin(): Promise<AdminPaymentRow[] | { error: string }> {
  const supabase = createAdminClient();

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  if (!payments || payments.length === 0) {
    return [];
  }

  // Collect unique non-null member_ids for batch lookup
  const memberIds = [
    ...new Set(
      (payments as PaymentRow[])
        .map((p) => p.member_id)
        .filter((id): id is string => id !== null)
    ),
  ];

  // Batch fetch member names
  const memberNameMap = new Map<string, { first_name: string; last_name: string; email: string }>();

  if (memberIds.length > 0) {
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('id, first_name, last_name, email')
      .in('id', memberIds);

    if (!membersError && members) {
      for (const m of members) {
        memberNameMap.set(m.id, {
          first_name: m.first_name,
          last_name: m.last_name,
          email: m.email,
        });
      }
    }
  }

  // Enrich payments with payer identity
  const enriched: AdminPaymentRow[] = (payments as PaymentRow[]).map((payment) => {
    if (payment.member_id && memberNameMap.has(payment.member_id)) {
      const member = memberNameMap.get(payment.member_id)!;
      return {
        ...payment,
        payer_name: `${member.first_name} ${member.last_name}`,
        payer_email: member.email,
      };
    }

    // Guest payment — use guest_name/guest_email fields
    return {
      ...payment,
      payer_name: payment.guest_name ?? 'Unknown',
      payer_email: payment.guest_email,
    };
  });

  return enriched;
}

/**
 * Fetch aggregate payment stats for admin dashboard summary.
 * Uses individual queries rather than loading all rows.
 */
export async function getPaymentsSummary(): Promise<PaymentsSummary | { error: string }> {
  const supabase = createAdminClient();

  // Fetch all payments (lightweight: just id, amount_cents, payment_type, status)
  const { data: payments, error } = await supabase
    .from('payments')
    .select('id, amount_cents, payment_type, status');

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  const rows = (payments ?? []) as {
    id: string;
    amount_cents: number;
    payment_type: string;
    status: string;
  }[];

  const total_count = rows.length;

  // Sum revenue from succeeded payments only
  const total_revenue_cents = rows
    .filter((r) => r.status === 'succeeded')
    .reduce((sum, r) => sum + r.amount_cents, 0);

  // Count by payment_type
  const count_by_type: Record<string, number> = {};
  for (const r of rows) {
    count_by_type[r.payment_type] = (count_by_type[r.payment_type] ?? 0) + 1;
  }

  // Count by status
  const count_by_status: Record<string, number> = {};
  for (const r of rows) {
    count_by_status[r.status] = (count_by_status[r.status] ?? 0) + 1;
  }

  return {
    total_count,
    total_revenue_cents,
    count_by_type,
    count_by_status,
  };
}

/**
 * Fetch a single payment by ID with related records based on payment_type.
 * - entry_fees: fetches show_entries with their show_entry_classes
 * - additional_fees: fetches fee_purchases
 * - membership types: no additional joins needed
 */
export async function getPaymentByIdAdmin(
  id: string,
): Promise<AdminPaymentDetail | null | { error: string }> {
  if (!id || id.trim() === '') {
    return { error: 'Payment ID is required.' };
  }

  const supabase = createAdminClient();

  // Fetch the payment
  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id.trim())
    .maybeSingle();

  if (error) {
    return { error: sanitizeSupabaseError(error) };
  }

  if (!payment) {
    return null;
  }

  const paymentRow = payment as PaymentRow;

  // Resolve payer identity
  let payer_name = paymentRow.guest_name ?? 'Unknown';
  let payer_email: string | null = paymentRow.guest_email;

  if (paymentRow.member_id) {
    const { data: member } = await supabase
      .from('members')
      .select('first_name, last_name, email')
      .eq('id', paymentRow.member_id)
      .maybeSingle();

    if (member) {
      payer_name = `${member.first_name} ${member.last_name}`;
      payer_email = member.email;
    }
  }

  const enrichedPayment: AdminPaymentRow = {
    ...paymentRow,
    payer_name,
    payer_email,
  };

  // Fetch related records based on payment_type
  let show_entries: ShowEntryWithClasses[] = [];
  let fee_purchases: FeePurchaseRow[] = [];

  if (paymentRow.payment_type === 'entry_fees') {
    const { data: entries } = await supabase
      .from('show_entries')
      .select('*, show_entry_classes(*)')
      .eq('payment_id', paymentRow.id);

    if (entries) {
      show_entries = entries as ShowEntryWithClasses[];
    }
  }

  if (paymentRow.payment_type === 'additional_fees') {
    const { data: purchases } = await supabase
      .from('fee_purchases')
      .select('*')
      .eq('payment_id', paymentRow.id);

    if (purchases) {
      fee_purchases = purchases as FeePurchaseRow[];
    }
  }

  return {
    payment: enrichedPayment,
    show_entries,
    fee_purchases,
  };
}
