'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteShow } from '@/lib/actions/shows';

interface DeleteShowButtonProps {
  showId: string;
  showName: string;
}

export default function DeleteShowButton({ showId, showName }: DeleteShowButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${showName}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteShow(showId);
      if ('success' in result) {
        router.push('/admin/shows?success=deleted');
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
