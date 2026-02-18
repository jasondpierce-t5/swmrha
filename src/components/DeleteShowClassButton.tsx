'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteShowClass } from '@/lib/actions/show-classes';

interface DeleteShowClassButtonProps {
  classId: string;
  className: string;
  showId: string;
}

export default function DeleteShowClassButton({
  classId,
  className: classDisplayName,
  showId,
}: DeleteShowClassButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (
      !window.confirm(
        `Delete "${classDisplayName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteShowClass(classId);
      if ('success' in result) {
        router.push(
          `/admin/shows/${showId}/classes?success=Class+deleted`,
        );
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
