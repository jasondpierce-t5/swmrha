import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getFeeItems } from '@/lib/actions/fee-items';
import { getShows } from '@/lib/actions/shows';
import FeeItemForm from '@/components/FeeItemForm';

export default async function AdminEditFeeItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, showsResult] = await Promise.all([getFeeItems(), getShows()]);

  // Find the fee item by ID from the list
  const feeItems = Array.isArray(result) ? result : [];
  const feeItem = feeItems.find((item) => item.id === id);

  if (!feeItem) {
    notFound();
  }

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
          Edit Fee Item
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Update the details for &ldquo;{feeItem.name}&rdquo;
        </p>
      </div>

      <FeeItemForm feeItem={feeItem} shows={shows} action="edit" />
    </div>
  );
}
