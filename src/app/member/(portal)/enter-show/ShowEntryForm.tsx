'use client';

import { useState, useCallback, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getActiveShowClasses } from '@/lib/actions/show-classes';
import { createShowEntries } from '@/lib/actions/show-entries';
import { createEntryCheckoutSession } from '@/lib/actions/entry-checkout';
import type { ShowRow, ShowClassRow, CreateShowEntryInput } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Entry {
  id: string;
  horseName: string;
  riderName: string;
  selectedClassIds: string[];
}

interface ShowEntryFormProps {
  shows: ShowRow[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFee(feeCents: number): string {
  return `$${(feeCents / 100).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ShowEntryForm({ shows }: ShowEntryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Step state
  const [step, setStep] = useState(1);

  // Step 1 state
  const [selectedShowId, setSelectedShowId] = useState('');

  // Classes state (loaded when show is selected)
  const [classes, setClasses] = useState<ShowClassRow[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [classesError, setClassesError] = useState<string | null>(null);
  const classesCache = useRef<Map<string, ShowClassRow[]>>(new Map());

  // Step 2 state
  const [entries, setEntries] = useState<Entry[]>([
    { id: '1', horseName: '', riderName: '', selectedClassIds: [] },
  ]);

  // Step 3 state
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [payAfterSave, setPayAfterSave] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Show selection with class fetching
  // ---------------------------------------------------------------------------

  const handleShowSelect = useCallback(
    async (showId: string) => {
      setSelectedShowId(showId);
      setClassesError(null);

      // Check cache first
      const cached = classesCache.current.get(showId);
      if (cached) {
        setClasses(cached);
        return;
      }

      setClassesLoading(true);
      try {
        const result = await getActiveShowClasses(showId);
        if ('error' in result) {
          setClassesError(result.error);
          setClasses([]);
        } else {
          setClasses(result);
          classesCache.current.set(showId, result);
        }
      } catch {
        setClassesError('Failed to load classes. Please try again.');
        setClasses([]);
      } finally {
        setClassesLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Entry management
  // ---------------------------------------------------------------------------

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: Date.now().toString(), horseName: '', riderName: '', selectedClassIds: [] },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: string, field: 'horseName' | 'riderName', value: string) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    );
  };

  const toggleClass = (entryId: string, classId: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const ids = entry.selectedClassIds.includes(classId)
          ? entry.selectedClassIds.filter((c) => c !== classId)
          : [...entry.selectedClassIds, classId];
        return { ...entry, selectedClassIds: ids };
      }),
    );
  };

  // ---------------------------------------------------------------------------
  // Fee calculations
  // ---------------------------------------------------------------------------

  const classMap = new Map<string, ShowClassRow>();
  for (const c of classes) {
    classMap.set(c.id, c);
  }

  const entryTotal = (entry: Entry): number => {
    return entry.selectedClassIds.reduce((sum, cid) => {
      const cls = classMap.get(cid);
      return sum + (cls?.fee_cents ?? 0);
    }, 0);
  };

  const grandTotal = entries.reduce((sum, e) => sum + entryTotal(e), 0);

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const canContinueStep1 = selectedShowId !== '' && !classesLoading;

  const canContinueStep2 = entries.every(
    (e) =>
      e.horseName.trim() !== '' &&
      e.riderName.trim() !== '' &&
      e.selectedClassIds.length > 0,
  );

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSave = async (payImmediately: boolean) => {
    setSubmitError(null);
    setPayError(null);
    setSubmitting(true);
    setPayAfterSave(payImmediately);

    const payload: CreateShowEntryInput[] = entries.map((e) => ({
      show_id: selectedShowId,
      horse_name: e.horseName.trim(),
      rider_name: e.riderName.trim(),
      class_ids: e.selectedClassIds,
    }));

    try {
      const result = await createShowEntries(payload);
      if ('error' in result) {
        setSubmitError(result.error);
        setSubmitting(false);
        return;
      }

      if (payImmediately) {
        // Extract entry IDs from the returned entries and redirect to Stripe
        const entryIds = result.map((e) => e.id);
        const checkoutResult = await createEntryCheckoutSession(entryIds);

        if ('url' in checkoutResult) {
          window.location.href = checkoutResult.url;
          return;
        }

        // Payment session failed — entries still saved as draft, redirect to entries list
        setPayError(checkoutResult.error);
        startTransition(() => {
          router.push('/member/entries?success=Entries+saved');
        });
      } else {
        // Save as draft — redirect to entries list
        startTransition(() => {
          router.push('/member/entries?success=Entries+saved');
        });
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const selectedShow = shows.find((s) => s.id === selectedShowId);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">
          Enter a Show
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Register for SWMRHA shows and enter your classes online.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4">
          {[
            { num: 1, label: 'Select Show' },
            { num: 2, label: 'Entries & Classes' },
            { num: 3, label: 'Review & Save' },
          ].map(({ num, label }) => (
            <div key={num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    step >= num
                      ? 'bg-gold-500 text-navy-900'
                      : 'bg-navy-600 text-slate-400'
                  }`}
                >
                  {num}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    step >= num ? 'text-gold-500' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {num < 3 && (
                <div
                  className={`mx-2 h-1 w-12 sm:w-16 ${
                    step > num ? 'bg-gold-500' : 'bg-navy-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6 sm:p-8">
        {/* ----- Step 1: Select Show ----- */}
        {step === 1 && (
          <div>
            <h2 className="font-heading text-xl font-bold text-white mb-6">
              Select Show
            </h2>

            {classesError && (
              <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3">
                <p className="text-sm text-red-200">{classesError}</p>
              </div>
            )}

            <div className="space-y-4">
              {shows.map((show) => (
                <label
                  key={show.id}
                  className={`block cursor-pointer rounded-lg border-2 p-6 transition-colors ${
                    selectedShowId === show.id
                      ? 'border-gold-500 bg-navy-900'
                      : 'border-navy-600 hover:border-navy-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="show"
                    value={show.id}
                    checked={selectedShowId === show.id}
                    onChange={() => handleShowSelect(show.id)}
                    className="sr-only"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {show.name}
                    </h3>
                    {show.subtitle && (
                      <p className="text-gold-500 font-medium mb-1">
                        {show.subtitle}
                      </p>
                    )}
                    <p className="text-slate-400">{show.dates}</p>
                    <p className="text-slate-400">
                      {show.location} &mdash; {show.venue}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {classesLoading && (
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-400">Loading classes...</p>
              </div>
            )}
          </div>
        )}

        {/* ----- Step 2: Entries & Classes ----- */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-white">
                Entries &amp; Classes
              </h2>
              <button
                onClick={addEntry}
                className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 font-bold text-navy-900 transition-colors hover:bg-gold-400"
              >
                <PlusIcon className="h-5 w-5" />
                Add Entry
              </button>
            </div>

            <div className="space-y-8">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-navy-600 bg-navy-900 p-6"
                >
                  {/* Entry header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Entry #{index + 1}
                    </h3>
                    {entries.length > 1 && (
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>

                  {/* Horse/Rider inputs */}
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Horse Name *
                      </label>
                      <input
                        type="text"
                        value={entry.horseName}
                        onChange={(e) =>
                          updateEntry(entry.id, 'horseName', e.target.value)
                        }
                        maxLength={200}
                        className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-2 text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none"
                        placeholder="Enter horse name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Rider Name *
                      </label>
                      <input
                        type="text"
                        value={entry.riderName}
                        onChange={(e) =>
                          updateEntry(entry.id, 'riderName', e.target.value)
                        }
                        maxLength={200}
                        className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-2 text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none"
                        placeholder="Enter rider name"
                      />
                    </div>
                  </div>

                  {/* Class selection grid */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-300">
                      Select Classes *
                    </label>
                    {classes.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {classes.map((cls) => (
                          <label
                            key={cls.id}
                            className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                              entry.selectedClassIds.includes(cls.id)
                                ? 'border-gold-500 bg-navy-800'
                                : 'border-navy-600 hover:border-navy-500'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={entry.selectedClassIds.includes(cls.id)}
                                onChange={() => toggleClass(entry.id, cls.id)}
                                className="h-4 w-4"
                              />
                              <div>
                                <div className="font-medium text-white">
                                  {cls.name}
                                </div>
                                {cls.level && (
                                  <div className="text-xs text-slate-400">
                                    {cls.level}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="font-bold text-gold-500">
                              {formatFee(cls.fee_cents)}
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">
                        No classes available for this show.
                      </p>
                    )}
                  </div>

                  {/* Entry subtotal */}
                  {entry.selectedClassIds.length > 0 && (
                    <div className="mt-4 flex justify-end border-t border-navy-600 pt-3">
                      <span className="text-sm font-medium text-slate-300">
                        Entry subtotal:{' '}
                        <span className="text-gold-500 font-bold">
                          {formatFee(entryTotal(entry))}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Running total */}
            <div className="mt-6 flex justify-end rounded-lg border border-navy-600 bg-navy-900 p-4">
              <div className="text-lg font-bold text-gold-500">
                Total: {formatFee(grandTotal)}
              </div>
            </div>
          </div>
        )}

        {/* ----- Step 3: Review & Save ----- */}
        {step === 3 && (
          <div>
            <h2 className="font-heading text-xl font-bold text-white mb-6">
              Review &amp; Save
            </h2>

            {submitError && (
              <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3">
                <p className="text-sm text-red-200">{submitError}</p>
              </div>
            )}

            {/* Summary card */}
            <div className="rounded-lg border border-navy-600 bg-navy-900 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">
                Entry Summary
              </h3>

              <div className="space-y-4">
                {/* Show info */}
                <div className="text-slate-300">
                  <strong className="text-gold-500">Show:</strong>{' '}
                  {selectedShow?.name ?? 'Unknown Show'}
                </div>

                {/* Entries */}
                {entries.map((entry, index) => {
                  const total = entryTotal(entry);
                  return (
                    <div
                      key={entry.id}
                      className="border-t border-navy-600 pt-4"
                    >
                      <div className="mb-2 font-bold text-white">
                        Entry #{index + 1}: {entry.horseName || 'Unnamed Horse'}{' '}
                        / {entry.riderName || 'Unnamed Rider'}
                      </div>
                      {entry.selectedClassIds.map((classId) => {
                        const cls = classMap.get(classId);
                        return (
                          <div
                            key={classId}
                            className="ml-4 flex justify-between text-slate-300"
                          >
                            <span>{cls?.name ?? 'Unknown Class'}</span>
                            <span className="font-bold">
                              {formatFee(cls?.fee_cents ?? 0)}
                            </span>
                          </div>
                        );
                      })}
                      <div className="ml-4 mt-2 flex justify-between text-sm font-medium text-slate-400">
                        <span>Entry total</span>
                        <span className="text-gold-500">{formatFee(total)}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Grand total */}
                <div className="border-t border-navy-600 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gold-500">
                    <span>Total Entry Fees</span>
                    <span>{formatFee(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay error (if Save & Pay failed at checkout step) */}
            {payError && (
              <div className="mt-4 rounded-lg border border-red-700 bg-red-900/30 p-3">
                <p className="text-sm text-red-200">{payError}</p>
              </div>
            )}

            {/* Notice */}
            <div className="mt-4 rounded-lg border border-navy-600 bg-navy-900/50 p-4">
              <p className="text-sm text-slate-400">
                Choose <strong className="text-gold-500">&ldquo;Save &amp; Pay Now&rdquo;</strong> to
                save your entries and be redirected to Stripe to complete payment.
                Or choose <strong className="text-white">&ldquo;Save as Draft&rdquo;</strong> to
                save your entries and complete payment later from the{' '}
                <span className="text-gold-500">My Entries</span> page.
              </p>
            </div>
          </div>
        )}

        {/* ----- Navigation Buttons ----- */}
        <div className="mt-8 flex justify-between border-t border-navy-600 pt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={submitting || isPending}
              className="rounded-lg bg-navy-700 px-6 py-2 text-white transition-colors hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canContinueStep1) ||
                (step === 2 && !canContinueStep2)
              }
              className="ml-auto rounded-lg bg-gold-500 px-6 py-2 font-bold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          )}

          {step === 3 && (
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={submitting || isPending}
                className="rounded-lg bg-navy-700 px-6 py-2 font-bold text-white transition-colors hover:bg-navy-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && !payAfterSave
                  ? 'Saving...'
                  : 'Save as Draft'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={submitting || isPending}
                className="rounded-lg bg-gold-500 px-6 py-2 font-bold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && payAfterSave
                  ? 'Redirecting to Payment...'
                  : 'Save & Pay Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
