"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { navigation, type NavItem } from "@/lib/navigation";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = useCallback(
    (item: NavItem) => {
      if (item.href === "/") {
        return pathname === "/";
      }
      return pathname === item.href || pathname.startsWith(item.href + "/");
    },
    [pathname]
  );

  const isChildActive = useCallback(
    (href: string) => {
      return pathname === href;
    },
    [pathname]
  );

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-sm border-b border-navy-600/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logos/swmrha-logo.jpg"
                alt="SWMRHA - Southwest Missouri Reining Horse Association"
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navigation.map((item) => {
                if (item.children) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(item.label)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <button
                        type="button"
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                          isActive(item)
                            ? "text-gold-500"
                            : "text-slate-300 hover:text-white"
                        }`}
                        aria-expanded={openDropdown === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${
                            openDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-navy-700 border border-navy-600 rounded-lg shadow-xl py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-4 py-2.5 text-sm transition-colors ${
                                isChildActive(child.href)
                                  ? "text-gold-500 bg-navy-600/50"
                                  : "text-slate-300 hover:text-white hover:bg-navy-600"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                      isActive(item)
                        ? "text-gold-500"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Join CTA */}
              <Link
                href="/membership/join"
                className="ml-3 bg-gold-500 text-navy-900 font-semibold px-4 py-2 rounded text-sm hover:bg-gold-400 transition-colors"
              >
                Join
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
