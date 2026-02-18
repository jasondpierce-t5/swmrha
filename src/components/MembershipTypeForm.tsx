'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createMembershipType, updateMembershipType } from '@/lib/actions/membership-types';
import type { MembershipTypeRow } from '@/types/database';

interface MembershipTypeFormProps {
  membershipType?: MembershipTypeRow;
  action: 'create' | 'edit';
}

export default function MembershipTypeForm({ membershipType, action }: MembershipTypeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form field state
  const [name, setName] = useState(membershipType?.name ?? '');
  const [slug, setSlug] = useState(membershipType?.slug ?? '');
  const [description, setDescription] = useState(membershipType?.description ?? '');
  const [price, setPrice] = useState(
    membershipType ? (membershipType.price_cents / 100).toFixed(2) : '',
  );
  const [durationMonths, setDurationMonths] = useState(
    membershipType?.duration_months?.toString() ?? '',
  );
  const [isLifetime, setIsLifetime] = useState(
    membershipType ? membershipType.duration_months === null : false,
  );
  const [benefits, setBenefits] = useState<string[]>(() => {
    if (membershipType?.benefits && membershipType.benefits.length > 0) {
      return membershipType.benefits;
    }
    return [''];
  });
  const [sortOrder, setSortOrder] = useState(membershipType?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(membershipType?.is_active ?? true);

  // Slug auto-generation (only when creating)
  function handleNameChange(value: string) {
    setName(value);
    if (action === 'create') {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(autoSlug);
    }
  }

  // Lifetime toggle
  function handleLifetimeToggle(checked: boolean) {
    setIsLifetime(checked);
    if (checked) {
      setDurationMonths('');
    }
  }

  // Benefits dynamic array
  function addBenefit() {
    setBenefits((prev) => [...prev, '']);
  }

  function removeBenefit(index: number) {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  }

  function updateBenefit(index: number, value: string) {
    setBenefits((prev) =>
      prev.map((b, i) => (i === index ? value : b)),
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Convert price from dollars to cents
    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat < 0) {
      setError('Please enter a valid price.');
      return;
    }
    const priceCents = Math.round(priceFloat * 100);

    // Parse duration
    const duration = isLifetime ? null : parseInt(durationMonths, 10) || null;
    if (!isLifetime && (!duration || duration <= 0)) {
      setError('Please enter a valid duration in months, or select Lifetime.');
      return;
    }

    // Build benefits array (filter out empty strings)
    const benefitsArray = benefits
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    startTransition(async () => {
      let result;

      if (action === 'create') {
        result = await createMembershipType({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          price_cents: priceCents,
          duration_months: duration,
          benefits: benefitsArray,
          sort_order: sortOrder,
          is_active: isActive,
        });
      } else {
        result = await updateMembershipType(membershipType!.id, {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          price_cents: priceCents,
          duration_months: duration,
          benefits: benefitsArray,
          sort_order: sortOrder,
          is_active: isActive,
        });
      }

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push(`/admin/membership-types?success=${action === 'create' ? 'created' : 'updated'}`);
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
              maxLength={100}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Individual Membership"
              className={inputClasses}
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-white">
              Slug <span className="text-red-400">*</span>
            </label>
            <p className="mb-1.5 text-xs text-gray-400">
              URL-friendly identifier. Lowercase letters, numbers, and hyphens only.
            </p>
            <input
              id="slug"
              type="text"
              required
              maxLength={50}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., individual"
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
              placeholder="Brief description of this membership tier..."
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Duration */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Pricing &amp; Duration</h3>
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
                placeholder="50.00"
                className={`${inputClasses} pl-7`}
              />
            </div>
          </div>

          {/* Duration and Lifetime row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="durationMonths" className="mb-1.5 block text-sm font-medium text-white">
                Duration (months)
              </label>
              <input
                id="durationMonths"
                type="number"
                min={1}
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
                disabled={isLifetime}
                placeholder="12"
                className={`${inputClasses} ${isLifetime ? 'opacity-50' : ''}`}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isLifetime}
                  onChange={(e) => handleLifetimeToggle(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm font-medium text-white">Lifetime membership</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Benefits</h3>
          <button
            type="button"
            onClick={addBenefit}
            className="inline-flex items-center gap-1 rounded-lg bg-navy-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-navy-600 hover:text-white"
          >
            <PlusIcon className="h-4 w-4" />
            Add Benefit
          </button>
        </div>

        {benefits.length === 0 && (
          <p className="text-sm italic text-gray-400">
            No benefits added. Click &quot;Add Benefit&quot; to add one.
          </p>
        )}

        <div className="space-y-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                placeholder="e.g., Eligible for year-end awards"
                className={`${inputClasses} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-navy-700 hover:text-red-400"
                aria-label={`Remove benefit ${index + 1}`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
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
            <span className="text-xs text-gray-400">(visible on public membership page)</span>
          </label>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/membership-types"
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
              ? 'Create Membership Type'
              : 'Update Membership Type'}
        </button>
      </div>
    </form>
  );
}
