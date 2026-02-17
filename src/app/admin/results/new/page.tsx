import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ResultForm from '@/components/ResultForm';

export default function AdminNewResultPage() {
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
          Add New Result
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Add a new result or standings link
        </p>
      </div>

      <ResultForm action="create" />
    </div>
  );
}
