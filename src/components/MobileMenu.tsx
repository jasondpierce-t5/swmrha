"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { navigation, type NavItem } from "@/lib/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    // Save the element that had focus before the menu opened
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the close button when menu opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Restore focus when closing
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on route change (skip initial mount)
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[60] bg-navy-900/[0.98] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Top bar with close button */}
      <div className="flex items-center justify-between px-4 h-16">
        <span className="font-heading text-gold-500 font-bold text-xl">
          SWMRHA
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          className="p-2 text-slate-300 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation links */}
      <nav
        className="flex-1 overflow-y-auto px-4 py-4"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <ul className="space-y-1">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedSections.has(item.label);
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full py-3 text-lg font-medium transition-colors ${
                      isActive(item)
                        ? "text-gold-500"
                        : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => toggleSection(item.label)}
                    aria-expanded={isExpanded}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="pl-4 pb-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block py-2.5 text-base transition-colors ${
                              isChildActive(child.href)
                                ? "text-gold-500"
                                : "text-slate-400 hover:text-white"
                            }`}
                            onClick={onClose}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-3 text-lg font-medium transition-colors ${
                    isActive(item)
                      ? "text-gold-500"
                      : "text-slate-300 hover:text-white"
                  }`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Join CTA at bottom */}
      <div className="px-4 py-6 border-t border-navy-600/50">
        <Link
          href="/membership/join"
          className="block w-full text-center bg-gold-500 text-navy-900 font-semibold px-6 py-3 rounded text-lg hover:bg-gold-400 transition-colors"
          onClick={onClose}
        >
          Join SWMRHA
        </Link>
      </div>
    </div>
  );
}
