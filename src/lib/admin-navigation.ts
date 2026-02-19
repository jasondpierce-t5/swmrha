import {
  HomeIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  TrophyIcon,
  UserGroupIcon,
  TagIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
};

export const adminNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: HomeIcon,
    description: "Overview and quick actions",
  },
  {
    label: "Shows",
    href: "/admin/shows",
    icon: CalendarDaysIcon,
    description: "Manage show schedule and events",
  },
  {
    label: "Sponsors",
    href: "/admin/sponsors",
    icon: BuildingStorefrontIcon,
    description: "Manage sponsor listings",
  },
  {
    label: "Results",
    href: "/admin/results",
    icon: TrophyIcon,
    description: "Manage show results and standings",
  },
  {
    label: "Members",
    href: "/admin/members",
    icon: UserGroupIcon,
    description: "View and manage members",
  },
  {
    label: "Membership Types",
    href: "/admin/membership-types",
    icon: TagIcon,
    description: "Configure membership tiers and pricing",
  },
  {
    label: "Fee Items",
    href: "/admin/fees",
    icon: BanknotesIcon,
    description: "Manage stall fees, banquet tickets, and charges",
  },
];
