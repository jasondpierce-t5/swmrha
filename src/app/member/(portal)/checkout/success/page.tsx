import Link from "next/link";
import { getPaymentBySessionId } from "@/lib/actions/payments";
import type { PaymentRow } from "@/types/database";

// ---------------------------------------------------------------------------
// Inline SVG icons
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

function ClockIcon({ className }: { className?: string }) {
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
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format cents to a dollar string, e.g. 5000 -> "$50.00". */
function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Format a date string for display. */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // Attempt to load payment details
  let payment: PaymentRow | null = null;

  if (sessionId) {
    const result = await getPaymentBySessionId(sessionId);
    if (result && !("error" in result)) {
      payment = result;
    }
  }

  // --- State: Payment succeeded ---
  if (payment && payment.status === "succeeded") {
    const isEntryPayment = payment.payment_type === "entry_fees";

    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-400" />
            <h1 className="mt-4 font-heading text-2xl font-bold text-white">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {isEntryPayment
                ? "Your show entries have been confirmed. Thank you!"
                : "Your membership has been activated. Thank you for your support!"}
            </p>

            {/* Payment details */}
            <div className="mt-6 w-full max-w-sm rounded-lg border border-navy-600 bg-navy-900/50 p-4 text-left">
              <h2 className="text-sm font-semibold text-gray-300">
                Payment Details
              </h2>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-medium text-white">
                    {formatCents(payment.amount_cents)}
                  </span>
                </div>
                {payment.membership_type_slug && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Membership</span>
                    <span className="capitalize text-white">
                      {payment.membership_type_slug.replace(/-/g, " ")}
                    </span>
                  </div>
                )}
                {isEntryPayment && payment.description && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Description</span>
                    <span className="text-white">
                      {payment.description}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">
                    {formatDate(payment.created_at)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="inline-flex items-center rounded-full border border-green-700 bg-green-900/50 px-2 py-0.5 text-xs font-medium capitalize text-green-300">
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action links */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/member"
                className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
              >
                Back to Dashboard
              </Link>
              <Link
                href={isEntryPayment ? "/member/entries" : "/member/payments"}
                className="rounded-lg border border-navy-700 px-5 py-2.5 text-sm font-medium text-gold-500 transition-colors hover:border-gold-500/30 hover:bg-gold-500/10"
              >
                {isEntryPayment ? "View My Entries" : "View Payment History"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- State: Payment still processing ---
  if (payment && payment.status === "pending") {
    const isEntryPayment = payment.payment_type === "entry_fees";

    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <div className="flex flex-col items-center py-8 text-center">
            <ClockIcon className="h-16 w-16 text-yellow-400" />
            <h1 className="mt-4 font-heading text-2xl font-bold text-white">
              Payment Processing
            </h1>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              Your payment is being processed. This usually takes a moment.
              {isEntryPayment
                ? " Your entries will be confirmed once the payment is processed."
                : " Your membership will be activated once the payment is confirmed."}
            </p>

            <div className="mt-8">
              <Link
                href="/member"
                className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- State: No session_id or no payment found (generic success) ---
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-400" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-white">
            Thank You for Your Payment!
          </h1>
          <p className="mt-2 max-w-md text-sm text-gray-400">
            Your payment has been received. If your membership status does not
            update shortly, please contact us.
          </p>

          <div className="mt-8">
            <Link
              href="/member"
              className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
