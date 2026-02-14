import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership | SWMRHA",
  description:
    "Join SWMRHA and become part of southwest Missouri's premier reining horse association with benefits and events",
  openGraph: {
    title: "Membership | SWMRHA",
    description:
      "Join SWMRHA and become part of southwest Missouri's premier reining horse association with benefits and events",
    type: "website",
    locale: "en_US",
    siteName: "SWMRHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Membership | SWMRHA",
    description:
      "Join SWMRHA and become part of southwest Missouri's premier reining horse association with benefits and events",
  },
};

export default function Membership() {
  return (
    <main>
      <h1>Membership</h1>
    </main>
  );
}
