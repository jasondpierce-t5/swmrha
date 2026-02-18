import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import MembershipTypeForm from '@/components/MembershipTypeForm';

export default function AdminNewMembershipTypePage() {
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
          Add Membership Type
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Create a new membership tier with pricing and benefits
        </p>
      </div>

      <MembershipTypeForm action="create" />
    </div>
  );
}
