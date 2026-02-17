import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getSponsor } from '@/lib/actions/sponsors';
import SponsorForm from '@/components/SponsorForm';

export default async function AdminEditSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSponsor(id);

  if (!result || 'error' in result) {
    notFound();
  }

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
          Edit Sponsor
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Update the details for &ldquo;{result.name}&rdquo;
        </p>
      </div>

      <SponsorForm sponsor={result} action="edit" />
    </div>
  );
}
