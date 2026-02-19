'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { processRefund } from '@/lib/actions/admin-payments';

interface RefundPaymentButtonProps {
  paymentId: string;
  /** Formatted dollar amount for display, e.g. "$25.00" */
  amount: string;
}

export default function RefundPaymentButton({ paymentId, amount }: RefundPaymentButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (
      !window.confirm(
        `Are you sure you want to refund ${amount}? This will issue a full refund via Stripe and cannot be undone.`,
      )
    ) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await processRefund(paymentId);

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push(`/admin/payments/${paymentId}?success=refunded`);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Processing Refund...' : `Refund ${amount}`}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
