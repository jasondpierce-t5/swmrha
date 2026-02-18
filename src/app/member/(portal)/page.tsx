import Link from "next/link";
import {
  UserCircleIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { getMemberProfile } from "@/lib/actions/members";

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

export default async function MemberDashboardPage() {
  const result = await getMemberProfile();

  // Error state
  if ("error" in result) {
    return (
      <div className="space-y-8">
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-6">
          <h2 className="font-heading text-lg font-semibold text-red-300">
            Unable to Load Profile
          </h2>
          <p className="mt-2 text-sm text-red-200">{result.error}</p>
        </div>
      </div>
    );
  }

  const member = result;
  const fullName =
    `${member.first_name} ${member.last_name}`.trim() || "Member";

  const quickLinks = [
    {
      label: "Edit Profile",
      href: "/member/profile/edit",
      icon: UserCircleIcon,
      description: "Update your personal information",
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
        <p className="mt-2 text-sm text-gray-400">
          SWMRHA Member Portal
        </p>
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
          {/* Renew placeholder — Phase 17 */}
          {member.membership_status === "expired" && (
            <div className="mt-4 border-t border-navy-700 pt-4">
              <span className="text-sm text-gold-500">
                Renewal will be available soon.
              </span>
            </div>
          )}
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
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <h3 className="font-heading text-lg font-semibold text-white">
          Payment History
        </h3>
        <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
          <CreditCardIcon className="h-12 w-12 text-navy-600" />
          <p className="mt-3 text-sm text-gray-400">
            No payment history yet. Your transactions will appear here once you
            make a payment.
          </p>
        </div>
      </div>
    </div>
  );
}
