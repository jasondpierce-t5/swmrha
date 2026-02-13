import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery | SMRHA",
  description:
    "Browse photos from SMRHA events and shows. See our reining community in action at Southwest Missouri Reining Horse Association.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
