import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlusIcon, PencilSquareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getShow } from '@/lib/actions/shows';
import { getShowClasses } from '@/lib/actions/show-classes';
import DeleteShowClassButton from '@/components/DeleteShowClassButton';

export default async function AdminShowClassesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { id } = await params;
  const { success, error } = await searchParams;

  const show = await getShow(id);
  if (!show || 'error' in show) {
    notFound();
  }

  const result = await getShowClasses(id);
  const isError = !Array.isArray(result) && 'error' in result;
  const classes = Array.isArray(result) ? result : [];

  const successMessage = success ?? null;
  const errorMessage = error ?? null;

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">
              {show.name} &mdash; Classes
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Manage classes and pricing for this show
            </p>
          </div>
          <Link
            href={`/admin/shows/${id}/classes/new`}
            className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
          >
            <PlusIcon className="h-5 w-5" />
            Add Class
          </Link>
        </div>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="rounded-lg border border-green-700 bg-green-900/20 p-4">
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error banner */}
      {errorMessage && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Error state from data fetch */}
      {isError && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">
            Failed to load classes: {(result as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && classes.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-gray-400">
            No classes defined for this show yet.{' '}
            <Link
              href={`/admin/shows/${id}/classes/new`}
              className="font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Add classes
            </Link>{' '}
            to enable show entries.
          </p>
        </div>
      )}

      {/* Classes table */}
      {classes.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Fee</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Level</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Sort Order</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {classes.map((cls) => (
                <tr
                  key={cls.id}
                  className="transition-colors hover:bg-navy-700/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{cls.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    ${(cls.fee_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {cls.level || <span className="text-gray-500">&mdash;</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{cls.sort_order}</td>
                  <td className="px-4 py-3">
                    {cls.is_active ? (
                      <span className="inline-flex items-center rounded-full bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-700/30 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/shows/${id}/classes/${cls.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteShowClassButton
                        classId={cls.id}
                        className={cls.name}
                        showId={id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
