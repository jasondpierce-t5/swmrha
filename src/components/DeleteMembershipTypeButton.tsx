'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMembershipType } from '@/lib/actions/membership-types';

interface DeleteMembershipTypeButtonProps {
  membershipTypeId: string;
  membershipTypeName: string;
}

export default function DeleteMembershipTypeButton({
  membershipTypeId,
  membershipTypeName,
}: DeleteMembershipTypeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${membershipTypeName}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteMembershipType(membershipTypeId);
      if ('success' in result) {
        router.push('/admin/membership-types?success=deleted');
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
