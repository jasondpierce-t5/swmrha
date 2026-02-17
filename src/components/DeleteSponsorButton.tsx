'use client';

import { useTransition } from 'react';
import { deleteSponsor } from '@/lib/actions/sponsors';

interface DeleteSponsorButtonProps {
  sponsorId: string;
  sponsorName: string;
}

export default function DeleteSponsorButton({ sponsorId, sponsorName }: DeleteSponsorButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${sponsorName}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      await deleteSponsor(sponsorId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
