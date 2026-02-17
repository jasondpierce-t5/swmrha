import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SponsorForm from '@/components/SponsorForm';

export default function AdminNewSponsorPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href="/admin/sponsors"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Sponsors
        </Link>
        <h2 className="font-heading text-2xl font-bold text-white">
          Add New Sponsor
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Create a new sponsor listing
        </p>
      </div>

      <SponsorForm action="create" />
    </div>
  );
}
