import {
  HomeIcon,
  UserCircleIcon,
  BanknotesIcon,
  CreditCardIcon,
  TicketIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type MemberNavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
};

export const memberNavigation: MemberNavItem[] = [
  {
    label: "Dashboard",
    href: "/member",
    icon: HomeIcon,
    description: "Overview and membership status",
  },
  {
    label: "My Profile",
    href: "/member/profile",
    icon: UserCircleIcon,
    description: "View and edit your profile",
  },
  {
    label: "Pay Dues",
    href: "/member/pay-dues",
    icon: BanknotesIcon,
    description: "Pay or renew membership dues",
  },
  {
    label: "Payment History",
    href: "/member/payments",
    icon: CreditCardIcon,
    description: "View your payment history",
  },
  {
    label: "Enter Show",
    href: "/member/enter-show",
    icon: TicketIcon,
    description: "Register for an upcoming show",
  },
  {
    label: "My Entries",
    href: "/member/entries",
    icon: ClipboardDocumentListIcon,
    description: "View your show entries",
  },
];
