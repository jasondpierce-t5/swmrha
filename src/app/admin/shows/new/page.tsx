import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ShowForm from '@/components/ShowForm';

export default function AdminNewShowPage() {
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
          Add New Show
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Create a new show event for the schedule
        </p>
      </div>

      <ShowForm action="create" />
    </div>
  );
}
