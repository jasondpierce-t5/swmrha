import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SWMRHA - Southwest Missouri Reining Horse Association",
  description:
    "The official website of the Southwest Missouri Reining Horse Association — show schedules, results, membership, and resources for reining horse enthusiasts in southwest Missouri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Southwest Missouri Reining Horse Association",
    alternateName: "SWMRHA",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://swmrha.org",
    sameAs: ["https://www.facebook.com/RockingHLLC"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Inquiries",
      email: "jeromylipps@yahoo.com",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
