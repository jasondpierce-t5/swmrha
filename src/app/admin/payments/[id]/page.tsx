import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getPaymentByIdAdmin } from '@/lib/actions/admin-payments';
import RefundPaymentButton from '@/components/RefundPaymentButton';

// ---------------------------------------------------------------------------
// Local badge components
// ---------------------------------------------------------------------------

/** Color-coded badge for payment type. */
function PaymentTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    membership_dues: 'border-gold-500/30 bg-gold-500/10 text-gold-500',
    membership_renewal: 'border-gold-500/30 bg-gold-500/10 text-gold-500',
    entry_fees: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    additional_fees: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  };

  const labelMap: Record<string, string> = {
    membership_dues: 'Membership Dues',
    membership_renewal: 'Membership Renewal',
    entry_fees: 'Entry Fees',
    additional_fees: 'Additional Fees',
  };

  const colors = colorMap[type] ?? 'border-navy-600 bg-navy-700 text-gray-300';
  const label = labelMap[type] ?? type;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {label}
    </span>
  );
}

/** Color-coded badge for payment status. */
function PaymentStatusBadge({ status, large }: { status: string; large?: boolean }) {
  const colorMap: Record<string, string> = {
    succeeded: 'border-green-700 bg-green-900/50 text-green-300',
    pending: 'border-yellow-700 bg-yellow-900/50 text-yellow-300',
    failed: 'border-red-700 bg-red-900/50 text-red-300',
    refunded: 'border-blue-700 bg-blue-900/50 text-blue-300',
  };

  const colors = colorMap[status] ?? 'border-navy-600 bg-navy-700 text-gray-300';
  const sizeClass = large ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium capitalize ${colors} ${sizeClass}`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function truncateId(id: string, maxLength = 16): string {
  if (id.length <= maxLength) return id;
  return id.slice(0, maxLength) + '...';
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function AdminPaymentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;

  const result = await getPaymentByIdAdmin(id);

  if (!result || 'error' in result) {
    notFound();
  }

  const { payment, show_entries, fee_purchases } = result;

  const successMessages: Record<string, string> = {
    refunded: 'Payment refunded successfully.',
  };
  const successMessage = success ? successMessages[success] : null;

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/admin/payments"
        className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Payments
      </Link>

      {/* Success banner */}
      {successMessage && (
        <div className="rounded-lg border border-green-700 bg-green-900/20 p-4">
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Payment header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Payment {truncateId(payment.id)}
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Created {formatDate(payment.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <PaymentStatusBadge status={payment.status} large />
          <span className="text-2xl font-bold text-gold-500">
            {formatCents(payment.amount_cents)}
          </span>
        </div>
      </div>

      {/* Payment info card */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold-500">Payment Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Payment Type</p>
            <div className="mt-1">
              <PaymentTypeBadge type={payment.payment_type} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Amount</p>
            <p className="mt-1 text-sm font-medium text-white">
              {formatCents(payment.amount_cents)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Status</p>
            <div className="mt-1">
              <PaymentStatusBadge status={payment.status} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Stripe Checkout Session</p>
            {payment.stripe_checkout_session_id ? (
              <p
                className="mt-1 truncate font-mono text-sm text-gray-300"
                title={payment.stripe_checkout_session_id}
              >
                {truncateId(payment.stripe_checkout_session_id, 28)}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">N/A</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Stripe Payment Intent</p>
            {payment.stripe_payment_intent_id ? (
              <p
                className="mt-1 truncate font-mono text-sm text-gray-300"
                title={payment.stripe_payment_intent_id}
              >
                {truncateId(payment.stripe_payment_intent_id, 28)}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">N/A</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Description</p>
            <p className="mt-1 text-sm text-gray-300">
              {payment.description ?? 'No description'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Created</p>
            <p className="mt-1 text-sm text-gray-300">{formatDate(payment.created_at)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Updated</p>
            <p className="mt-1 text-sm text-gray-300">{formatDate(payment.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Payer info card */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold-500">Payer Information</h3>
        {payment.member_id ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Name</p>
              <p className="mt-1 text-sm font-medium text-white">{payment.payer_name}</p>
            </div>
            {payment.payer_email && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">Email</p>
                <p className="mt-1 text-sm text-gray-300">{payment.payer_email}</p>
              </div>
            )}
            <div>
              <Link
                href={`/admin/members/${payment.member_id}/edit`}
                className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
              >
                View Member Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                Guest Purchase
              </span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Name</p>
              <p className="mt-1 text-sm font-medium text-white">{payment.payer_name}</p>
            </div>
            {payment.payer_email && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">Email</p>
                <p className="mt-1 text-sm text-gray-300">{payment.payer_email}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related items section */}
      {payment.payment_type === 'entry_fees' && show_entries.length > 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gold-500">Show Entries</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy-700">
                <tr>
                  <th className="px-4 py-2 font-semibold text-gray-400">Horse</th>
                  <th className="px-4 py-2 font-semibold text-gray-400">Rider</th>
                  <th className="px-4 py-2 font-semibold text-gray-400">Status</th>
                  <th className="px-4 py-2 font-semibold text-gray-400">Classes</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-400">Entry Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {show_entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 font-medium text-white">{entry.horse_name}</td>
                    <td className="px-4 py-3 text-gray-300">{entry.rider_name}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-gray-300">{entry.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {entry.show_entry_classes.length} class
                      {entry.show_entry_classes.length !== 1 ? 'es' : ''}
                      {entry.show_entry_classes.length > 0 && (
                        <span className="ml-1 text-gray-500">
                          (
                          {entry.show_entry_classes
                            .map((c) => formatCents(c.fee_cents))
                            .join(', ')}
                          )
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">
                      {formatCents(entry.total_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {payment.payment_type === 'additional_fees' && fee_purchases.length > 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gold-500">Fee Purchases</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy-700">
                <tr>
                  <th className="px-4 py-2 font-semibold text-gray-400">Purchaser</th>
                  <th className="px-4 py-2 font-semibold text-gray-400">Quantity</th>
                  <th className="px-4 py-2 font-semibold text-gray-400">Unit Price</th>
                  <th className="px-4 py-2 font-semibold text-gray-400">Status</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-400">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {fee_purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-white">{purchase.purchaser_name}</span>
                      <span className="block text-xs text-gray-400">{purchase.purchaser_email}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{purchase.quantity}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {formatCents(purchase.unit_price_cents)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-gray-300">{purchase.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">
                      {formatCents(purchase.total_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(payment.payment_type === 'membership_dues' ||
        payment.payment_type === 'membership_renewal') && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gold-500">Membership Details</h3>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Membership Plan</p>
            <p className="mt-1 text-sm font-medium text-white">
              {payment.membership_type_slug ?? 'Unknown plan'}
            </p>
          </div>
        </div>
      )}

      {/* Refund section */}
      {payment.status === 'succeeded' && payment.stripe_payment_intent_id && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gold-500">Refund</h3>
          <p className="mb-4 text-sm text-gray-400">
            Issue a full refund for this payment via Stripe. This action cannot be undone.
          </p>
          <RefundPaymentButton
            paymentId={payment.id}
            amount={formatCents(payment.amount_cents)}
          />
        </div>
      )}

      {payment.status === 'refunded' && (
        <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-4">
          <p className="text-sm text-blue-300">
            This payment has been refunded.
          </p>
        </div>
      )}
    </div>
  );
}
