'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteResult } from '@/lib/actions/results';

interface DeleteResultButtonProps {
  resultId: string;
  resultLabel: string;
}

export default function DeleteResultButton({ resultId, resultLabel }: DeleteResultButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${resultLabel}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteResult(resultId);
      if ('success' in result) {
        router.push('/admin/results?success=deleted');
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
