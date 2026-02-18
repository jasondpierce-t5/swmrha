'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeServer } from '@/lib/stripe/server';
import type { MemberRow, MembershipTypeRow } from '@/types/database';

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

/**
 * Determine payment type based on the member's current membership status.
 * - 'pending' members are paying initial dues
 * - 'active' or 'expired' members are renewing
 */
function resolvePaymentType(membershipStatus: string): 'membership_dues' | 'membership_renewal' {
  if (membershipStatus === 'active' || membershipStatus === 'expired') {
    return 'membership_renewal';
  }
  return 'membership_dues';
}

// ---------------------------------------------------------------------------
// Checkout session
// ---------------------------------------------------------------------------

/**
 * Create a Stripe Checkout Session for membership dues/renewal.
 *
 * Flow:
 * 1. Authenticate user and fetch member profile
 * 2. Fetch membership type by slug (must be active)
 * 3. Create or retrieve Stripe customer
 * 4. Create Stripe Checkout Session
 * 5. Insert pending payment record
 * 6. Return checkout URL
 */
export async function createCheckoutSession(
  membershipTypeSlug: string,
): Promise<{ url: string } | { error: string }> {
  // --- Input validation ---
  if (!membershipTypeSlug || membershipTypeSlug.trim() === '') {
    return { error: 'Membership type is required.' };
  }

  const slug = membershipTypeSlug.trim();

  try {
    // --- 1. Authenticate user ---
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'You must be signed in to proceed.' };
    }

    // --- 2. Get member profile ---
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('id', user.id)
      .single();

    if (memberError || !member) {
      return { error: 'Unable to load your profile. Please try again.' };
    }

    const memberRow = member as MemberRow;

    // --- 3. Get membership type ---
    const { data: membershipType, error: typeError } = await supabase
      .from('membership_types')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (typeError || !membershipType) {
      return { error: 'This membership type is not available.' };
    }

    const typeRow = membershipType as MembershipTypeRow;

    if (typeRow.price_cents <= 0) {
      return { error: 'This membership type does not require payment.' };
    }

    // --- 4. Create or retrieve Stripe customer ---
    const stripe = getStripeServer();
    const adminClient = createAdminClient();
    let customerId = memberRow.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: memberRow.email,
        name: `${memberRow.first_name} ${memberRow.last_name}`,
        metadata: {
          member_id: memberRow.id,
        },
      });
      customerId = customer.id;

      // Store the new customer ID in the members table
      const { error: updateError } = await adminClient
        .from('members')
        .update({ stripe_customer_id: customerId })
        .eq('id', memberRow.id);

      if (updateError) {
        console.error('Failed to store Stripe customer ID:', updateError.message);
        // Continue anyway — the checkout can still proceed
      }
    }

    // --- 5. Create Stripe Checkout Session ---
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paymentType = resolvePaymentType(memberRow.membership_status);
    const description = `SWMRHA ${typeRow.name} Membership`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: typeRow.price_cents,
            product_data: {
              name: description,
              description: typeRow.description || undefined,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        member_id: memberRow.id,
        membership_type_slug: typeRow.slug,
        payment_type: paymentType,
      },
      success_url: `${appUrl}/member/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/member/checkout/cancel`,
    });

    if (!session.url) {
      return { error: 'Unable to create checkout session. Please try again.' };
    }

    // --- 6. Insert pending payment record ---
    const { error: insertError } = await adminClient.from('payments').insert({
      member_id: memberRow.id,
      amount_cents: typeRow.price_cents,
      payment_type: paymentType,
      membership_type_slug: typeRow.slug,
      stripe_checkout_session_id: session.id,
      status: 'pending',
      description,
    });

    if (insertError) {
      console.error('Failed to insert payment record:', insertError.message);
      // Continue — the Stripe session exists and the webhook will handle fulfillment
    }

    return { url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Checkout session creation failed:', message);
    return { error: 'Unable to start checkout. Please try again.' };
  }
}
