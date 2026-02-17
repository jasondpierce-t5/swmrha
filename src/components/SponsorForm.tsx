'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createSponsor, updateSponsor, uploadSponsorLogo } from '@/lib/actions/sponsors';
import type { SponsorRow } from '@/types/database';

interface SponsorFormProps {
  sponsor?: SponsorRow;
  action: 'create' | 'edit';
}

const SPONSOR_LEVELS = ['Platinum', 'Diamond', 'Gold', 'Silver', 'Bronze', 'Friends'] as const;

export default function SponsorForm({ sponsor, action }: SponsorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form field state
  const [name, setName] = useState(sponsor?.name ?? '');
  const [level, setLevel] = useState(sponsor?.level ?? '');
  const [websiteUrl, setWebsiteUrl] = useState(sponsor?.website_url ?? '');
  const [sortOrder, setSortOrder] = useState(sponsor?.sort_order ?? 0);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(sponsor?.image_url ?? null);
  const [removeImage, setRemoveImage] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      let imageUrl: string | null | undefined = undefined;

      // Handle image upload if a new file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadResult = await uploadSponsorLogo(formData);

        if ('error' in uploadResult) {
          setError(uploadResult.error);
          return;
        }

        imageUrl = uploadResult.url;
      } else if (removeImage) {
        imageUrl = null;
      }

      let result;

      if (action === 'create') {
        result = await createSponsor({
          name: name.trim(),
          level: level,
          website_url: websiteUrl.trim() || null,
          sort_order: sortOrder,
          image_url: imageUrl ?? null,
        });
      } else {
        const updateData: Record<string, unknown> = {
          id: sponsor!.id,
          name: name.trim(),
          level: level,
          website_url: websiteUrl.trim() || null,
          sort_order: sortOrder,
        };

        // Only include image_url in update if it changed
        if (imageUrl !== undefined) {
          updateData.image_url = imageUrl;
        }

        result = await updateSponsor(updateData as Parameters<typeof updateSponsor>[0]);
      }

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push('/admin/sponsors');
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
              placeholder="e.g., Acme Feeds"
              className={inputClasses}
            />
          </div>

          {/* Level and Sort Order row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="level" className="mb-1.5 block text-sm font-medium text-white">
                Level <span className="text-red-400">*</span>
              </label>
              <select
                id="level"
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={inputClasses}
              >
                <option value="" disabled>
                  Select a level...
                </option>
                {SPONSOR_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
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

          {/* Website URL */}
          <div>
            <label htmlFor="websiteUrl" className="mb-1.5 block text-sm font-medium text-white">
              Website URL
            </label>
            <input
              id="websiteUrl"
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g., https://example.com"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Image upload section */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Logo</h3>

        {/* Current / selected image preview */}
        {imagePreview && (
          <div className="mb-4 flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Logo preview"
              className="h-20 w-20 rounded-lg border border-navy-700 object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="inline-flex items-center gap-1 rounded-lg bg-navy-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-navy-600 hover:text-white"
            >
              <XMarkIcon className="h-4 w-4" />
              Remove image
            </button>
          </div>
        )}

        {/* File input */}
        <div>
          <label htmlFor="logoFile" className="mb-1.5 block text-sm text-gray-400">
            {imagePreview ? 'Replace logo' : 'Upload a logo image'}
          </label>
          <input
            id="logoFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-300 file:transition-colors hover:file:bg-navy-600 hover:file:text-white"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/sponsors"
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
              ? 'Create Sponsor'
              : 'Update Sponsor'}
        </button>
      </div>
    </form>
  );
}
