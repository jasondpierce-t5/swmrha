import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MemberLayoutShell from "@/components/MemberLayoutShell";

export const metadata = {
  title: "Member Portal | SWMRHA",
  description: "SWMRHA member portal",
};

export default async function MemberPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense-in-depth — middleware already protects, but double-check
  if (!user) {
    redirect("/member/login");
  }

  // Fetch member profile for display name
  const { data: member } = await supabase
    .from("members")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const userName = member
    ? `${member.first_name} ${member.last_name}`.trim() || user.email || "Member"
    : user.email || "Member";

  return (
    <MemberLayoutShell userName={userName}>
      {children}
    </MemberLayoutShell>
  );
}
