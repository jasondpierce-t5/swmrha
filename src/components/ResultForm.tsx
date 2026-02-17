'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createResult, updateResult } from '@/lib/actions/results';
import type { ResultRow } from '@/types/database';

interface ResultFormProps {
  result?: ResultRow;
  action: 'create' | 'edit';
}

const CATEGORY_OPTIONS = [
  { value: 'current_year', label: 'Current Year' },
  { value: 'past_results', label: 'Past Results' },
  { value: 'standings', label: 'Standings' },
] as const;

export default function ResultForm({ result, action }: ResultFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form field state
  const [label, setLabel] = useState(result?.label ?? '');
  const [url, setUrl] = useState(result?.url ?? '');
  const [category, setCategory] = useState(result?.category ?? '');
  const [sortOrder, setSortOrder] = useState(result?.sort_order ?? 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      let res;

      if (action === 'create') {
        res = await createResult({
          label: label.trim(),
          url: url.trim(),
          category: category,
          sort_order: sortOrder,
        });
      } else {
        res = await updateResult({
          id: result!.id,
          label: label.trim(),
          url: url.trim(),
          category: category,
          sort_order: sortOrder,
        });
      }

      if ('error' in res) {
        setError(res.error);
        return;
      }

      router.push('/admin/results');
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
          {/* Label */}
          <div>
            <label htmlFor="label" className="mb-1.5 block text-sm font-medium text-white">
              Label <span className="text-red-400">*</span>
            </label>
            <input
              id="label"
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., 2025 Rt 66 Slide Results"
              className={inputClasses}
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-white">
              URL <span className="text-red-400">*</span>
            </label>
            <input
              id="url"
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://www.whitehorseshowmgt.com/..."
              className={inputClasses}
            />
          </div>

          {/* Category and Sort Order row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-white">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClasses}
              >
                <option value="" disabled>
                  Select a category...
                </option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sortOrder" className="mb-1.5 block text-sm font-medium text-white">
                Sort Order
              </label>
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/results"
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
              ? 'Create Result'
              : 'Update Result'}
        </button>
      </div>
    </form>
  );
}
