'use client';

import { useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { createFeeCheckoutSession } from '@/lib/actions/fee-checkout';
import type { FeeItemRow } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PurchaseFeeFormProps {
  feeItems: FeeItemRow[];
}

interface CartItem {
  feeTypeId: string;
  quantity: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PurchaseFeeForm({ feeItems }: PurchaseFeeFormProps) {
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // Cart management
  // ---------------------------------------------------------------------------

  const getQuantity = (feeTypeId: string): number => {
    return cart.get(feeTypeId) ?? 0;
  };

  const setQuantity = (feeTypeId: string, qty: number) => {
    setCart((prev) => {
      const next = new Map(prev);
      if (qty <= 0) {
        next.delete(feeTypeId);
      } else {
        next.set(feeTypeId, qty);
      }
      return next;
    });
  };

  const increment = (feeItem: FeeItemRow) => {
    const current = getQuantity(feeItem.id);
    const max = feeItem.max_quantity_per_order;
    if (max !== null && current >= max) return;
    setQuantity(feeItem.id, current + 1);
  };

  const decrement = (feeTypeId: string) => {
    const current = getQuantity(feeTypeId);
    if (current <= 0) return;
    setQuantity(feeTypeId, current - 1);
  };

  // ---------------------------------------------------------------------------
  // Total calculation
  // ---------------------------------------------------------------------------

  const feeMap = new Map<string, FeeItemRow>();
  for (const item of feeItems) {
    feeMap.set(item.id, item);
  }

  let totalCents = 0;
  let totalItems = 0;
  for (const [feeTypeId, quantity] of cart) {
    const fee = feeMap.get(feeTypeId);
    if (fee) {
      totalCents += fee.price_cents * quantity;
      totalItems += quantity;
    }
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = async () => {
    if (totalItems === 0) return;
    setError(null);
    setSubmitting(true);

    const items: CartItem[] = [];
    for (const [feeTypeId, quantity] of cart) {
      if (quantity > 0) {
        items.push({ feeTypeId, quantity });
      }
    }

    try {
      const result = await createFeeCheckoutSession({ items });

      if ('url' in result) {
        window.location.href = result.url;
        return;
      }

      setError(result.error);
      setSubmitting(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Group items by category
  // ---------------------------------------------------------------------------

  const categories = new Map<string, FeeItemRow[]>();
  for (const item of feeItems) {
    const cat = item.category || 'other';
    const existing = categories.get(cat) ?? [];
    existing.push(item);
    categories.set(cat, existing);
  }

  const categoryLabel: Record<string, string> = {
    stall: 'Stall Fees',
    banquet: 'Banquet Tickets',
    event: 'Event Charges',
    other: 'Other Fees',
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Member identity notice */}
      <div className="rounded-lg border border-navy-600 bg-navy-900/50 p-4">
        <p className="text-sm text-slate-400">
          Purchasing as a signed-in member. Your name and email will be used
          automatically.
        </p>
      </div>

      {/* Fee items grouped by category */}
      {Array.from(categories.entries()).map(([category, items]) => (
        <div
          key={category}
          className="rounded-lg border border-navy-700 bg-navy-800 p-6"
        >
          <h2 className="font-heading text-lg font-bold text-white mb-4">
            {categoryLabel[category] ?? category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>

          <div className="space-y-4">
            {items.map((item) => {
              const qty = getQuantity(item.id);
              const maxReached =
                item.max_quantity_per_order !== null &&
                qty >= item.max_quantity_per_order;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-navy-600 bg-navy-900 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white">{item.name}</h3>
                    {item.description && (
                      <p className="mt-0.5 text-sm text-slate-400">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-bold text-gold-500">
                      {formatCents(item.price_cents)} each
                    </p>
                    {item.max_quantity_per_order !== null && (
                      <p className="text-xs text-slate-500">
                        Max {item.max_quantity_per_order} per order
                      </p>
                    )}
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decrement(item.id)}
                      disabled={qty === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-600 text-white transition-colors hover:border-navy-500 hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-lg font-bold text-white">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(item)}
                      disabled={maxReached}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-600 text-white transition-colors hover:border-navy-500 hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>

                    {/* Item subtotal */}
                    {qty > 0 && (
                      <span className="ml-2 text-sm font-medium text-gold-500">
                        {formatCents(item.price_cents * qty)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* Running total and submit */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">
              {totalItems === 0
                ? 'Select items above to continue'
                : `${totalItems} item${totalItems === 1 ? '' : 's'} selected`}
            </p>
            <p className="text-2xl font-bold text-gold-500">
              {formatCents(totalCents)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={totalItems === 0 || submitting}
            className="rounded-lg bg-gold-500 px-6 py-3 font-bold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? 'Redirecting to Payment...'
              : `Proceed to Payment \u2014 ${formatCents(totalCents)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
