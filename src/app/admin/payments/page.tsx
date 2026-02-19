import Link from 'next/link';
import { CreditCardIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getPaymentsAdmin, getPaymentsSummary } from '@/lib/actions/admin-payments';

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
    membership_dues: 'Membership',
    membership_renewal: 'Renewal',
    entry_fees: 'Entry Fees',
    additional_fees: 'Add. Fees',
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
function PaymentStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    succeeded: 'border-green-700 bg-green-900/50 text-green-300',
    pending: 'border-yellow-700 bg-yellow-900/50 text-yellow-300',
    failed: 'border-red-700 bg-red-900/50 text-red-300',
    refunded: 'border-blue-700 bg-blue-900/50 text-blue-300',
  };

  const colors = colorMap[status] ?? 'border-navy-600 bg-navy-700 text-gray-300';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const [paymentsResult, summaryResult] = await Promise.all([
    getPaymentsAdmin(),
    getPaymentsSummary(),
  ]);

  const successMessages: Record<string, string> = {
    refunded: 'Payment refunded successfully',
  };
  const successMessage = success ? successMessages[success] : null;

  const isPaymentsError = !Array.isArray(paymentsResult) && 'error' in paymentsResult;
  const payments = Array.isArray(paymentsResult) ? paymentsResult : [];

  const isSummaryError = !Array.isArray(summaryResult) && 'error' in summaryResult;
  const summary =
    !isSummaryError && summaryResult && !('error' in summaryResult) ? summaryResult : null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-white">Payments</h2>
        <p className="mt-1 text-sm text-gray-400">
          View all payment activity across memberships, show entries, and additional fees
        </p>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="rounded-lg border border-green-700 bg-green-900/20 p-4">
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
            <div className="flex items-start justify-between">
              <div>
                <CreditCardIcon className="h-8 w-8 text-gold-500" />
                <p className="mt-4 text-3xl font-bold text-gold-500">
                  ${(summary.total_revenue_cents / 100).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-400">Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Total Payments */}
          <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
            <div>
              <p className="text-3xl font-bold text-white">{summary.total_count}</p>
              <p className="mt-1 text-sm text-gray-400">Total Payments</p>
            </div>
          </div>

          {/* Payments by Type */}
          <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
            <p className="text-sm font-semibold text-gray-400">By Type</p>
            <div className="mt-2 space-y-1 text-sm">
              {Object.entries(summary.count_by_type).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <PaymentTypeBadge type={type} />
                  <span className="font-medium text-white">{count}</span>
                </div>
              ))}
              {Object.keys(summary.count_by_type).length === 0 && (
                <p className="text-gray-500">No payments yet</p>
              )}
            </div>
          </div>

          {/* Payments by Status */}
          <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
            <p className="text-sm font-semibold text-gray-400">By Status</p>
            <div className="mt-2 space-y-1 text-sm">
              {Object.entries(summary.count_by_status).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <PaymentStatusBadge status={status} />
                  <span className="font-medium text-white">{count}</span>
                </div>
              ))}
              {Object.keys(summary.count_by_status).length === 0 && (
                <p className="text-gray-500">No payments yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {isPaymentsError && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">
            Failed to load payments: {(paymentsResult as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isPaymentsError && payments.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-gray-400">
            No payments recorded yet. Payments will appear here when members or guests complete
            checkout.
          </p>
        </div>
      )}

      {/* Payments table */}
      {payments.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Date</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Payer</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Type</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Amount</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {payments.map((payment) => (
                <tr key={payment.id} className="transition-colors hover:bg-navy-700/50">
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-bold text-white">{payment.payer_name}</span>
                      {!payment.member_id && (
                        <span className="ml-2 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400">
                          Guest
                        </span>
                      )}
                    </div>
                    {payment.payer_email && (
                      <span className="block text-sm text-gray-400">{payment.payer_email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentTypeBadge type={payment.payment_type} />
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    ${(payment.amount_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/admin/payments/${payment.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
