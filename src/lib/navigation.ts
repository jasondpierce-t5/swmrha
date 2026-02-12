export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Shows & Events",
    href: "/shows",
    children: [
      { label: "Show Schedule", href: "/shows/schedule" },
      { label: "Results & Standings", href: "/shows/results" },
    ],
  },
  {
    label: "Membership",
    href: "/membership",
    children: [
      { label: "Join SWMRHA", href: "/membership/join" },
      { label: "Rules & Classes", href: "/membership/rules" },
      { label: "Green as Grass", href: "/membership/green-as-grass" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "FAQ", href: "/resources/faq" },
      { label: "Find a Trainer", href: "/resources/find-a-trainer" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];
