import Link from 'next/link';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { getFeeItems } from '@/lib/actions/fee-items';
import { getShows } from '@/lib/actions/shows';
import DeleteFeeItemButton from '@/components/DeleteFeeItemButton';

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const result = await getFeeItems();
  const showsResult = await getShows();

  const successMessages: Record<string, string> = {
    created: 'Fee item created successfully',
    updated: 'Fee item updated successfully',
    deleted: 'Fee item deleted successfully',
  };
  const successMessage = success ? successMessages[success] : null;

  const isError = !Array.isArray(result) && 'error' in result;
  const feeItems = Array.isArray(result) ? result : [];

  // Build show name lookup map
  const shows = Array.isArray(showsResult) ? showsResult : [];
  const showNameMap = new Map(shows.map((s) => [s.id, s.name]));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Fee Items
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage stall fees, banquet tickets, vendor spaces, and other charges
          </p>
        </div>
        <Link
          href="/admin/fees/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          <PlusIcon className="h-5 w-5" />
          Add Fee Item
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
            Failed to load fee items: {(result as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && feeItems.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-gray-400">
            No fee items configured.{' '}
            <Link
              href="/admin/fees/new"
              className="font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Add your first fee item
            </Link>{' '}
            to get started.
          </p>
        </div>
      )}

      {/* Fee items table */}
      {feeItems.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Category</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Price</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Show</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Active</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {feeItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-navy-700/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{item.name}</span>
                    {item.description && (
                      <span className="block text-sm italic text-gray-400">
                        {item.description}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    ${(item.price_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {item.show_id
                      ? showNameMap.get(item.show_id) ?? 'Unknown Show'
                      : 'All Shows'}
                  </td>
                  <td className="px-4 py-3">
                    {item.is_active ? (
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
                        href={`/admin/fees/${item.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteFeeItemButton
                        feeItemId={item.id}
                        feeItemName={item.name}
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
