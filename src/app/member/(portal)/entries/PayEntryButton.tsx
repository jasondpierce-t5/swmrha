'use client';

import { useState } from 'react';
import { createEntryCheckoutSession } from '@/lib/actions/entry-checkout';

interface PayEntryButtonProps {
  entryIds: string[];
}

export default function PayEntryButton({ entryIds }: PayEntryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      const result = await createEntryCheckoutSession(entryIds);

      if ('url' in result) {
        window.location.href = result.url;
        return;
      }

      setError(result.error);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="text-xs font-medium text-gold-500 transition-colors hover:text-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
