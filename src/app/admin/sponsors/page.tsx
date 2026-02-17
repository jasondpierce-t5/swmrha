import Link from 'next/link';
import { PlusIcon, PencilSquareIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { getSponsors } from '@/lib/actions/sponsors';
import DeleteSponsorButton from '@/components/DeleteSponsorButton';

/** Strip protocol prefix from a URL for display. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

export default async function AdminSponsorsPage() {
  const result = await getSponsors();

  const isError = !Array.isArray(result) && 'error' in result;
  const sponsors = Array.isArray(result) ? result : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Sponsors
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage sponsor listings and logos
          </p>
        </div>
        <Link
          href="/admin/sponsors/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          <PlusIcon className="h-5 w-5" />
          Add Sponsor
        </Link>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">
            Failed to load sponsors: {(result as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && sponsors.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-600" />
          <p className="mt-4 text-gray-400">
            No sponsors yet.{' '}
            <Link
              href="/admin/sponsors/new"
              className="font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Add your first sponsor
            </Link>{' '}
            to get started.
          </p>
        </div>
      )}

      {/* Sponsors table */}
      {sponsors.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Logo</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Level</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Website</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Sort Order</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {sponsors.map((sponsor) => {
                const isTopTier = sponsor.level === 'Platinum' || sponsor.level === 'Diamond';
                return (
                  <tr
                    key={sponsor.id}
                    className="transition-colors hover:bg-navy-700/50"
                  >
                    <td className="px-4 py-3">
                      {sponsor.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={sponsor.image_url}
                          alt={`${sponsor.name} logo`}
                          className="h-10 w-10 rounded object-contain"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-navy-700">
                          <BuildingStorefrontIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-white">{sponsor.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={isTopTier ? 'font-semibold text-gold-500' : 'text-white'}>
                        {sponsor.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {sponsor.website_url ? (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-gray-300 transition-colors hover:text-gold-500"
                        >
                          {displayUrl(sponsor.website_url)}
                        </a>
                      ) : (
                        <span className="text-gray-500">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {sponsor.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/sponsors/${sponsor.id}/edit`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Edit
                        </Link>
                        <DeleteSponsorButton
                          sponsorId={sponsor.id}
                          sponsorName={sponsor.name}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
