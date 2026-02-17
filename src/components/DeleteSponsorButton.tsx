'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSponsor } from '@/lib/actions/sponsors';

interface DeleteSponsorButtonProps {
  sponsorId: string;
  sponsorName: string;
}

export default function DeleteSponsorButton({ sponsorId, sponsorName }: DeleteSponsorButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${sponsorName}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteSponsor(sponsorId);
      if ('success' in result) {
        router.push('/admin/sponsors?success=deleted');
      }
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
