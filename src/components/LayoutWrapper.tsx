"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Admin and login routes use their own layouts — no public Header/Footer
  const isAdminOrAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isAdminOrAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
      <Footer />
    </>
  );
}
