import Link from "next/link";
import { getMemberProfile } from "@/lib/actions/members";

/** Format a date string for display, or return null. */
function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString();
}

/** Display a profile field value, with "Not provided" fallback for empty optional fields. */
function FieldValue({ value }: { value: string | null | undefined }) {
  if (!value) {
    return <span className="italic text-gray-600">Not provided</span>;
  }
  return <span className="text-white">{value}</span>;
}

/** Color-coded badge for membership status. */
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: "border-green-700 bg-green-900/50 text-green-300",
    pending: "border-yellow-700 bg-yellow-900/50 text-yellow-300",
    expired: "border-red-700 bg-red-900/50 text-red-300",
    suspended: "border-red-700 bg-red-900/50 text-red-300",
  };

  const colors =
    colorMap[status] ?? "border-navy-600 bg-navy-700 text-gray-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}

export default async function MemberProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const result = await getMemberProfile();

  // Error state
  if ("error" in result) {
    return (
      <div className="space-y-6">
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

  return (
    <div className="space-y-6">
      {/* Success banner */}
      {params.success === "updated" && (
        <div className="rounded-lg border border-green-700 bg-green-900/30 p-4">
          <p className="text-sm font-medium text-green-300">
            Your profile has been updated successfully.
          </p>
        </div>
      )}

      {/* Header with Edit button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            View and manage your personal information.
          </p>
        </div>
        <Link
          href="/member/profile/edit"
          className="rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          Edit Profile
        </Link>
      </div>

      {/* Personal Info Section */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h2 className="font-heading text-lg font-semibold text-white">
          Personal Information
        </h2>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">First Name</p>
              <p className="mt-1 text-white">{member.first_name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Name</p>
              <p className="mt-1 text-white">{member.last_name || "—"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="mt-1 text-white">{member.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="mt-1">
                <FieldValue value={member.phone} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h2 className="font-heading text-lg font-semibold text-white">
          Address
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-gray-400">Address Line 1</p>
            <p className="mt-1">
              <FieldValue value={member.address_line1} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Address Line 2</p>
            <p className="mt-1">
              <FieldValue value={member.address_line2} />
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">City</p>
              <p className="mt-1">
                <FieldValue value={member.city} />
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">State</p>
              <p className="mt-1">
                <FieldValue value={member.state} />
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">ZIP Code</p>
              <p className="mt-1">
                <FieldValue value={member.zip} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Info Section (read-only) */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h2 className="font-heading text-lg font-semibold text-white">
          Membership Information
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Managed by SWMRHA administration. Contact us to make changes.
        </p>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">Membership Type</p>
              <p className="mt-1 capitalize text-white">
                {member.membership_type}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Membership Status</p>
              <p className="mt-1">
                <StatusBadge status={member.membership_status} />
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="mt-1">
                <FieldValue value={formatDate(member.membership_start)} />
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Expiry Date</p>
              <p className="mt-1">
                <FieldValue value={formatDate(member.membership_expiry)} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Dashboard link */}
      <div>
        <Link
          href="/member"
          className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
