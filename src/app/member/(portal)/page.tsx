import Link from "next/link";
import {
  UserCircleIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  EnvelopeIcon,
  BanknotesIcon,
  TicketIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { getMemberProfile } from "@/lib/actions/members";
import { getMemberPayments } from "@/lib/actions/payments";
import { getMemberEntries } from "@/lib/actions/show-entries";
import type { PaymentRow, ShowEntryWithClasses } from "@/types/database";

/** Color-coded badge for membership status. */
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: "border-green-700 bg-green-900/50 text-green-300",
    pending: "border-yellow-700 bg-yellow-900/50 text-yellow-300",
    expired: "border-red-700 bg-red-900/50 text-red-300",
    suspended: "border-red-700 bg-red-900/50 text-red-300",
  };

  const colors = colorMap[status] ?? "border-navy-600 bg-navy-700 text-gray-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}

/** Badge for membership type. */
function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-gold-500">
      {type}
    </span>
  );
}

/** Color-coded badge for payment status. */
function PaymentStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    succeeded: "border-green-700 bg-green-900/50 text-green-300",
    pending: "border-yellow-700 bg-yellow-900/50 text-yellow-300",
    failed: "border-red-700 bg-red-900/50 text-red-300",
    refunded: "border-blue-700 bg-blue-900/50 text-blue-300",
  };

  const colors = colorMap[status] ?? "border-navy-600 bg-navy-700 text-gray-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}

/** Format cents to dollar string. */
function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Format date string to readable date. */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Determine the renewal/payment CTA for the membership status card. */
function MembershipCTA({
  status,
  expiryDate,
}: {
  status: string;
  expiryDate: string | null;
}) {
  if (status === "expired") {
    return (
      <div className="mt-4 border-t border-navy-700 pt-4">
        <div className="rounded-lg border border-red-700/50 bg-red-900/20 p-3">
          <p className="text-sm font-medium text-red-300">
            Your membership has expired.
          </p>
          <Link
            href="/member/pay-dues"
            className="mt-2 inline-block text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
          >
            Renew Now &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mt-4 border-t border-navy-700 pt-4">
        <div className="rounded-lg border border-yellow-700/50 bg-yellow-900/20 p-3">
          <p className="text-sm font-medium text-yellow-300">
            Complete your membership payment to activate your account.
          </p>
          <Link
            href="/member/pay-dues"
            className="mt-2 inline-block text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
          >
            Pay Dues &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (status === "active" && expiryDate) {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry <= 30) {
      return (
        <div className="mt-4 border-t border-navy-700 pt-4">
          <div className="rounded-lg border border-yellow-700/50 bg-yellow-900/20 p-3">
            <p className="text-sm font-medium text-yellow-300">
              Your membership expires on{" "}
              {expiry.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              .
            </p>
            <Link
              href="/member/pay-dues"
              className="mt-2 inline-block text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Renew Early &rarr;
            </Link>
          </div>
        </div>
      );
    }

    // Active and not expiring soon
    return (
      <div className="mt-4 border-t border-navy-700 pt-4">
        <div className="rounded-lg border border-green-700/50 bg-green-900/20 p-3">
          <p className="text-sm text-green-300">
            Membership active through{" "}
            {expiry.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            .
          </p>
        </div>
      </div>
    );
  }

  // Active with no expiry date (lifetime)
  if (status === "active") {
    return (
      <div className="mt-4 border-t border-navy-700 pt-4">
        <div className="rounded-lg border border-green-700/50 bg-green-900/20 p-3">
          <p className="text-sm text-green-300">Membership active.</p>
        </div>
      </div>
    );
  }

  return null;
}

/** Color-coded badge for entry status. */
function EntryStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    draft: "border-gray-600 bg-gray-900/50 text-gray-300",
    pending_payment: "border-yellow-700 bg-yellow-900/50 text-yellow-300",
    confirmed: "border-green-700 bg-green-900/50 text-green-300",
    cancelled: "border-red-700 bg-red-900/50 text-red-300",
  };

  const labelMap: Record<string, string> = {
    draft: "Draft",
    pending_payment: "Pending Payment",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
  };

  const colors = colorMap[status] ?? "border-navy-600 bg-navy-700 text-gray-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {labelMap[status] ?? status}
    </span>
  );
}

/** Compact entry row for the dashboard preview. */
function EntryPreviewRow({
  entry,
}: {
  entry: ShowEntryWithClasses & { show_name: string };
}) {
  return (
    <div className="flex items-center justify-between border-b border-navy-700 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">
          {entry.horse_name} / {entry.rider_name}
        </p>
        <p className="text-xs text-gray-400">{entry.show_name}</p>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <span className="text-sm font-medium text-white">
          {formatAmount(entry.total_cents)}
        </span>
        <EntryStatusBadge status={entry.status} />
      </div>
    </div>
  );
}

/** Compact payment row for the dashboard preview. */
function PaymentPreviewRow({ payment }: { payment: PaymentRow }) {
  return (
    <div className="flex items-center justify-between border-b border-navy-700 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">
          {payment.description ?? payment.payment_type.replace(/_/g, " ")}
        </p>
        <p className="text-xs text-gray-400">{formatDate(payment.created_at)}</p>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <span className="text-sm font-medium text-white">
          {formatAmount(payment.amount_cents)}
        </span>
        <PaymentStatusBadge status={payment.status} />
      </div>
    </div>
  );
}

