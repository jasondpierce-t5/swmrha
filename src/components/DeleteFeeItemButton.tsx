'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFeeItem } from '@/lib/actions/fee-items';

interface DeleteFeeItemButtonProps {
  feeItemId: string;
  feeItemName: string;
}

export default function DeleteFeeItemButton({
  feeItemId,
  feeItemName,
}: DeleteFeeItemButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${feeItemName}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteFeeItem(feeItemId);
      if ('success' in result) {
        router.push('/admin/fees?success=deleted');
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
