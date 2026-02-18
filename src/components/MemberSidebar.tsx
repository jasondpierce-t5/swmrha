"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { memberNavigation } from "@/lib/member-navigation";

interface MemberSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MemberSidebar({ isOpen, onToggle }: MemberSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/member") {
      return pathname === "/member";
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-navy-700 bg-navy-800 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Branding */}
        <div className="flex h-16 items-center justify-between border-b border-navy-700 px-4">
          <div>
            <span className="font-heading text-xl font-bold text-gold-500">
              SWMRHA
            </span>
            <span className="ml-2 rounded bg-navy-700 px-2 py-0.5 text-xs font-medium text-gray-400">
              Member
            </span>
          </div>
          {/* Mobile close button */}
          <button
            type="button"
            className="p-1.5 text-gray-400 transition-colors hover:text-white lg:hidden"
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Member navigation">
          <ul className="space-y-1">
            {memberNavigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close mobile sidebar on navigation
                      if (isOpen) onToggle();
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-l-3 border-gold-500 bg-gold-500/10 text-gold-500"
                        : "text-gray-400 hover:bg-navy-700 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: View Site + Logout */}
        <div className="border-t border-navy-700 p-3 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-navy-700 hover:text-white"
          >
            <ArrowTopRightOnSquareIcon className="h-5 w-5 shrink-0" />
            View Site
          </a>
          <form action="/member/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-navy-700 hover:text-white"
              aria-label="Sign out"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5 shrink-0 text-gold-500" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
