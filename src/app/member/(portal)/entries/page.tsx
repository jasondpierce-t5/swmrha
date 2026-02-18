import Link from 'next/link';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { getMemberEntries } from '@/lib/actions/show-entries';
import { getActiveShowClasses } from '@/lib/actions/show-classes';
import type { ShowEntryWithClasses, ShowClassRow } from '@/types/database';
import CancelEntryButton from './CancelEntryButton';

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

/** Color-coded badge for entry status. */
function EntryStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    draft: 'border-gray-600 bg-gray-900/50 text-gray-300',
    pending_payment: 'border-yellow-700 bg-yellow-900/50 text-yellow-300',
    confirmed: 'border-green-700 bg-green-900/50 text-green-300',
    cancelled: 'border-red-700 bg-red-900/50 text-red-300',
  };

  const labelMap: Record<string, string> = {
    draft: 'Draft',
    pending_payment: 'Pending Payment',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
  };

  const colors = colorMap[status] ?? 'border-navy-600 bg-navy-700 text-gray-300';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {labelMap[status] ?? status}
    </span>
  );
}

/** Format cents to dollar string. */
function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Format date string to readable date. */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Table row (desktop)
// ---------------------------------------------------------------------------

function EntryTableRow({
  entry,
  classNames,
}: {
  entry: ShowEntryWithClasses & { show_name: string };
  classNames: Map<string, string>;
}) {
  const classNameList = entry.classes
    .map((c) => classNames.get(c.class_id) ?? 'Unknown')
    .join(', ');

  return (
    <tr className="border-b border-navy-700 last:border-b-0">
      <td className="px-4 py-3 text-sm text-white">{entry.show_name}</td>
      <td className="px-4 py-3 text-sm text-gray-300">
        {entry.horse_name} / {entry.rider_name}
      </td>
      <td className="px-4 py-3 text-sm text-gray-300">
        <span className="line-clamp-2">{classNameList}</span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
        {formatAmount(entry.total_cents)}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <EntryStatusBadge status={entry.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          {entry.status === 'draft' && (
            <>
              <span
                className="cursor-not-allowed text-xs text-slate-500"
                title="Payment coming soon"
              >
                Pay Now
              </span>
              <CancelEntryButton entryId={entry.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Card (mobile)
// ---------------------------------------------------------------------------

function EntryCard({
  entry,
  classNames,
}: {
  entry: ShowEntryWithClasses & { show_name: string };
  classNames: Map<string, string>;
}) {
  const classNameList = entry.classes
    .map((c) => classNames.get(c.class_id) ?? 'Unknown')
    .join(', ');

  return (
    <div className="rounded-lg border border-navy-700 bg-navy-800 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          {formatAmount(entry.total_cents)}
        </span>
        <EntryStatusBadge status={entry.status} />
      </div>
      <p className="mt-2 text-sm font-medium text-white">{entry.show_name}</p>
      <p className="mt-1 text-sm text-gray-300">
        {entry.horse_name} / {entry.rider_name}
      </p>
      <p className="mt-1 text-xs text-gray-400 line-clamp-2">{classNameList}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatDate(entry.created_at)}
        </span>
        {entry.status === 'draft' && (
          <div className="flex items-center gap-3">
            <span
              className="cursor-not-allowed text-xs text-slate-500"
              title="Payment coming soon"
            >
              Pay Now
            </span>
            <CancelEntryButton entryId={entry.id} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface EntriesPageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function EntriesPage({ searchParams }: EntriesPageProps) {
  const params = await searchParams;
  const result = await getMemberEntries();

  // Error state
  if (!Array.isArray(result)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            My Show Entries
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            View and manage your show entries.
          </p>
        </div>
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-6">
          <p className="text-sm text-red-200">{result.error}</p>
        </div>
      </div>
    );
  }

  const entries = result;

  // Build a map of class_id -> class_name from all shows referenced by entries
  const classNames = new Map<string, string>();

  // Get unique show IDs from entries
  const showIds = [...new Set(entries.map((e) => e.show_id))];

  // Fetch active classes for each show to get class names
  for (const showId of showIds) {
    const classesResult = await getActiveShowClasses(showId);
    if (Array.isArray(classesResult)) {
      for (const cls of classesResult) {
        classNames.set(cls.id, cls.name);
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">
          My Show Entries
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          View and manage your show entries.
        </p>
      </div>

      {/* Success message */}
      {params.success && (
        <div className="rounded-lg border border-green-700 bg-green-900/30 p-4">
          <p className="text-sm text-green-300">{decodeURIComponent(params.success)}</p>
        </div>
      )}

      {entries.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-lg border border-navy-700 bg-navy-800 md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Show
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Horse / Rider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Classes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <EntryTableRow
                    key={entry.id}
                    entry={entry}
                    classNames={classNames}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} classNames={classNames} />
            ))}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardDocumentListIcon className="h-16 w-16 text-navy-600" />
            <h2 className="mt-4 font-heading text-lg font-semibold text-white">
              No Show Entries Yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              No show entries yet. Enter a show to get started!
            </p>
            <Link
              href="/member/enter-show"
              className="mt-6 rounded-lg border border-navy-700 px-4 py-2.5 text-sm font-medium text-gold-500 transition-colors hover:border-gold-500/30 hover:bg-gold-500/10"
            >
              Enter a Show
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
