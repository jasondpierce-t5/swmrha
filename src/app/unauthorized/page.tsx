import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied | SWMRHA",
  description: "You don't have permission to access this area.",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4 text-center">
      <LockClosedIcon className="h-16 w-16 text-gold-500" />

      <h1 className="mt-6 font-heading text-3xl font-bold text-white">
        Access Denied
      </h1>

      <p className="mt-4 max-w-md text-gray-400">
        You don&apos;t have permission to access this area. This section is
        restricted to SWMRHA administrators.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          Go to Login
        </Link>
        <Link
          href="/"
          className="rounded-md bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
