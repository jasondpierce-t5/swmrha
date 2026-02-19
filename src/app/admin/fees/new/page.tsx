import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getShows } from '@/lib/actions/shows';
import FeeItemForm from '@/components/FeeItemForm';

export default async function AdminNewFeeItemPage() {
  const showsResult = await getShows();
  const shows = Array.isArray(showsResult)
    ? showsResult.map((s) => ({ id: s.id, name: s.name }))
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href="/admin/fees"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Fee Items
        </Link>
        <h2 className="font-heading text-2xl font-bold text-white">
          Add Fee Item
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Create a new fee item for stall fees, banquet tickets, vendor spaces, or other charges
        </p>
      </div>

      <FeeItemForm shows={shows} action="create" />
    </div>
  );
}
