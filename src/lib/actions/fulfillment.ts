import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import type { MembershipTypeRow, PaymentRow } from '@/types/database';

/**
 * Fulfill a completed Stripe Checkout Session.
 *
 * Called from the webhook handler when `checkout.session.completed` fires.
 * Uses the admin client (service role) for all DB operations — this runs
 * in webhook context with no user session.
 *
 * Steps:
 * 1. Idempotency check — skip if already fulfilled
 * 2. Update payment record status to 'succeeded'
 * 3. Dispatch to payment-type-specific fulfillment (membership or entry fees)
 */
export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const admin = createAdminClient();

  const memberId = session.metadata?.member_id;
  const membershipTypeSlug = session.metadata?.membership_type_slug;
  const paymentType = session.metadata?.payment_type;

  // --- 1. Idempotency check ---
  const { data: existingPayment } = await admin
    .from('payments')
    .select('id')
    .eq('stripe_checkout_session_id', session.id)
    .eq('status', 'succeeded')
    .maybeSingle();

  if (existingPayment) {
    console.log(
      `Checkout session ${session.id} already fulfilled — skipping`,
    );
    return;
  }

  // --- 2. Update payment record ---
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  let paymentRecordId: string | null = null;

  const { data: updatedPayment, error: updateError } = await admin
    .from('payments')
    .update({
      status: 'succeeded',
      stripe_payment_intent_id: paymentIntentId,
    })
    .eq('stripe_checkout_session_id', session.id)
    .select('id')
    .maybeSingle();

  if (updateError) {
    console.error(
      `Failed to update payment for session ${session.id}:`,
      updateError.message,
    );
  }

  if (updatedPayment) {
    paymentRecordId = updatedPayment.id as string;
  }

  // If no pending payment was found, create one as a fallback
  if (!updatedPayment) {
    console.warn(
      `No pending payment found for session ${session.id} — creating fallback record`,
    );

    if (memberId) {
      // For entry_fees, membership_type_slug will be undefined/null — that's fine
      const fallbackSlug = membershipTypeSlug ?? null;
      const fallbackDescription =
        paymentType === 'entry_fees'
          ? `SWMRHA Show Entry Fees (webhook fallback)`
          : `SWMRHA Membership (webhook fallback)`;

      const { data: fallbackPayment, error: insertError } = await admin
        .from('payments')
        .insert({
          member_id: memberId,
          amount_cents: session.amount_total ?? 0,
          payment_type: paymentType ?? 'membership_dues',
          membership_type_slug: fallbackSlug,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          status: 'succeeded',
          description: fallbackDescription,
          guest_email: null,
          guest_name: null,
        } satisfies Omit<PaymentRow, 'id' | 'created_at' | 'updated_at'>)
        .select('id')
        .single();

      if (insertError) {
        console.error(
          `Failed to create fallback payment for session ${session.id}:`,
          insertError.message,
        );
      } else if (fallbackPayment) {
        paymentRecordId = fallbackPayment.id as string;
      }
    } else if (paymentType === 'additional_fees') {
      // Guest payment fallback — no member_id available
      const guestEmail = session.metadata?.guest_email ?? null;
      const guestName = session.metadata?.guest_name ?? null;

      const { data: fallbackPayment, error: insertError } = await admin
        .from('payments')
        .insert({
          member_id: null,
          amount_cents: session.amount_total ?? 0,
          payment_type: 'additional_fees',
          membership_type_slug: null,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          status: 'succeeded',
          description: 'SWMRHA Additional Fee Purchase (webhook fallback)',
          guest_email: guestEmail,
          guest_name: guestName,
        } satisfies Omit<PaymentRow, 'id' | 'created_at' | 'updated_at'>)
        .select('id')
        .single();

      if (insertError) {
        console.error(
          `Failed to create guest fallback payment for session ${session.id}:`,
          insertError.message,
        );
      } else if (fallbackPayment) {
        paymentRecordId = fallbackPayment.id as string;
      }
    } else {
      console.error(
        `Cannot create fallback payment — missing metadata on session ${session.id}`,
      );
    }
  }

  // --- 3. Dispatch based on payment type ---
  if (paymentType === 'entry_fees') {
    await fulfillEntryPayment(session, admin, paymentRecordId);
  } else if (paymentType === 'additional_fees') {
    await fulfillFeePurchase(session, admin, paymentRecordId);
  } else {
    await fulfillMembershipPayment(session, admin, memberId, membershipTypeSlug);
  }

  console.log(
    `Fulfilled checkout session ${session.id} for ${memberId ? 'member' : 'guest'} ${memberId ?? session.metadata?.guest_email}`,
  );
}

