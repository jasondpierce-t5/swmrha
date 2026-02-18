import Link from "next/link";

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

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ return?: string }>;
}) {
  const params = await searchParams;
  const returnTo = params.return;

  const tryAgainHref =
    returnTo === 'entries' ? '/member/entries' : '/member/pay-dues';
  const tryAgainLabel =
    returnTo === 'entries' ? 'Return to My Entries' : 'Try Again';

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex flex-col items-center py-8 text-center">
          <XCircleIcon className="h-16 w-16 text-red-400" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-white">
            Payment Cancelled
          </h1>
          <p className="mt-2 max-w-md text-sm text-gray-400">
            Your payment was not processed. No charges were made to your
            account.
          </p>

          {/* Action links */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={tryAgainHref}
              className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
            >
              {tryAgainLabel}
            </Link>
            <Link
              href="/member"
              className="rounded-lg border border-navy-700 px-5 py-2.5 text-sm font-medium text-gold-500 transition-colors hover:border-gold-500/30 hover:bg-gold-500/10"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
