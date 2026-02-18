'use client';

import { useState } from 'react';
import { createCheckoutSession } from '@/lib/actions/checkout';

interface CheckoutButtonProps {
  membershipTypeSlug: string;
  label?: string;
  className?: string;
}

export default function CheckoutButton({
  membershipTypeSlug,
  label = 'Pay Now',
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const result = await createCheckoutSession(membershipTypeSlug);

      if ('error' in result) {
        setError(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const defaultClassName =
    'block w-full rounded-lg bg-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className ?? defaultClassName}
      >
        {loading ? 'Processing...' : label}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
