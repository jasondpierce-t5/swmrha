import Link from 'next/link';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { getMembershipTypes } from '@/lib/actions/membership-types';
import DeleteMembershipTypeButton from '@/components/DeleteMembershipTypeButton';

export default async function AdminMembershipTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const result = await getMembershipTypes();

  const successMessages: Record<string, string> = {
    created: 'Membership type created successfully',
    updated: 'Membership type updated successfully',
    deleted: 'Membership type deleted successfully',
  };
  const successMessage = success ? successMessages[success] : null;

  const isError = !Array.isArray(result) && 'error' in result;
  const membershipTypes = Array.isArray(result) ? result : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Membership Types
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage membership tiers, pricing, and benefits
          </p>
        </div>
        <Link
          href="/admin/membership-types/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          <PlusIcon className="h-5 w-5" />
          Add Membership Type
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
            Failed to load membership types: {(result as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && membershipTypes.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-gray-400">
            No membership types configured.{' '}
            <Link
              href="/admin/membership-types/new"
              className="font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Add your first membership type
            </Link>{' '}
            to get started.
          </p>
        </div>
      )}

      {/* Membership types table */}
      {membershipTypes.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Price</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Duration</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Status</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Sort Order</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {membershipTypes.map((type) => (
                <tr
                  key={type.id}
                  className="transition-colors hover:bg-navy-700/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{type.name}</span>
                    {type.description && (
                      <span className="block text-sm italic text-gray-400">
                        {type.description}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    ${(type.price_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {type.duration_months
                      ? `${type.duration_months} month${type.duration_months !== 1 ? 's' : ''}`
                      : 'Lifetime'}
                  </td>
                  <td className="px-4 py-3">
                    {type.is_active ? (
                      <span className="inline-flex items-center rounded-full bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-700/30 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{type.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/membership-types/${type.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteMembershipTypeButton
                        membershipTypeId={type.id}
                        membershipTypeName={type.name}
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
