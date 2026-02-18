import type Stripe from 'stripe';
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
 * 3. Activate member membership fields
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

  // If no pending payment was found, create one as a fallback
  if (!updatedPayment) {
    console.warn(
      `No pending payment found for session ${session.id} — creating fallback record`,
    );

    if (memberId && membershipTypeSlug) {
      const { error: insertError } = await admin.from('payments').insert({
        member_id: memberId,
        amount_cents: session.amount_total ?? 0,
        payment_type: paymentType ?? 'membership_dues',
        membership_type_slug: membershipTypeSlug,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        status: 'succeeded',
        description: `SWMRHA Membership (webhook fallback)`,
      } satisfies Omit<PaymentRow, 'id' | 'created_at' | 'updated_at'>);

      if (insertError) {
        console.error(
          `Failed to create fallback payment for session ${session.id}:`,
          insertError.message,
        );
      }
    } else {
      console.error(
        `Cannot create fallback payment — missing metadata on session ${session.id}`,
      );
    }
  }

  // --- 3. Update member membership fields ---
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

  console.log(
    `Fulfilled checkout session ${session.id} for member ${memberId}`,
  );
}
