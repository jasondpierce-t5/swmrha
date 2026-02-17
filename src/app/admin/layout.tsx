import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutShell from "@/components/AdminLayoutShell";

export const metadata = {
  title: "Admin | SWMRHA",
  description: "SWMRHA administration dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense-in-depth — middleware already protects, but double-check
  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/login");
  }

  return (
    <AdminLayoutShell userEmail={user.email ?? "Admin"}>
      {children}
    </AdminLayoutShell>
  );
}
