export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shows",
    href: "/shows",
    children: [
      { label: "Show Schedule", href: "/shows/schedule" },
      { label: "Results & Standings", href: "/shows/results" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "Membership",
    href: "/membership",
    children: [
      { label: "Join SWMRHA", href: "/membership/join" },
      { label: "Rules & Classes", href: "/membership/rules" },
      { label: "Green as Grass", href: "/membership/green-as-grass" },
      { label: "Demo (Online Payments)", href: "/board-demo" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Find a Trainer", href: "/resources/find-a-trainer" },
      { label: "Sponsors", href: "/sponsors" },
      { label: "FAQ", href: "/resources/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