export default async function MemberDashboardPage() {
  const [profileResult, paymentsResult, entriesResult] = await Promise.all([
    getMemberProfile(),
    getMemberPayments(),
    getMemberEntries(),
  ]);

  // Error state
  if ("error" in profileResult) {
    return (
      <div className="space-y-8">
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-6">
          <h2 className="font-heading text-lg font-semibold text-red-300">
            Unable to Load Profile
          </h2>
          <p className="mt-2 text-sm text-red-200">{profileResult.error}</p>
        </div>
      </div>
    );
  }

  const member = profileResult;
  const fullName =
    `${member.first_name} ${member.last_name}`.trim() || "Member";

  // Get recent payments (last 3)
  const payments = Array.isArray(paymentsResult) ? paymentsResult : [];
  const recentPayments = payments.slice(0, 3);

  // Get recent show entries (last 3, only non-cancelled)
  const allEntries = Array.isArray(entriesResult) ? entriesResult : [];
  const activeEntries = allEntries.filter((e) => e.status !== "cancelled");
  const recentEntries = activeEntries.slice(0, 3);

  const quickLinks = [
    {
      label: "Edit Profile",
      href: "/member/profile/edit",
      icon: UserCircleIcon,
      description: "Update your personal information",
    },
    {
      label: "Pay Dues",
      href: "/member/pay-dues",
      icon: BanknotesIcon,
      description: "Pay or renew membership",
    },
    {
      label: "Enter Show",
      href: "/member/enter-show",
      icon: TicketIcon,
      description: "Register for an upcoming show",
    },
    {
      label: "View Shows",
      href: "/shows",
      icon: CalendarDaysIcon,
      description: "Browse upcoming shows and events",
    },
    {
      label: "Payment History",
      href: "/member/payments",
      icon: CreditCardIcon,
      description: "View your transactions",
    },
    {
      label: "My Entries",
      href: "/member/entries",
      icon: ClipboardDocumentListIcon,
      description: "View your show entries",
    },
    {
      label: "Purchase Fees",
      href: "/member/purchase",
      icon: BanknotesIcon,
      description: "Stall fees, banquet tickets & more",
    },
    {
      label: "Contact Us",
      href: "/contact",
      icon: EnvelopeIcon,
      description: "Get in touch with SWMRHA",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-2xl font-bold text-white">
            Welcome back, {member.first_name || "Member"}!
          </h2>
          <div className="flex gap-2">
            <TypeBadge type={member.membership_type} />
            <StatusBadge status={member.membership_status} />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-400">SWMRHA Member Portal</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Membership Status Card */}
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <h3 className="font-heading text-lg font-semibold text-white">
            Membership Status
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Type</span>
              <TypeBadge type={member.membership_type} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Status</span>
              <StatusBadge status={member.membership_status} />
            </div>
            {member.membership_start && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Start Date</span>
                <span className="text-sm text-white">
                  {new Date(member.membership_start).toLocaleDateString()}
                </span>
              </div>
            )}
            {member.membership_expiry && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Expiry Date</span>
                <span className="text-sm text-white">
                  {new Date(member.membership_expiry).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          {/* Contextual renewal / payment CTA */}
          <MembershipCTA
            status={member.membership_status}
            expiryDate={member.membership_expiry}
          />
        </div>

        {/* Profile Summary Card */}
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-white">
              Profile Summary
            </h3>
            <Link
              href="/member/profile/edit"
              className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Edit Profile &rarr;
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Name</span>
              <span className="text-sm text-white">{fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Email</span>
              <span className="max-w-[200px] truncate text-sm text-white">
                {member.email}
              </span>
            </div>
            {member.phone && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Phone</span>
                <span className="text-sm text-white">{member.phone}</span>
              </div>
            )}
            {(member.city || member.state) && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Location</span>
                <span className="text-sm text-white">
                  {[member.city, member.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-white">
          Quick Links
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-800 p-4 transition-colors hover:border-navy-600 hover:bg-navy-700"
              >
                <Icon className="h-6 w-6 shrink-0 text-gold-500" />
                <div>
                  <p className="text-sm font-medium text-white">{link.label}</p>
                  <p className="text-xs text-gray-400">{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Payment History Preview */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-white">
            Payment History
          </h3>
          {payments.length > 0 && (
            <Link
              href="/member/payments"
              className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              View All &rarr;
            </Link>
          )}
        </div>
        {recentPayments.length > 0 ? (
          <div className="mt-4">
            {recentPayments.map((payment) => (
              <PaymentPreviewRow key={payment.id} payment={payment} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
            <CreditCardIcon className="h-12 w-12 text-navy-600" />
            <p className="mt-3 text-sm text-gray-400">
              No payment history yet. Your transactions will appear here once
              you make a payment.
            </p>
          </div>
        )}
      </div>

      {/* Show Entries Preview */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-white">
            Show Entries
          </h3>
          {activeEntries.length > 0 && (
            <Link
              href="/member/entries"
              className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              View All &rarr;
            </Link>
          )}
        </div>
        {recentEntries.length > 0 ? (
          <div className="mt-4">
            {recentEntries.map((entry) => (
              <EntryPreviewRow key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
            <TicketIcon className="h-12 w-12 text-navy-600" />
            <p className="mt-3 text-sm text-gray-400">
              No show entries yet. Enter an upcoming show to get started!
            </p>
            <Link
              href="/member/enter-show"
              className="mt-4 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
            >
              Enter a Show &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
