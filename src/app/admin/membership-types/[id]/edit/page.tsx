import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getMembershipType } from '@/lib/actions/membership-types';
import MembershipTypeForm from '@/components/MembershipTypeForm';

export default async function AdminEditMembershipTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getMembershipType(id);

  if (!result || 'error' in result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href="/admin/membership-types"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Membership Types
        </Link>
        <h2 className="font-heading text-2xl font-bold text-white">
          Edit Membership Type
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Update the details for &ldquo;{result.name}&rdquo;
        </p>
      </div>

      <MembershipTypeForm membershipType={result} action="edit" />
    </div>
  );
}
