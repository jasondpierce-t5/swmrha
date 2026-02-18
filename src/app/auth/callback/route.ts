import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Role-aware redirect: admin → /admin, member → /member
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.app_metadata?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", origin));
      }

      // Default redirect for members and any other authenticated users
      return NextResponse.redirect(new URL("/member", origin));
    }
  }

  // If no code or exchange failed, redirect to login
  return NextResponse.redirect(new URL("/login", origin));
}
