import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getShow } from '@/lib/actions/shows';
import ShowForm from '@/components/ShowForm';

export default async function AdminEditShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getShow(id);

  if (!result || 'error' in result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href="/admin/shows"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Shows
        </Link>
        <h2 className="font-heading text-2xl font-bold text-white">
          Edit Show
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Update the details for &ldquo;{result.name}&rdquo;
        </p>
      </div>

      <ShowForm show={result} action="edit" />
    </div>
  );
}
