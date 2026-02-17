"use client";

import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { adminNavigation } from "@/lib/admin-navigation";

interface AdminHeaderProps {
  userEmail: string;
  onMenuToggle: () => void;
}

export default function AdminHeader({
  userEmail,
  onMenuToggle,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Derive current page title from admin nav config
  const currentNav = adminNavigation.find((item) => {
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  });
  const pageTitle = currentNav?.label ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-700 bg-navy-800 px-4 lg:px-6">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-1.5 text-gray-400 transition-colors hover:text-white lg:hidden"
          onClick={onMenuToggle}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-white">
          {pageTitle}
        </h1>
      </div>

      {/* Right: user email + logout */}
      <div className="flex items-center gap-4">
        <span className="hidden max-w-[200px] truncate text-sm text-gray-400 sm:block">
          {userEmail}
        </span>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-navy-700 hover:text-white"
            aria-label="Sign out"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-gold-500" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
