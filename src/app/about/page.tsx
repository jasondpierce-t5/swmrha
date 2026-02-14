import { UserCircleIcon } from "@heroicons/react/24/solid";
import { mission, boardMembers, openInvitation } from "@/data/about";
import { officers, subtitle } from "@/data/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | SWMRHA",
  description:
    "Learn about SWMRHA's mission, history, and meet our board of directors leading southwest Missouri's premier reining association",
  openGraph: {
    title: "About | SWMRHA",
    description:
      "Learn about SWMRHA's mission, history, and meet our board of directors leading southwest Missouri's premier reining association",
    type: "website",
    locale: "en_US",
    siteName: "SWMRHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | SWMRHA",
    description:
      "Learn about SWMRHA's mission, history, and meet our board of directors leading southwest Missouri's premier reining association",
  },
};

export default function About() {
  return (
    <>
      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-heading-1 text-center text-white mb-4">
            About SWMRHA
          </h1>
          <p className="text-gold-500 text-center font-heading text-xl mb-12">
            Promoting the Sport of Reining at the Grassroots Level
          </p>

          <div className="space-y-6">
            {mission.map((paragraph, index) => (
              <p key={index} className="text-lg text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <blockquote className="italic text-slate-400 mt-8 border-l-4 border-gold-500 pl-6">
            {openInvitation}
          </blockquote>
        </div>
      </section>

      {/* Officers & Board Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-heading-1 text-center text-white mb-4">
            Officers & Board Members
          </h2>
          <p className="text-slate-400 text-center mb-12">{subtitle}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {officers.map((officer, index) => (
              <div
                key={index}
                className="bg-navy-700 rounded-card border border-navy-600 p-6 text-center"
              >
                {/* Placeholder Avatar */}
                <div className="w-20 h-20 rounded-full bg-navy-600 mx-auto mb-4 flex items-center justify-center">
                  <UserCircleIcon className="w-12 h-12 text-slate-500" />
                </div>

                {/* Name */}
                <h3 className="font-heading font-semibold text-white text-lg">
                  {officer.name}
                </h3>

                {/* Role */}
                <p className="text-gold-500 text-sm font-medium uppercase tracking-wide mt-1">
                  {officer.role}
                </p>

                {/* Phone */}
                <a
                  href={`tel:${officer.phone.replace(/[^\d+]/g, "")}`}
                  className="text-slate-400 text-sm mt-2 block hover:text-slate-300"
                >
                  {officer.phone}
                </a>

                {/* Email */}
                {officer.email && (
                  <a
                    href={`mailto:${officer.email}`}
                    className="text-teal-500 text-sm hover:text-teal-400 block mt-1"
                  >
                    {officer.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Friends of The SMRHA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-heading-2 text-center text-gold-500 mb-8">
            Friends of The SMRHA
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {boardMembers.map((member, index) => (
              <div
                key={index}
                className="bg-navy-700 rounded-full px-6 py-3 border border-navy-600 font-heading text-white"
              >
                {member.name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
