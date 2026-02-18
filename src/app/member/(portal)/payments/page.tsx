import Link from "next/link";

/** Inline credit card / receipt SVG icon -- no external dependency needed. */
function CreditCardIcon({ className }: { className?: string }) {
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
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
      />
    </svg>
  );
}

export default function MemberPaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          View your membership payments and show entry transactions.
        </p>
      </div>

      {/* Empty state card */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CreditCardIcon className="h-16 w-16 text-navy-600" />
          <h2 className="mt-4 font-heading text-lg font-semibold text-white">
            No Payments Yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-400">
            Your payment history will appear here once you make a membership
            payment or show entry.
          </p>
          <Link
            href="/membership"
            className="mt-6 rounded-lg border border-navy-700 px-4 py-2.5 text-sm font-medium text-gold-500 transition-colors hover:border-gold-500/30 hover:bg-gold-500/10"
          >
            View Membership Info
          </Link>
        </div>
      </div>
    </div>
  );
}
