import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { getMembers } from '@/lib/actions/admin-members';
import DeleteMemberButton from '@/components/DeleteMemberButton';

/** Color-coded badge for membership status. */
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: 'border-green-700 bg-green-900/50 text-green-300',
    pending: 'border-yellow-700 bg-yellow-900/50 text-yellow-300',
    expired: 'border-red-700 bg-red-900/50 text-red-300',
    suspended: 'border-red-700 bg-red-900/50 text-red-300',
  };

  const colors = colorMap[status] ?? 'border-navy-600 bg-navy-700 text-gray-300';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}

/** Gold badge for membership type. */
function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-gold-500">
      {type}
    </span>
  );
}

/** Format a date string to locale date, or return a dash if null. */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '\u2014';
  return new Date(dateStr).toLocaleDateString();
}

/** Check if a date string is in the past. */
function isPastDue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const result = await getMembers();

  const successMessages: Record<string, string> = {
    updated: 'Member updated successfully',
    deleted: 'Member deleted successfully',
  };
  const successMessage = success ? successMessages[success] : null;

  const isError = !Array.isArray(result) && 'error' in result;
  const members = Array.isArray(result) ? result : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-white">
          Members
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          View and manage association members
        </p>
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
            Failed to load members: {(result as { error: string }).error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && members.length === 0 && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-gray-400">
            No members registered yet. Members can register via the{' '}
            <span className="font-medium text-gold-500">
              member registration
            </span>{' '}
            page.
          </p>
        </div>
      )}

      {/* Members table */}
      {members.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-700 bg-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gold-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Email</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Type</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Status</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Member Since</th>
                <th className="px-4 py-3 font-semibold text-gold-500">Expiry</th>
                <th className="px-4 py-3 text-right font-semibold text-gold-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 bg-navy-800">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-navy-700/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">
                      {member.first_name} {member.last_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {member.email}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={member.membership_type} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={member.membership_status} />
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(member.membership_start)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        isPastDue(member.membership_expiry)
                          ? 'font-medium text-red-400'
                          : 'text-gray-300'
                      }
                    >
                      {formatDate(member.membership_expiry)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/members/${member.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteMemberButton
                        memberId={member.id}
                        memberName={`${member.first_name} ${member.last_name}`}
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
