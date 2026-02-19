'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeServer } from '@/lib/stripe/server';
import type { MemberRow, FeeItemRow, FeePurchaseRow } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map raw Supabase/PostgREST errors to user-friendly messages. */
function sanitizeSupabaseError(error: { message: string; code?: string }): string {
  const code = error.code ?? '';
  if (code.startsWith('PGRST')) return 'Unable to process request. Please try again.';
  if (/timeout|connection|network/i.test(error.message)) {
    return 'Unable to connect to database. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

/** Basic email format validation. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------------------------------------------------------------------
// Fee Checkout Session
// ---------------------------------------------------------------------------

/**
 * Create a Stripe Checkout Session for additional fee purchases.
 *
 * Supports both authenticated (member) and unauthenticated (guest) flows.
 *
 * Flow:
 * 1. Validate input items
 * 2. Try to get authenticated user (not required for guest flow)
 * 3. If authenticated: fetch member profile, get/create Stripe customer
 * 4. If guest: require guestEmail and guestName
 * 5. Fetch and validate fee types
 * 6. Calculate totals and build Stripe line items
 * 7. Create Stripe Checkout Session
 * 8. Insert pending payment record
 * 9. Insert fee_purchase records
 * 10. Return checkout URL
 */
export async function createFeeCheckoutSession(input: {
  items: Array<{ feeTypeId: string; quantity: number }>;
  showId?: string;
  guestEmail?: string;
  guestName?: string;
}): Promise<{ url: string } | { error: string }> {
  // --- 1. Validate input items ---
  if (!input.items || input.items.length === 0) {
    return { error: 'At least one fee item is required.' };
  }

  for (const item of input.items) {
    if (!item.feeTypeId || item.feeTypeId.trim() === '') {
      return { error: 'Invalid fee item ID provided.' };
    }
    if (!item.quantity || item.quantity < 1) {
      return { error: 'Each item must have a quantity of at least 1.' };
    }
  }

  try {
    // --- 2. Try to get authenticated user ---
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminClient = createAdminClient();

    let memberId: string | null = null;
    let memberRow: MemberRow | null = null;
    let customerId: string | undefined;
    let purchaserName: string;
    let purchaserEmail: string;

    if (user) {
      // --- 3. Authenticated member flow ---
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();

      if (memberError || !member) {
        return { error: 'Unable to load your profile. Please try again.' };
      }

      memberRow = member as MemberRow;
      memberId = memberRow.id;
      purchaserName = `${memberRow.first_name} ${memberRow.last_name}`;
      purchaserEmail = memberRow.email;

      // Get or create Stripe customer
      const stripe = getStripeServer();
      customerId = memberRow.stripe_customer_id ?? undefined;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: memberRow.email,
          name: purchaserName,
          metadata: {
            member_id: memberRow.id,
          },
        });
        customerId = customer.id;

        // Store the new customer ID (best-effort)
        try {
          const { error: updateError } = await adminClient
            .from('members')
            .update({ stripe_customer_id: customerId })
            .eq('id', memberRow.id);

          if (updateError) {
            console.error('Failed to store Stripe customer ID:', updateError.message);
          }
        } catch (adminErr) {
          console.error('Admin client unavailable for customer ID storage:', adminErr);
        }
      }
    } else {
      // --- 4. Guest flow ---
      if (!input.guestEmail || input.guestEmail.trim() === '') {
        return { error: 'Email address is required for guest checkout.' };
      }
      if (!input.guestName || input.guestName.trim() === '') {
        return { error: 'Name is required for guest checkout.' };
      }
      if (!isValidEmail(input.guestEmail.trim())) {
        return { error: 'Please provide a valid email address.' };
      }

      purchaserName = input.guestName.trim();
      purchaserEmail = input.guestEmail.trim();
    }

    // --- 5. Fetch and validate fee types ---
    const feeTypeIds = input.items.map((item) => item.feeTypeId.trim());

    const { data: feeTypes, error: feeTypesError } = await adminClient
      .from('additional_fee_types')
      .select('*')
      .in('id', feeTypeIds)
      .eq('is_active', true);

    if (feeTypesError) {
      return { error: sanitizeSupabaseError(feeTypesError) };
    }

    if (!feeTypes || feeTypes.length !== feeTypeIds.length) {
      return { error: 'One or more fee items are unavailable. Please refresh and try again.' };
    }

    const feeTypeMap = new Map<string, FeeItemRow>();
    for (const ft of feeTypes as FeeItemRow[]) {
      feeTypeMap.set(ft.id, ft);
    }

    // Validate quantities against max_quantity_per_order
    for (const item of input.items) {
      const feeType = feeTypeMap.get(item.feeTypeId.trim());
      if (!feeType) {
        return { error: 'One or more fee items are unavailable.' };
      }
      if (feeType.max_quantity_per_order !== null && item.quantity > feeType.max_quantity_per_order) {
        return { error: `Maximum quantity for "${feeType.name}" is ${feeType.max_quantity_per_order}.` };
      }
    }

    // --- 6. Calculate total and build Stripe line items ---
    let totalCents = 0;
    const stripeLineItems: Array<{
      price_data: {
        currency: 'usd';
        unit_amount: number;
        product_data: { name: string; description?: string };
      };
      quantity: number;
    }> = [];

    for (const item of input.items) {
      const feeType = feeTypeMap.get(item.feeTypeId.trim())!;
      const itemTotal = feeType.price_cents * item.quantity;
      totalCents += itemTotal;

      stripeLineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: feeType.price_cents,
          product_data: {
            name: feeType.name,
            description: feeType.description || feeType.category,
          },
        },
        quantity: item.quantity,
      });
    }

    // --- 7. Create Stripe Checkout Session ---
    const stripe = getStripeServer();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const successUrl = memberId
      ? `${appUrl}/member/checkout/success?session_id={CHECKOUT_SESSION_ID}`
      : `${appUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = memberId
      ? `${appUrl}/member/checkout/cancel?return=fees`
      : `${appUrl}/purchase/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(customerId ? { customer: customerId } : { customer_email: purchaserEmail }),
      line_items: stripeLineItems,
      metadata: {
        payment_type: 'additional_fees',
        member_id: memberId ?? '',
        guest_email: purchaserEmail,
        guest_name: purchaserName,
        show_id: input.showId ?? '',
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      return { error: 'Unable to create checkout session. Please try again.' };
    }

    // --- 8. Insert pending payment record ---
    const { data: paymentRecord, error: paymentError } = await adminClient
      .from('payments')
      .insert({
        member_id: memberId,
        guest_email: memberId ? null : purchaserEmail,
        guest_name: memberId ? null : purchaserName,
        amount_cents: totalCents,
        payment_type: 'additional_fees',
        membership_type_slug: null,
        stripe_checkout_session_id: session.id,
        status: 'pending',
        description: 'SWMRHA Additional Fee Purchase',
      })
      .select('id')
      .single();

    if (paymentError) {
      console.error('Failed to insert fee payment record:', paymentError.message);
      // Continue -- the webhook will handle fulfillment
    }

    const paymentRecordId = paymentRecord?.id as string | undefined;

    // --- 9. Insert fee_purchase records ---
    if (paymentRecordId) {
      const purchaseRecords = input.items.map((item) => {
        const feeType = feeTypeMap.get(item.feeTypeId.trim())!;
        return {
          payment_id: paymentRecordId,
          fee_type_id: feeType.id,
          quantity: item.quantity,
          unit_price_cents: feeType.price_cents,
          total_cents: feeType.price_cents * item.quantity,
          show_id: input.showId ?? null,
          purchaser_name: purchaserName,
          purchaser_email: purchaserEmail,
          status: 'pending',
        };
      });

      const { error: purchaseError } = await adminClient
        .from('fee_purchases')
        .insert(purchaseRecords);

      if (purchaseError) {
        console.error('Failed to insert fee purchase records:', purchaseError.message);
        // Continue -- the webhook will handle fulfillment
      }
    }

    // --- 10. Return checkout URL ---
    return { url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Fee checkout session creation failed:', message);
    return { error: 'Unable to start checkout. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// Fee Purchase Queries
// ---------------------------------------------------------------------------

/**
 * Fetch fee purchases by payment ID. Uses admin client for access.
 * Used by success pages to display purchase confirmation details.
 */
export async function getFeePurchasesByPayment(
  paymentId: string,
): Promise<FeePurchaseRow[]> {
  if (!paymentId || paymentId.trim() === '') {
    return [];
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('fee_purchases')
    .select('*')
    .eq('payment_id', paymentId);

  if (error) {
    console.error('Failed to fetch fee purchases:', error.message);
    return [];
  }

  return (data as FeePurchaseRow[]) ?? [];
}
