"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function MemberRegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validate()) return;

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4">
        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-wide text-gold-500">
            SWMRHA
          </h1>
          <p className="mt-2 font-body text-sm text-gray-400">
            Member Registration
          </p>
        </div>

        {/* Success Card */}
        <div className="w-full max-w-sm rounded-lg border border-navy-700 bg-navy-800 p-8 text-center">
          <div className="mb-4 text-4xl">&#9993;</div>
          <h2 className="mb-3 font-heading text-xl font-semibold text-white">
            Check Your Email
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-gray-300">
            Check your email to confirm your account. You&apos;ll receive a
            verification link shortly.
          </p>
          <Link
            href="/member/login"
            className="inline-block w-full rounded-md bg-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
          >
            Go to Sign In
          </Link>
        </div>

        {/* Return Link */}
        <Link
          href="/"
          className="mt-6 text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          Return to site
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4">
      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-wide text-gold-500">
          SWMRHA
        </h1>
        <p className="mt-2 font-body text-sm text-gray-400">
          Member Registration
        </p>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-sm rounded-lg border border-navy-700 bg-navy-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-error" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-error" role="alert">
                {fieldErrors.confirmPassword}
              </p>
            )}
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>

      {/* Links */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <Link
          href="/member/login"
          className="text-sm text-gray-400 transition-colors hover:text-gold-500"
        >
          Already have an account? Sign In
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
