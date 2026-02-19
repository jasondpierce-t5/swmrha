import Link from 'next/link';
import type { Metadata } from 'next';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Payment Cancelled | SWMRHA',
  description: 'Your payment was cancelled. No charges were made.',
};

// ---------------------------------------------------------------------------
// Inline SVG icon
// ---------------------------------------------------------------------------

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PurchaseCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex flex-col items-center py-8 text-center">
          <XCircleIcon className="h-16 w-16 text-red-400" />

          <h1 className="mt-4 font-heading text-2xl font-bold text-white">
            Payment Cancelled
          </h1>

          <p className="mt-2 max-w-md text-sm text-gray-400">
            No charges were made. You can try again whenever you&rsquo;re ready.
          </p>

          {/* Action links */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/purchase"
              className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-navy-700 px-5 py-2.5 text-sm font-medium text-gold-500 transition-colors hover:border-gold-500/30 hover:bg-gold-500/10"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
