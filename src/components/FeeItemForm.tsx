'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createFeeItem, updateFeeItem } from '@/lib/actions/fee-items';
import type { FeeItemRow } from '@/types/database';

interface ShowOption {
  id: string;
  name: string;
}

interface FeeItemFormProps {
  feeItem?: FeeItemRow;
  shows: ShowOption[];
  action: 'create' | 'edit';
}

export default function FeeItemForm({ feeItem, shows, action }: FeeItemFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form field state
  const [name, setName] = useState(feeItem?.name ?? '');
  const [description, setDescription] = useState(feeItem?.description ?? '');
  const [price, setPrice] = useState(
    feeItem ? (feeItem.price_cents / 100).toFixed(2) : '',
  );
  const [category, setCategory] = useState(feeItem?.category ?? 'other');
  const [showId, setShowId] = useState(feeItem?.show_id ?? '');
  const [maxQuantity, setMaxQuantity] = useState(
    feeItem?.max_quantity_per_order?.toString() ?? '',
  );
  const [isActive, setIsActive] = useState(feeItem?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(feeItem?.sort_order ?? 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Convert price from dollars to cents
    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat <= 0) {
      setError('Please enter a valid price greater than zero.');
      return;
    }
    const priceCents = Math.round(priceFloat * 100);

    // Parse max quantity
    const maxQty = maxQuantity.trim() === '' ? null : parseInt(maxQuantity, 10);
    if (maxQty !== null && (isNaN(maxQty) || maxQty <= 0)) {
      setError('Max quantity per order must be a positive number or left empty for unlimited.');
      return;
    }

    startTransition(async () => {
      let result;

      const data = {
        name: name.trim(),
        description: description.trim() || null,
        price_cents: priceCents,
        category,
        show_id: showId || null,
        max_quantity_per_order: maxQty,
        is_active: isActive,
        sort_order: sortOrder,
      };

      if (action === 'create') {
        result = await createFeeItem(data);
      } else {
        result = await updateFeeItem(feeItem!.id, data);
      }

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push(`/admin/fees?success=${action === 'create' ? 'created' : 'updated'}`);
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

      {/* Basic Information */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Basic Information</h3>
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={200}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Stall Fee, Banquet Ticket"
              className={inputClasses}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this fee item..."
              className={inputClasses}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-white">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClasses}
            >
              <option value="stall">Stall</option>
              <option value="banquet">Banquet</option>
              <option value="vendor">Vendor</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Availability */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Pricing &amp; Availability</h3>
        <div className="space-y-5">
          {/* Price */}
          <div>
            <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-white">
              Price (USD) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                id="price"
                type="text"
                inputMode="decimal"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25.00"
                className={`${inputClasses} pl-7`}
              />
            </div>
          </div>

          {/* Show */}
          <div>
            <label htmlFor="showId" className="mb-1.5 block text-sm font-medium text-white">
              Show
            </label>
            <p className="mb-1.5 text-xs text-gray-400">
              Optionally limit this fee item to a specific show. Leave as &ldquo;All Shows&rdquo; for general availability.
            </p>
            <select
              id="showId"
              value={showId}
              onChange={(e) => setShowId(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Shows</option>
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Quantity Per Order */}
          <div>
            <label htmlFor="maxQuantity" className="mb-1.5 block text-sm font-medium text-white">
              Max Quantity Per Order
            </label>
            <p className="mb-1.5 text-xs text-gray-400">
              Leave empty for unlimited.
            </p>
            <input
              id="maxQuantity"
              type="number"
              min={1}
              value={maxQuantity}
              onChange={(e) => setMaxQuantity(e.target.value)}
              placeholder="Unlimited"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Display Settings</h3>
        <div className="space-y-5">
          {/* Sort Order */}
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

          {/* Active toggle */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500"
            />
            <span className="text-sm font-medium text-white">Active</span>
            <span className="text-xs text-gray-400">(visible on purchase pages)</span>
          </label>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/fees"
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
              ? 'Create Fee Item'
              : 'Update Fee Item'}
        </button>
      </div>
    </form>
  );
}
