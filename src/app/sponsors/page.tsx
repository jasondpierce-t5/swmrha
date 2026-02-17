import Image from "next/image";
import Link from "next/link";
import {
  HeartIcon,
  ArrowTopRightOnSquareIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import {
  intro,
  signupUrl,
  sponsorLevels,
  sponsorLevelsHeading,
} from "@/data/sponsors";
import { getSponsors } from "@/lib/actions/sponsors";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors | SWMRHA",
  description:
    "Thank you to our sponsors who make SWMRHA shows and events possible. Learn about sponsorship opportunities and benefits",
  openGraph: {
    title: "Sponsors | SWMRHA",
    description:
      "Thank you to our sponsors who make SWMRHA shows and events possible. Learn about sponsorship opportunities and benefits",
    type: "website",
    locale: "en_US",
    siteName: "SWMRHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors | SWMRHA",
    description:
      "Thank you to our sponsors who make SWMRHA shows and events possible. Learn about sponsorship opportunities and benefits",
  },
};

export default async function Sponsors() {
  const result = await getSponsors();
  const sponsors = Array.isArray(result) ? result : [];

  // Group sponsors by tier
  const tiers = ["Platinum", "Diamond", "Gold", "Silver", "Bronze"];
  const sponsorsByTier = tiers.map((tier) => ({
    tier,
    sponsors: sponsors.filter((s) => s.level === tier),
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Our Sponsors"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-heading-1 text-white font-heading font-bold mb-4">
            Our Sponsors
          </h1>
          <p className="text-gold-500 font-heading text-xl max-w-2xl">
            {intro}
          </p>
        </div>
      </section>

      {/* Sponsors Grid by Tier */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {sponsors.length === 0 ? (
            <div className="text-center py-12">
              <BuildingStorefrontIcon className="w-12 h-12 text-gold-500/50 mx-auto mb-4" />
              <p className="text-slate-300 text-lg">
                No sponsors listed yet. Check back soon!
              </p>
            </div>
          ) : (
          <div className="space-y-16">
            {sponsorsByTier.map(
              ({ tier, sponsors: tierSponsors }) =>
                tierSponsors.length > 0 && (
                  <div key={tier}>
                    <h2 className="text-heading-2 text-white text-center mb-8">
                      {tier} Sponsors
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {tierSponsors.map((sponsor) => {
                        const logoHeight =
                          tier === "Platinum"
                            ? "h-32"
                            : tier === "Diamond" || tier === "Gold"
                              ? "h-24"
                              : "h-20";

                        const cardContent = (
                          <div className="bg-navy-900 border border-gold-500/20 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 hover:border-gold-500/40 transition-colors group">
                            {sponsor.image_url && (
                              <div
                                className={`relative ${logoHeight} w-full flex items-center justify-center`}
                              >
                                <img
                                  src={sponsor.image_url}
                                  alt={sponsor.name}
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            )}
                            <div className="text-center">
                              <h3 className="text-white font-heading font-bold text-lg">
                                {sponsor.name}
                              </h3>
                              {sponsor.website_url && (
                                <div className="flex items-center justify-center gap-1 mt-2">
                                  <span className="text-teal-500 text-sm">
                                    Visit Website
                                  </span>
                                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              )}
                            </div>
                          </div>
                        );

                        return sponsor.website_url ? (
                          <Link
                            key={sponsor.name}
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {cardContent}
                          </Link>
                        ) : (
                          <div key={sponsor.name}>{cardContent}</div>
                        );
                      })}
                    </div>
                  </div>
                )
            )}
          </div>
          )}
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HeartIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Become a Sponsor</h2>
          </div>

          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            {intro}
          </p>

          <a
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 font-heading font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Sign Up to Sponsor
          </a>
        </div>
      </section>

      {/* Sponsorship Levels */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-heading-2 text-white text-center mb-12">
            {sponsorLevelsHeading}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sponsorLevels.map((level) => {
              const isPlatinum = level.name.includes("Platinum");
              const borderClass = isPlatinum
                ? "border-gold-500"
                : "border-gold-500/50";

              return (
                <div
                  key={level.name}
                  className={`bg-navy-900 border ${borderClass} rounded-lg p-6`}
                >
                  <h3 className="text-heading-3 text-white mb-2">
                    {level.name}
                  </h3>
                  {level.amount && (
                    <p className="text-gold-500 font-heading font-bold text-xl mb-4">
                      {level.amount}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {level.benefits.map((benefit, index) => (
                      <li key={index} className="text-slate-300 text-sm">
                        <span className="text-gold-500 mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
