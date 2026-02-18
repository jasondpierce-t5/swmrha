'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMember } from '@/lib/actions/admin-members';

interface DeleteMemberButtonProps {
  memberId: string;
  memberName: string;
}

export default function DeleteMemberButton({ memberId, memberName }: DeleteMemberButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete member ${memberName}? This will remove their account and cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteMember(memberId);
      if ('success' in result) {
        router.push('/admin/members?success=deleted');
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
