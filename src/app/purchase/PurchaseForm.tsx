'use client';

import { useState } from 'react';
import { createFeeCheckoutSession } from '@/lib/actions/fee-checkout';
import type { FeeItemRow } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PurchaseFormProps {
  feeItems: FeeItemRow[];
  memberInfo: { firstName: string; lastName: string; email: string } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Group fee items by category. Returns entries sorted by the first
 * item's sort_order within each category.
 */
function groupByCategory(items: FeeItemRow[]): Map<string, FeeItemRow[]> {
  const grouped = new Map<string, FeeItemRow[]>();
  for (const item of items) {
    const cat = item.category || 'Other';
    const existing = grouped.get(cat);
    if (existing) {
      existing.push(item);
    } else {
      grouped.set(cat, [item]);
    }
  }
  return grouped;
}

/** Capitalize first letter, e.g. "stall" -> "Stall". */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PurchaseForm({ feeItems, memberInfo }: PurchaseFormProps) {
  // Guest info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Quantities: map from feeItem id -> quantity (default 0)
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const item of feeItems) {
      init[item.id] = 0;
    }
    return init;
  });

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Quantity management
  // ---------------------------------------------------------------------------

  function setQuantity(itemId: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [itemId]: qty }));
  }

  function incrementQuantity(itemId: string) {
    const item = feeItems.find((fi) => fi.id === itemId);
    const max = item?.max_quantity_per_order ?? 10;
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.min((prev[itemId] ?? 0) + 1, max),
    }));
  }

  function decrementQuantity(itemId: string) {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] ?? 0) - 1, 0),
    }));
  }

  // ---------------------------------------------------------------------------
  // Computed values
  // ---------------------------------------------------------------------------

  const selectedItems = feeItems.filter((item) => (quantities[item.id] ?? 0) > 0);
  const runningTotal = selectedItems.reduce(
    (sum, item) => sum + item.price_cents * (quantities[item.id] ?? 0),
    0,
  );
  const hasItems = selectedItems.length > 0;
  const groupedItems = groupByCategory(feeItems);

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  function validate(): string | null {
    if (!memberInfo) {
      if (!firstName.trim()) return 'First name is required.';
      if (!lastName.trim()) return 'Last name is required.';
      if (!email.trim()) return 'Email address is required.';
      if (!isValidEmail(email.trim())) return 'Please enter a valid email address.';
    }
    if (!hasItems) return 'Please select at least one item.';
    return null;
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit() {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const items = selectedItems.map((item) => ({
        feeTypeId: item.id,
        quantity: quantities[item.id] ?? 1,
      }));

      const result = await createFeeCheckoutSession({
        items,
        ...(memberInfo
          ? {}
          : {
              guestEmail: email.trim(),
              guestName: `${firstName.trim()} ${lastName.trim()}`,
            }),
      });

      if ('url' in result) {
        window.location.href = result.url;
        return; // Keep submitting state while redirecting
      }

      setError(result.error);
      setSubmitting(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Section 1: Your Information                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h2 className="font-heading text-xl font-bold text-white mb-4">
          Your Information
        </h2>

        {memberInfo ? (
          <div className="rounded-lg border border-navy-600 bg-navy-900/50 p-4">
            <p className="text-white">
              Purchasing as{' '}
              <span className="font-semibold text-gold-500">
                {memberInfo.firstName} {memberInfo.lastName}
              </span>{' '}
              <span className="text-gray-400">({memberInfo.email})</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Signed in as a member. Your account info will be used for this purchase.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={100}
                required
                className="w-full rounded-lg border border-navy-600 bg-navy-900 px-4 py-2 text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={100}
                required
                className="w-full rounded-lg border border-navy-600 bg-navy-900 px-4 py-2 text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none"
                placeholder="Enter your last name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                required
                className="w-full rounded-lg border border-navy-600 bg-navy-900 px-4 py-2 text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: Select Items                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h2 className="font-heading text-xl font-bold text-white mb-4">
          Select Items
        </h2>

        <div className="space-y-6">
          {Array.from(groupedItems.entries()).map(([category, items]) => (
            <div key={category}>
              {/* Category heading (only show if more than one category) */}
              {groupedItems.size > 1 && (
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-500">
                  {capitalize(category)}
                </h3>
              )}

              <div className="space-y-3">
                {items.map((item) => {
                  const qty = quantities[item.id] ?? 0;
                  const maxQty = item.max_quantity_per_order ?? 10;

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                        qty > 0
                          ? 'border-gold-500/50 bg-navy-900'
                          : 'border-navy-600 bg-navy-900/50'
                      }`}
                    >
                      {/* Item details */}
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-white">
                            {item.name}
                          </span>
                          <span className="font-bold text-gold-500">
                            {formatDollars(item.price_cents)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-400">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decrementQuantity(item.id)}
                          disabled={qty === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-600 bg-navy-800 text-white transition-colors hover:border-gold-500 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          &minus;
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={maxQty}
                          value={qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) {
                              setQuantity(item.id, Math.max(0, Math.min(val, maxQty)));
                            }
                          }}
                          className="h-8 w-14 rounded-lg border border-navy-600 bg-navy-800 text-center text-white focus:border-gold-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label={`Quantity for ${item.name}`}
                        />
                        <button
                          type="button"
                          onClick={() => incrementQuantity(item.id)}
                          disabled={qty >= maxQty}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-600 bg-navy-800 text-white transition-colors hover:border-gold-500 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>

                        {/* Line total (visible when qty > 0) */}
                        {qty > 0 && (
                          <span className="ml-2 min-w-[5rem] text-right text-sm font-bold text-gold-500">
                            {formatDollars(item.price_cents * qty)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Running total */}
        <div className="mt-6 flex items-center justify-between rounded-lg border border-navy-600 bg-navy-900 p-4">
          {hasItems ? (
            <>
              <span className="text-sm text-gray-400">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}{' '}
                selected
              </span>
              <span className="text-lg font-bold text-gold-500">
                Total: {formatDollars(runningTotal)}
              </span>
            </>
          ) : (
            <span className="w-full text-center text-sm text-gray-500">
              No items selected
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Error message                                                      */}
      {/* ------------------------------------------------------------------ */}
      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Submit button                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasItems || submitting}
          className="rounded-lg bg-gold-500 px-6 py-3 font-bold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? 'Redirecting to Payment...'
            : `Proceed to Payment \u2014 ${formatDollars(runningTotal)}`}
        </button>
      </div>
    </div>
  );
}
