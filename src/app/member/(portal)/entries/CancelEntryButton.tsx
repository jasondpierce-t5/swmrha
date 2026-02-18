'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cancelShowEntry } from '@/lib/actions/show-entries';

interface CancelEntryButtonProps {
  entryId: string;
}

export default function CancelEntryButton({ entryId }: CancelEntryButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this entry? This action cannot be undone.',
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const result = await cancelShowEntry(entryId);

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.refresh();
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
        onClick={handleCancel}
        disabled={loading}
        className="text-xs text-red-400 transition-colors hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Cancelling...' : 'Cancel'}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
