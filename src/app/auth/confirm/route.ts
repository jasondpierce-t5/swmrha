import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/auth-js";

/**
 * GET /auth/confirm
 *
 * Handles email verification via token_hash flow.
 * Supabase sends users here after clicking the confirmation link in their email.
 * This is separate from /auth/callback because email confirmation uses
 * token_hash (not PKCE code exchange).
 *
 * Expected query params:
 *   - token_hash: The verification token from the email link
 *   - type: The OTP type (e.g., 'signup', 'email', 'recovery')
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      // Verification successful — redirect to member login with success message
      return NextResponse.redirect(
        new URL("/member/login?confirmed=true", origin)
      );
    }
  }

  // Verification failed or missing parameters — redirect with error
  return NextResponse.redirect(
    new URL("/member/register?error=verification_failed", origin)
  );
}
