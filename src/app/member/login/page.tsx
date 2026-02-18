"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmed = searchParams.get("confirmed") === "true";
  const verificationFailed =
    searchParams.get("error") === "verification_failed";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/member");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4">
      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-wide text-gold-500">
          SWMRHA
        </h1>
        <p className="mt-2 font-body text-sm text-gray-400">Member Login</p>
      </div>

      {/* Confirmation Banner */}
      {confirmed && (
        <div className="mb-4 w-full max-w-sm rounded-md border border-green-700 bg-green-900/50 px-4 py-3 text-center text-sm text-green-300">
          Email confirmed! You can now sign in.
        </div>
      )}

      {/* Verification Failed Banner */}
      {verificationFailed && (
        <div className="mb-4 w-full max-w-sm rounded-md border border-red-700 bg-red-900/50 px-4 py-3 text-center text-sm text-red-300">
          Email verification failed. Please try registering again.
        </div>
      )}

      {/* Login Card */}
      <div className="w-full max-w-sm rounded-lg border border-navy-700 bg-navy-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Links */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <Link
          href="/member/register"
          className="text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          Don&apos;t have an account? Register
        </Link>
        <Link
          href="/"
          className="text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          Return to site
        </Link>
      </div>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense>
      <MemberLoginForm />
    </Suspense>
  );
}
