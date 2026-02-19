import Link from 'next/link';
import type { Metadata } from 'next';
import { getStripeServer } from '@/lib/stripe/server';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Payment Confirmed | SWMRHA',
  description: 'Your payment has been processed successfully.',
};

// ---------------------------------------------------------------------------
// Inline SVG icon
// ---------------------------------------------------------------------------

function CheckCircleIcon({ className }: { className?: string }) {
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // Attempt to retrieve the Stripe checkout session
  let amountDisplay: string | null = null;
  let customerEmail: string | null = null;
  let paymentStatus: string | null = null;

  if (sessionId) {
    try {
      const stripe = getStripeServer();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.amount_total != null) {
        amountDisplay = formatCents(session.amount_total);
      }
      customerEmail = session.customer_details?.email ?? null;
      paymentStatus = session.payment_status ?? null;
    } catch {
      // Stripe retrieval failed — fall through to generic message
    }
  }

  // Determine if we have session details to show
  const hasSessionDetails = amountDisplay !== null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-400" />

          <h1 className="mt-4 font-heading text-2xl font-bold text-white">
            {hasSessionDetails ? 'Payment Confirmed!' : 'Thank You!'}
          </h1>

          <p className="mt-2 max-w-md text-sm text-gray-400">
            {hasSessionDetails
              ? 'Your payment has been processed successfully.'
              : 'Your payment has been processed.'}
          </p>

          {/* Payment details */}
          {hasSessionDetails && (
            <div className="mt-6 w-full max-w-sm rounded-lg border border-navy-600 bg-navy-900/50 p-4 text-left">
              <h2 className="text-sm font-semibold text-gray-300">
                Payment Details
              </h2>
              <div className="mt-3 space-y-2">
                {amountDisplay && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span className="font-medium text-white">
                      {amountDisplay}
                    </span>
                  </div>
                )}
                {customerEmail && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Receipt sent to</span>
                    <span className="text-white">{customerEmail}</span>
                  </div>
                )}
                {paymentStatus && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="inline-flex items-center rounded-full border border-green-700 bg-green-900/50 px-2 py-0.5 text-xs font-medium capitalize text-green-300">
                      {paymentStatus === 'paid' ? 'paid' : paymentStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Receipt note */}
          {customerEmail && (
            <p className="mt-4 text-sm text-gray-500">
              A receipt has been sent to{' '}
              <span className="text-gray-300">{customerEmail}</span>.
            </p>
          )}

          {/* Action links */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/purchase"
              className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
            >
              Purchase More
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
