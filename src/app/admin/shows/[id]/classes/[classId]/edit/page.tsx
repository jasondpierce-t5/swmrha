import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getShow } from '@/lib/actions/shows';
import { getShowClass } from '@/lib/actions/show-classes';
import ShowClassForm from '@/components/ShowClassForm';
import DeleteShowClassButton from '@/components/DeleteShowClassButton';

export default async function AdminEditShowClassPage({
  params,
}: {
  params: Promise<{ id: string; classId: string }>;
}) {
  const { id, classId } = await params;

  const show = await getShow(id);
  if (!show || 'error' in show) {
    notFound();
  }

  const showClass = await getShowClass(classId);
  if (!showClass || 'error' in showClass) {
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
          Edit {showClass.name}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Update class details for &ldquo;{show.name}&rdquo;
        </p>
      </div>

      <ShowClassForm showId={id} showClass={showClass} action="edit" />

      {/* Delete section */}
      <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-6">
        <h3 className="mb-2 text-sm font-semibold text-red-400">Danger Zone</h3>
        <p className="mb-4 text-sm text-gray-400">
          Permanently delete this class. This action cannot be undone.
        </p>
        <DeleteShowClassButton
          classId={showClass.id}
          className={showClass.name}
          showId={id}
        />
      </div>
    </div>
  );
}
