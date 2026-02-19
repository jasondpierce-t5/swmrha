import type { Metadata } from 'next';
import { getActiveFeeItems } from '@/lib/actions/fee-items';
import { createClient } from '@/lib/supabase/server';
import PurchaseForm from './PurchaseForm';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Purchase Event Fees | SWMRHA',
  description:
    'Purchase stall fees, banquet tickets, and other event charges for SWMRHA shows.',
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PurchasePage() {
  // Fetch active fee items (public, no auth required)
  const feeItemsResult = await getActiveFeeItems();

  const feeItems =
    feeItemsResult && !('error' in feeItemsResult) ? feeItemsResult : [];

  // Optionally detect authenticated user for pre-fill
  let memberInfo: { firstName: string; lastName: string; email: string } | null =
    null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: member } = await supabase
        .from('members')
        .select('first_name, last_name, email')
        .eq('id', user.id)
        .single();

      if (member) {
        memberInfo = {
          firstName: member.first_name as string,
          lastName: member.last_name as string,
          email: member.email as string,
        };
      }
    }
  } catch {
    // Not authenticated or profile not found — proceed as guest
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Purchase Event Fees
        </h1>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Stall fees, banquet tickets, and more
        </p>
      </div>

      {/* No items available */}
      {feeItems.length === 0 ? (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-8 text-center">
          <p className="text-gray-400">
            No fee items are currently available for purchase.
          </p>
        </div>
      ) : (
        <PurchaseForm feeItems={feeItems} memberInfo={memberInfo} />
      )}
    </div>
  );
}
