'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeServer } from '@/lib/stripe/server';
import type {
  MemberRow,
  ShowEntryRow,
  ShowEntryClassRow,
  ShowClassRow,
} from '@/types/database';

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

// ---------------------------------------------------------------------------
// Entry Checkout Session
// ---------------------------------------------------------------------------

/**
 * Create a Stripe Checkout Session for show entry fees.
 *
 * Flow:
 * 1. Validate input: entryIds non-empty, each trimmed and non-blank
 * 2. Authenticate user
 * 3. Fetch member profile for Stripe customer creation/reuse
 * 4. Fetch entries (must be draft/pending_payment, owned by user, same show)
 * 5. Fetch show name for line item descriptions
 * 6. Fetch entry classes and class names for descriptions
 * 7. Create or retrieve Stripe customer
 * 8. Build multi-line-item Stripe Checkout Session
 * 9. Insert pending payment record
 * 10. Update entries to pending_payment status
 * 11. Revalidate paths
 * 12. Return checkout URL
 */
export async function createEntryCheckoutSession(
  entryIds: string[],
): Promise<{ url: string } | { error: string }> {
  // --- 1. Input validation ---
  if (!entryIds || entryIds.length === 0) {
    return { error: 'At least one entry is required.' };
  }

  const trimmedIds = entryIds.map((id) => id?.trim()).filter((id) => id && id.length > 0);
  if (trimmedIds.length !== entryIds.length) {
    return { error: 'Invalid entry ID provided.' };
  }

  try {
    // --- 2. Authenticate user ---
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'You must be signed in to proceed.' };
    }

    // --- 3. Get member profile ---
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('id', user.id)
      .single();

    if (memberError || !member) {
      return { error: 'Unable to load your profile. Please try again.' };
    }

    const memberRow = member as MemberRow;

    // --- 4. Fetch entries via admin client ---
    const adminClient = createAdminClient();

    const { data: entries, error: entriesError } = await adminClient
      .from('show_entries')
      .select('*')
      .in('id', trimmedIds)
      .eq('member_id', user.id)
      .in('status', ['draft', 'pending_payment']);

    if (entriesError) {
      return { error: sanitizeSupabaseError(entriesError) };
    }

    if (!entries || entries.length !== trimmedIds.length) {
      return { error: 'One or more entries are not available for checkout. Please check your entries and try again.' };
    }

    const entryRows = entries as ShowEntryRow[];

    // Verify all entries share the same show_id
    const showIds = [...new Set(entryRows.map((e) => e.show_id))];
    if (showIds.length !== 1) {
      return { error: 'All entries must be for the same show.' };
    }

    const showId = showIds[0];

    // --- 5. Fetch show name ---
    const { data: show, error: showError } = await adminClient
      .from('shows')
      .select('id, name')
      .eq('id', showId)
      .single();

    if (showError || !show) {
      return { error: 'Unable to load show information. Please try again.' };
    }

    const showName = show.name as string;

    // --- 6. Fetch entry classes and class names ---
    const { data: entryClasses, error: ecError } = await adminClient
      .from('show_entry_classes')
      .select('*')
      .in('entry_id', trimmedIds);

    if (ecError) {
      return { error: sanitizeSupabaseError(ecError) };
    }

    const entryClassRows = (entryClasses as ShowEntryClassRow[]) ?? [];

    // Group entry classes by entry_id
    const entryClassMap = new Map<string, ShowEntryClassRow[]>();
    for (const ec of entryClassRows) {
      const existing = entryClassMap.get(ec.entry_id) ?? [];
      existing.push(ec);
      entryClassMap.set(ec.entry_id, existing);
    }

    // Fetch class names from show_classes for descriptions
    const allClassIds = [...new Set(entryClassRows.map((ec) => ec.class_id))];
    let classNameMap = new Map<string, string>();

    if (allClassIds.length > 0) {
      const { data: showClasses, error: scError } = await adminClient
        .from('show_classes')
        .select('id, name')
        .in('id', allClassIds);

      if (!scError && showClasses) {
        for (const sc of showClasses as Pick<ShowClassRow, 'id' | 'name'>[]) {
          classNameMap.set(sc.id, sc.name);
        }
      }
    }

    // --- 7. Create or retrieve Stripe customer ---
    const stripe = getStripeServer();
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

      // Store the new customer ID in the members table (best-effort)
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

    // --- 8. Build Stripe Checkout Session ---
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Build one line item per entry
    const lineItems = entryRows.map((entry) => {
      const classes = entryClassMap.get(entry.id) ?? [];
      const classNames = classes
        .map((ec) => classNameMap.get(ec.class_id) ?? 'Unknown Class')
        .join(', ');

      return {
        price_data: {
          currency: 'usd' as const,
          unit_amount: entry.total_cents,
          product_data: {
            name: `${entry.horse_name} / ${entry.rider_name}`,
            description: classNames || undefined,
          },
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: lineItems,
      metadata: {
        member_id: memberRow.id,
        payment_type: 'entry_fees',
        entry_ids: trimmedIds.join(','),
        show_id: showId,
      },
      success_url: `${appUrl}/member/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/member/checkout/cancel?return=entries`,
    });

    if (!session.url) {
      return { error: 'Unable to create checkout session. Please try again.' };
    }

    // --- 9. Insert pending payment record (best-effort) ---
    const totalAmountCents = entryRows.reduce((sum, e) => sum + e.total_cents, 0);
    const description = `SWMRHA Show Entry Fees - ${showName}`;

    try {
      const { error: insertError } = await adminClient.from('payments').insert({
        member_id: memberRow.id,
        amount_cents: totalAmountCents,
        payment_type: 'entry_fees',
        membership_type_slug: null,
        stripe_checkout_session_id: session.id,
        status: 'pending',
        description,
      });

      if (insertError) {
        console.error('Failed to insert entry payment record:', insertError.message);
      }
    } catch (adminErr) {
      console.error('Admin client unavailable for entry payment record:', adminErr);
      // Continue -- the webhook will handle fulfillment
    }

    // --- 10. Update entries status to pending_payment (best-effort) ---
    try {
      const { error: statusError } = await adminClient
        .from('show_entries')
        .update({ status: 'pending_payment' })
        .in('id', trimmedIds);

      if (statusError) {
        console.error('Failed to update entries to pending_payment:', statusError.message);
      }
    } catch (statusErr) {
      console.error('Failed to update entry statuses:', statusErr);
    }

    // --- 11. Revalidate entry paths ---
    revalidatePath('/member/entries');
    revalidatePath('/member/enter-show');

    // --- 12. Return checkout URL ---
    return { url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Entry checkout session creation failed:', message);
    return { error: 'Unable to start checkout. Please try again.' };
  }
}
