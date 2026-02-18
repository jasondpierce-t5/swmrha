import Link from 'next/link';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { getMemberPayments } from '@/lib/actions/payments';
import type { PaymentRow } from '@/types/database';

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

/** Humanize payment_type field. */
function humanizePaymentType(paymentType: string): string {
  const map: Record<string, string> = {
    membership_dues: 'Membership Dues',
    membership_renewal: 'Membership Renewal',
  };
  return map[paymentType] ?? paymentType.replace(/_/g, ' ');
}

/** Format cents to dollar string. */
function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Format date string to readable date. */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Single payment row for the table (desktop). */
function PaymentTableRow({ payment }: { payment: PaymentRow }) {
  return (
    <tr className="border-b border-navy-700 last:border-b-0">
      <td className="whitespace-nowrap px-4 py-3 text-sm text-white">
        {formatDate(payment.created_at)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-300">
        {payment.description ?? humanizePaymentType(payment.payment_type)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
        {formatAmount(payment.amount_cents)}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <PaymentStatusBadge status={payment.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-400">
        {humanizePaymentType(payment.payment_type)}
      </td>
    </tr>
  );
}

/** Single payment card for mobile view. */
function PaymentCard({ payment }: { payment: PaymentRow }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-800 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          {formatAmount(payment.amount_cents)}
        </span>
        <PaymentStatusBadge status={payment.status} />
      </div>
      <p className="mt-2 text-sm text-gray-300">
        {payment.description ?? humanizePaymentType(payment.payment_type)}
      </p>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>{formatDate(payment.created_at)}</span>
        <span>{humanizePaymentType(payment.payment_type)}</span>
      </div>
    </div>
  );
}

export default async function MemberPaymentsPage() {
  const result = await getMemberPayments();

  // Error state
  if (!Array.isArray(result)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Payment History
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            View your membership payments and show entry transactions.
          </p>
        </div>
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-6">
          <p className="text-sm text-red-200">{result.error}</p>
        </div>
      </div>
    );
  }

  const payments = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          View your membership payments and show entry transactions.
        </p>
      </div>

      {payments.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-lg border border-navy-700 bg-navy-800 md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <PaymentTableRow key={payment.id} payment={payment} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {payments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCardIcon className="h-16 w-16 text-navy-600" />
            <h2 className="mt-4 font-heading text-lg font-semibold text-white">
              No Payments Yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              Your payment history will appear here once you make a membership
              payment or show entry.
            </p>
            <Link
              href="/member/pay-dues"
              className="mt-6 rounded-lg border border-navy-700 px-4 py-2.5 text-sm font-medium text-gold-500 transition-colors hover:border-gold-500/30 hover:bg-gold-500/10"
            >
              Pay Membership Dues
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
