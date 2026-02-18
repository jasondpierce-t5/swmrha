'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createShowClass, updateShowClass } from '@/lib/actions/show-classes';
import type { ShowClassRow } from '@/types/database';

interface ShowClassFormProps {
  showId: string;
  showClass?: ShowClassRow;
  action: 'create' | 'edit';
}

export default function ShowClassForm({ showId, showClass, action }: ShowClassFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form field state
  const [name, setName] = useState(showClass?.name ?? '');
  const [fee, setFee] = useState(
    showClass ? (showClass.fee_cents / 100).toFixed(2) : '0.00',
  );
  const [level, setLevel] = useState(showClass?.level ?? '');
  const [sortOrder, setSortOrder] = useState(showClass?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(showClass?.is_active ?? true);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validate name
    if (!name.trim()) {
      setError('Class name is required.');
      return;
    }

    // Convert fee from dollars to cents
    const feeFloat = parseFloat(fee);
    if (isNaN(feeFloat) || feeFloat < 0) {
      setError('Please enter a valid fee (0 or greater).');
      return;
    }
    const feeCents = Math.round(feeFloat * 100);

    startTransition(async () => {
      let result;

      if (action === 'create') {
        result = await createShowClass({
          show_id: showId,
          name: name.trim(),
          fee_cents: feeCents,
          level: level.trim() || null,
          sort_order: sortOrder,
          is_active: isActive,
        });
      } else {
        result = await updateShowClass(showClass!.id, {
          name: name.trim(),
          fee_cents: feeCents,
          level: level.trim() || null,
          sort_order: sortOrder,
          is_active: isActive,
        });
      }

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push(
        `/admin/shows/${showId}/classes?success=${action === 'create' ? 'Class+created' : 'Class+updated'}`,
      );
    });
  }

  const inputClasses =
    'w-full rounded-lg border border-navy-700 bg-navy-700 px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="className" className="mb-1.5 block text-sm font-medium text-white">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="className"
              type="text"
              required
              maxLength={200}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Open Reining"
              className={inputClasses}
            />
          </div>

          {/* Fee and Level row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fee" className="mb-1.5 block text-sm font-medium text-white">
                Fee (USD) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  id="fee"
                  type="text"
                  inputMode="decimal"
                  required
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClasses} pl-7`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="level" className="mb-1.5 block text-sm font-medium text-white">
                Level
              </label>
              <input
                id="level"
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g., Open, Non Pro, Youth, Rookie"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Sort Order */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sortOrder" className="mb-1.5 block text-sm font-medium text-white">
                Sort Order
              </label>
              <input
                id="sortOrder"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className={inputClasses}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm font-medium text-white">Active</span>
                <span className="text-xs text-gray-400">(available for show entries)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href={`/admin/shows/${showId}/classes`}
          className="rounded-lg border border-navy-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-navy-700 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50"
        >
          {isPending
            ? 'Saving...'
            : action === 'create'
              ? 'Create Class'
              : 'Update Class'}
        </button>
      </div>
    </form>
  );
}
