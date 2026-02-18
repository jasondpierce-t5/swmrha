import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getMemberById } from '@/lib/actions/admin-members';
import { getMembershipTypes } from '@/lib/actions/membership-types';
import AdminMemberForm from '@/components/AdminMemberForm';
import DeleteMemberButton from '@/components/DeleteMemberButton';

export default async function AdminEditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [memberResult, typesResult] = await Promise.all([
    getMemberById(id),
    getMembershipTypes(),
  ]);

  if (!memberResult || 'error' in memberResult) {
    notFound();
  }

  const membershipTypes = Array.isArray(typesResult) ? typesResult : [];
  const fullName = `${memberResult.first_name} ${memberResult.last_name}`.trim();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href="/admin/members"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Members
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">
              Edit Member: {fullName}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {memberResult.email}
            </p>
          </div>
          <DeleteMemberButton
            memberId={memberResult.id}
            memberName={fullName}
          />
        </div>
      </div>

      <AdminMemberForm member={memberResult} membershipTypes={membershipTypes} />
    </div>
  );
}
