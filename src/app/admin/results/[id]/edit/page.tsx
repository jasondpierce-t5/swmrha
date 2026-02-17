import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getResult } from '@/lib/actions/results';
import ResultForm from '@/components/ResultForm';

export default async function AdminEditResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result || 'error' in result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href="/admin/results"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Results
        </Link>
        <h2 className="font-heading text-2xl font-bold text-white">
          Edit Result
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Update the details for &ldquo;{result.label}&rdquo;
        </p>
      </div>

      <ResultForm result={result} action="edit" />
    </div>
  );
}
