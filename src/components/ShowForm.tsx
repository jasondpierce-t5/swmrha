'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createShow, updateShow } from '@/lib/actions/shows';
import type { ShowRow, ShowLink } from '@/types/database';

interface ShowFormProps {
  show?: ShowRow;
  action: 'create' | 'edit';
}

interface LinkRow {
  label: string;
  url: string;
  external: boolean;
}

export default function ShowForm({ show, action }: ShowFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form field state
  const [name, setName] = useState(show?.name ?? '');
  const [subtitle, setSubtitle] = useState(show?.subtitle ?? '');
  const [dates, setDates] = useState(show?.dates ?? '');
  const [location, setLocation] = useState(show?.location ?? '');
  const [venue, setVenue] = useState(show?.venue ?? '');
  const [sortOrder, setSortOrder] = useState(show?.sort_order ?? 0);
  const [notes, setNotes] = useState(show?.notes?.join('\n') ?? '');

  // Dynamic links state
  const [links, setLinks] = useState<LinkRow[]>(() => {
    if (show?.links && show.links.length > 0) {
      return show.links.map((link: ShowLink) => ({
        label: link.label,
        url: link.url,
        external: link.external,
      }));
    }
    return [{ label: '', url: '', external: false }];
  });

  function addLink() {
    setLinks((prev) => [...prev, { label: '', url: '', external: false }]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLink(index: number, field: keyof LinkRow, value: string | boolean) {
    setLinks((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Build notes array from textarea (split on newlines, filter empty)
    const notesArray = notes
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    // Build links array (filter out rows with empty label and url)
    const linksArray: ShowLink[] = links
      .filter((link) => link.label.trim() !== '' || link.url.trim() !== '')
      .map((link) => ({
        label: link.label.trim(),
        url: link.url.trim(),
        external: link.external,
      }));

    startTransition(async () => {
      let result;

      if (action === 'create') {
        result = await createShow({
          name: name.trim(),
          subtitle: subtitle.trim() || null,
          dates: dates.trim(),
          location: location.trim(),
          venue: venue.trim(),
          links: linksArray,
          notes: notesArray,
          sort_order: sortOrder,
        });
      } else {
        result = await updateShow({
          id: show!.id,
          name: name.trim(),
          subtitle: subtitle.trim() || null,
          dates: dates.trim(),
          location: location.trim(),
          venue: venue.trim(),
          links: linksArray,
          notes: notesArray,
          sort_order: sortOrder,
        });
      }

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push('/admin/shows');
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
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Route 66 Slide"
              className={inputClasses}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label htmlFor="subtitle" className="mb-1.5 block text-sm font-medium text-white">
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g., AQHA/APHA/ApHC Approved"
              className={inputClasses}
            />
          </div>

          {/* Dates and Location row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="dates" className="mb-1.5 block text-sm font-medium text-white">
                Dates <span className="text-red-400">*</span>
              </label>
              <input
                id="dates"
                type="text"
                required
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="e.g., April 4-6, 2025"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-white">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                id="location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Carthage, MO"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Venue and Sort Order row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="venue" className="mb-1.5 block text-sm font-medium text-white">
                Venue <span className="text-red-400">*</span>
              </label>
              <input
                id="venue"
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., Lucky J Arena and Steakhouse"
                className={inputClasses}
              />
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

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-white">
              Notes
            </label>
            <p className="mb-1.5 text-xs text-gray-400">
              One note per line
            </p>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes, one per line..."
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Links section */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Links</h3>
          <button
            type="button"
            onClick={addLink}
            className="inline-flex items-center gap-1 rounded-lg bg-navy-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-navy-600 hover:text-white"
          >
            <PlusIcon className="h-4 w-4" />
            Add Link
          </button>
        </div>

        {links.length === 0 && (
          <p className="text-sm italic text-gray-400">
            No links added. Click &quot;Add Link&quot; to add one.
          </p>
        )}

        <div className="space-y-3">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-navy-700 bg-navy-900/50 p-3"
            >
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  placeholder="Label (e.g., Show Bill)"
                  className={inputClasses}
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  placeholder="URL (e.g., https://...)"
                  className={inputClasses}
                />
              </div>
              <label className="flex shrink-0 items-center gap-1.5 pt-2">
                <input
                  type="checkbox"
                  checked={link.external}
                  onChange={(e) => updateLink(index, 'external', e.target.checked)}
                  className="h-4 w-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-xs text-gray-400">External</span>
              </label>
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-navy-700 hover:text-red-400"
                aria-label={`Remove link ${index + 1}`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/shows"
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
              ? 'Create Show'
              : 'Update Show'}
        </button>
      </div>
    </form>
  );
}
