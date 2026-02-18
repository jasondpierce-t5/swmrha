import Link from "next/link";
import { getMemberProfile } from "@/lib/actions/members";
import ProfileForm from "@/components/ProfileForm";

export default async function MemberProfileEditPage() {
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
        <Link
          href="/member/profile"
          className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
        >
          &larr; Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/member/profile"
          className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
        >
          &larr; Back to Profile
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white">
          Edit Profile
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Update your personal information and address.
        </p>
      </div>

      {/* Profile form */}
      <ProfileForm member={result} />
    </div>
  );
}
