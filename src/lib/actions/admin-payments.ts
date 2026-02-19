'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeServer } from '@/lib/stripe/server';
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

// ---------------------------------------------------------------------------
// Write operations (admin-only via service role)
// ---------------------------------------------------------------------------

/**
 * Process a full refund for a payment via Stripe and update related DB records.
 *
 * 1. Validates input and verifies payment is eligible (status === 'succeeded', has payment_intent)
 * 2. Issues full refund via Stripe API
 * 3. Updates payment status to 'refunded'
 * 4. Updates related records based on payment_type
 * 5. Revalidates admin and member paths
 */
export async function processRefund(
  paymentId: string,
): Promise<{ success: true } | { error: string }> {
  if (!paymentId || paymentId.trim() === '') {
    return { error: 'Payment ID is required.' };
  }

  const supabase = createAdminClient();

  // --- 1. Fetch and validate payment ---
  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId.trim())
    .maybeSingle();

  if (fetchError) {
    return { error: sanitizeSupabaseError(fetchError) };
  }

  if (!payment) {
    return { error: 'Payment not found.' };
  }

  const paymentRow = payment as PaymentRow;

  if (paymentRow.status !== 'succeeded') {
    return { error: 'Only succeeded payments can be refunded.' };
  }

  if (!paymentRow.stripe_payment_intent_id) {
    return { error: 'No Stripe Payment Intent found for this payment. Cannot process refund.' };
  }

  // --- 2. Process Stripe refund ---
  try {
    const stripe = getStripeServer();
    await stripe.refunds.create({
      payment_intent: paymentRow.stripe_payment_intent_id,
    });
  } catch (stripeError: unknown) {
    const message =
      stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error';
    console.error(`Stripe refund failed for payment ${paymentId}:`, message);
    return { error: `Stripe refund failed: ${message}` };
  }

  // --- 3. Update payment status to 'refunded' ---
  const { error: updateError } = await supabase
    .from('payments')
    .update({ status: 'refunded' })
    .eq('id', paymentRow.id);

  if (updateError) {
    console.error(
      `Payment ${paymentId} refunded in Stripe but DB update failed:`,
      updateError.message,
    );
    return { error: 'Refund processed in Stripe but failed to update payment status. Please update manually.' };
  }

  // --- 4. Update related records based on payment_type ---
  if (paymentRow.payment_type === 'entry_fees') {
    const { error: entriesError } = await supabase
      .from('show_entries')
      .update({ status: 'refunded' })
      .eq('payment_id', paymentRow.id);

    if (entriesError) {
      console.error(
        `Failed to update show entries for refunded payment ${paymentId}:`,
        entriesError.message,
      );
    }
  }

  if (paymentRow.payment_type === 'additional_fees') {
    const { error: purchasesError } = await supabase
      .from('fee_purchases')
      .update({ status: 'refunded' })
      .eq('payment_id', paymentRow.id);

    if (purchasesError) {
      console.error(
        `Failed to update fee purchases for refunded payment ${paymentId}:`,
        purchasesError.message,
      );
    }
  }

  if (
    paymentRow.payment_type === 'membership_dues' ||
    paymentRow.payment_type === 'membership_renewal'
  ) {
    // Do NOT auto-change membership status — admin manages separately via member edit page.
    console.log(
      `Membership payment ${paymentId} refunded. Admin should review member ${paymentRow.member_id} membership status.`,
    );
  }

  // --- 5. Revalidate paths ---
  revalidatePath('/admin/payments');
  revalidatePath(`/admin/payments/${paymentRow.id}`);
  revalidatePath('/member');

  return { success: true };
}
