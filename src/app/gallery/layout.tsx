import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery | SWMRHA",
  description:
    "Browse photos from SWMRHA events and shows. See our reining community in action at Southwest Missouri Reining Horse Association",
  openGraph: {
    title: "Photo Gallery | SWMRHA",
    description:
      "Browse photos from SWMRHA events and shows. See our reining community in action at Southwest Missouri Reining Horse Association",
    type: "website",
    locale: "en_US",
    siteName: "SWMRHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Gallery | SWMRHA",
    description:
      "Browse photos from SWMRHA events and shows. See our reining community in action at Southwest Missouri Reining Horse Association",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
