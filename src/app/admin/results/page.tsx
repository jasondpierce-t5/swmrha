import Link from 'next/link';
import { PlusIcon, PencilSquareIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { getResults } from '@/lib/actions/results';
import DeleteResultButton from '@/components/DeleteResultButton';

/** Map DB category values to human-readable display labels. */
function displayCategory(category: string): string {
  switch (category) {
    case 'current_year':
      return 'Current Year';
    case 'past_results':
      return 'Past Results';
    case 'standings':
      return 'Standings';
    default:
      return category;
  }
}

/** Strip protocol prefix from a URL for display. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

export default async function AdminResultsPage() {
  const result = await getResults();

  const isError = !Array.isArray(result) && 'error' in result;
  const results = Array.isArray(result) ? result : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Results &amp; Standings
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage show results and standings links
          </p>
        </div>
        <Link
          href="/admin/results/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          <PlusIcon className="h-5 w-5" />
          Add Result
        </Link>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">
            Failed to load results: {(result as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && results.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <TrophyIcon className="mx-auto h-12 w-12 text-gray-600" />
          <p className="mt-4 text-gray-400">
            No results yet.{' '}
            <Link
              href="/admin/results/new"
              className="font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Add your first result
            </Link>{' '}
            to get started.
          </p>
        </div>
      )}

      {/* Results table */}
      {results.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Label</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Category</th>
                <th className="px-4 py-3 font-semibold text-gold-500">URL</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Sort Order</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {results.map((r) => (
                <tr
                  key={r.id}
                  className="transition-colors hover:bg-navy-700/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{r.label}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {displayCategory(r.category)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-gray-300 transition-colors hover:text-gold-500"
                    >
                      {displayUrl(r.url)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {r.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/results/${r.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteResultButton
                        resultId={r.id}
                        resultLabel={r.label}
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