// ---------------------------------------------------------------------------
// Membership payment fulfillment
// ---------------------------------------------------------------------------

/**
 * Fulfill a membership payment: activate membership, update member fields.
 */
async function fulfillMembershipPayment(
  session: Stripe.Checkout.Session,
  admin: SupabaseClient,
  memberId: string | undefined,
  membershipTypeSlug: string | undefined,
): Promise<void> {
  if (!memberId || !membershipTypeSlug) {
    console.error(
      `Missing metadata on session ${session.id} — cannot update member`,
    );
    return;
  }

  // Fetch membership type to get duration_months
  const { data: membershipType, error: typeError } = await admin
    .from('membership_types')
    .select('*')
    .eq('slug', membershipTypeSlug)
    .maybeSingle();

  if (typeError || !membershipType) {
    console.error(
      `Failed to fetch membership type '${membershipTypeSlug}':`,
      typeError?.message ?? 'not found',
    );
    // Still try to activate with what we have
  }

  const typeRow = membershipType as MembershipTypeRow | null;
  const durationMonths = typeRow?.duration_months ?? null;

  // Calculate expiry date
  let membershipExpiry: string | null = null;
  if (durationMonths !== null) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    membershipExpiry = expiryDate.toISOString();
  }

  // Ensure stripe_customer_id is stored
  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id ?? null;

  const memberUpdate: Record<string, unknown> = {
    membership_type: membershipTypeSlug,
    membership_status: 'active',
    membership_start: new Date().toISOString(),
    membership_expiry: membershipExpiry,
  };

  if (customerId) {
    memberUpdate.stripe_customer_id = customerId;
  }

  const { error: memberError } = await admin
    .from('members')
    .update(memberUpdate)
    .eq('id', memberId);

  if (memberError) {
    console.error(
      `Failed to update member ${memberId}:`,
      memberError.message,
    );
    throw new Error(
      `Failed to update member membership: ${memberError.message}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Entry payment fulfillment
// ---------------------------------------------------------------------------

/**
 * Fulfill an entry fee payment: confirm entries with payment_id.
 */
async function fulfillEntryPayment(
  session: Stripe.Checkout.Session,
  admin: SupabaseClient,
  paymentRecordId: string | null,
): Promise<void> {
  const entryIdsRaw = session.metadata?.entry_ids;

  if (!entryIdsRaw) {
    console.error(
      `No entry_ids in metadata for session ${session.id} — cannot fulfill entries`,
    );
    return;
  }

  const entryIds = entryIdsRaw
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (entryIds.length === 0) {
    console.error(
      `Empty entry_ids in metadata for session ${session.id}`,
    );
    return;
  }

  // Update each entry to confirmed with payment_id
  for (const entryId of entryIds) {
    const updateData: Record<string, unknown> = {
      status: 'confirmed',
    };

    if (paymentRecordId) {
      updateData.payment_id = paymentRecordId;
    }

    const { error: entryError } = await admin
      .from('show_entries')
      .update(updateData)
      .eq('id', entryId);

    if (entryError) {
      console.error(
        `Failed to confirm entry ${entryId} for session ${session.id}:`,
        entryError.message,
      );
      // Continue processing remaining entries
    }
  }

  // Revalidate entry-related paths
  revalidatePath('/member/entries');
  revalidatePath('/member/enter-show');
  revalidatePath('/admin/shows');

  console.log(
    `Confirmed ${entryIds.length} entries for session ${session.id}`,
  );
}

// ---------------------------------------------------------------------------
// Fee purchase fulfillment
// ---------------------------------------------------------------------------

/**
 * Fulfill an additional fee purchase: confirm fee_purchases with matching payment_id.
 */
async function fulfillFeePurchase(
  session: Stripe.Checkout.Session,
  admin: SupabaseClient,
  paymentRecordId: string | null,
): Promise<void> {
  if (!paymentRecordId) {
    console.error(
      `No payment record ID for fee purchase session ${session.id} — cannot fulfill fee purchases`,
    );
    return;
  }

  // Update all fee_purchases with this payment_id to confirmed
  const { data: updatedPurchases, error: purchaseError } = await admin
    .from('fee_purchases')
    .update({ status: 'confirmed' })
    .eq('payment_id', paymentRecordId)
    .select('id');

  if (purchaseError) {
    console.error(
      `Failed to confirm fee purchases for session ${session.id}:`,
      purchaseError.message,
    );
    return;
  }

  const count = updatedPurchases?.length ?? 0;

  // Revalidate fee-related paths
  revalidatePath('/purchase');
  revalidatePath('/member/purchase');
  revalidatePath('/member');

  console.log(
    `Confirmed ${count} fee purchase(s) for session ${session.id}`,
  );
}
