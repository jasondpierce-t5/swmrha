import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getShow } from '@/lib/actions/shows';
import ShowClassForm from '@/components/ShowClassForm';

export default async function AdminNewShowClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getShow(id);

  if (!show || 'error' in show) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href={`/admin/shows/${id}/classes`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Classes
        </Link>
        <h2 className="font-heading text-2xl font-bold text-white">
          Add Class to {show.name}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Define a new class for this show
        </p>
      </div>

      <ShowClassForm showId={id} action="create" />
    </div>
  );
}
