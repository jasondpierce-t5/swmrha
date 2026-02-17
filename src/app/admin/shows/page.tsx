import Link from 'next/link';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { getShows } from '@/lib/actions/shows';
import DeleteShowButton from '@/components/DeleteShowButton';

export default async function AdminShowsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const result = await getShows();

  const successMessages: Record<string, string> = {
    created: 'Show created successfully',
    updated: 'Show updated successfully',
    deleted: 'Show deleted successfully',
  };
  const successMessage = success ? successMessages[success] : null;

  const isError = !Array.isArray(result) && 'error' in result;
  const shows = Array.isArray(result) ? result : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Show Schedule
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage upcoming and past show events
          </p>
        </div>
        <Link
          href="/admin/shows/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          <PlusIcon className="h-5 w-5" />
          Add Show
        </Link>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="rounded-lg border border-green-700 bg-green-900/20 p-4">
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">
            Failed to load shows: {(result as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && shows.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-gray-400">
            No shows scheduled.{' '}
            <Link
              href="/admin/shows/new"
              className="font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Add your first show
            </Link>{' '}
            to get started.
          </p>
        </div>
      )}

      {/* Shows table */}
      {shows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Dates</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Location</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {shows.map((show) => (
                <tr
                  key={show.id}
                  className="transition-colors hover:bg-navy-700/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{show.name}</span>
                    {show.subtitle && (
                      <span className="block text-sm italic text-gray-400">
                        {show.subtitle}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{show.dates}</td>
                  <td className="px-4 py-3 text-gray-300">{show.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/shows/${show.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteShowButton
                        showId={show.id}
                        showName={show.name}
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
