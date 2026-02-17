'use client';

import { useTransition } from 'react';
import { deleteResult } from '@/lib/actions/results';

interface DeleteResultButtonProps {
  resultId: string;
  resultLabel: string;
}

export default function DeleteResultButton({ resultId, resultLabel }: DeleteResultButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${resultLabel}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      await deleteResult(resultId);
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
