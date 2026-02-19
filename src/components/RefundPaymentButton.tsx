'use client';

/**
 * Placeholder: full implementation added in Task 2 (21-02).
 */
export default function RefundPaymentButton({
  paymentId: _paymentId,
  amount: _amount,
}: {
  paymentId: string;
  amount: string;
}) {
  return (
    <button
      type="button"
      disabled
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
    >
      Refund (loading...)
    </button>
  );
}
