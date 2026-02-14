import Image from "next/image";
import Link from "next/link";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import {
  heroImage,
  heroTitle,
  heroSubtitle,
  welcomeHeading,
  welcomeMessage,
  openInvitation,
  contactCallout,
  upcomingEvents,
  quickLinks,
  showAnnouncements,
  gagBuckleInfo,
} from "@/data/home";

export const metadata: Metadata = {
  title: "Home | SWMRHA",
  description:
    "Southwest Missouri Reining Horse Association — show schedules, results, membership info, and resources for reining enthusiasts",
  openGraph: {
    title: "Home | SWMRHA",
    description:
      "Southwest Missouri Reining Horse Association — show schedules, results, membership info, and resources for reining enthusiasts",
    type: "website",
    locale: "en_US",
    siteName: "SWMRHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | SWMRHA",
    description:
      "Southwest Missouri Reining Horse Association — show schedules, results, membership info, and resources for reining enthusiasts",
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
        {/* Background Image */}
        <Image
          src={heroImage}
          alt="Southwest Missouri Reining Horse Association"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] lg:min-h-[70vh] px-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-display text-white font-heading font-bold mb-4 max-w-4xl">
            {heroTitle}
          </h1>
          <p className="text-gold-500 font-heading uppercase tracking-wider text-lg sm:text-xl lg:text-2xl mb-8">
            {heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/shows/schedule"
              className="bg-gold-500 text-navy-900 font-bold px-8 py-3 rounded-lg hover:bg-gold-400 transition-colors"
            >
              View Show Schedule
            </Link>
            <Link
              href="/membership/join"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Join SMRHA
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 lg:py-24 text-center">
        <h2 className="text-heading-2 text-gold-500 mb-8">
          {welcomeHeading}
        </h2>

        <div className="space-y-6">
          {welcomeMessage.map((paragraph, index) => (
            <p key={index} className="text-lg text-slate-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="italic text-slate-400 mt-8">
          {openInvitation}
        </p>

        {/* Contact Callout Card */}
        <div className="bg-navy-700 rounded-card border border-navy-600 p-6 mt-8">
          <p className="text-slate-300">
            {contactCallout.split("918.520.9962")[0]}
            <span className="text-gold-500 font-semibold">918.520.9962</span>
          </p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-heading-1 text-center text-white mb-12">
            Upcoming Shows & Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-navy-700 rounded-card border border-navy-600 p-6 lg:p-8"
              >
                <h3 className="text-heading-3 text-gold-500 mb-2">
                  {event.name}
                </h3>
                <p className="text-slate-400 italic mb-4">{event.subtitle}</p>

                <div className="flex items-start gap-2 mb-3">
                  <CalendarDaysIcon className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <p className="text-white font-medium">{event.dates}</p>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <MapPinIcon className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <div className="text-slate-300">
                    <p>{event.location}</p>
                    <p>{event.venue}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {event.links.map((link, linkIndex) => (
                    link.external ? (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:text-teal-400 underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={linkIndex}
                        href={link.url}
                        className="text-teal-500 hover:text-teal-400 underline"
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>

                {event.notes && event.notes.length > 0 && (
                  <div className="mt-4">
                    {event.notes.map((note, noteIndex) => (
                      <p
                        key={noteIndex}
                        className="text-sm text-gold-400 italic"
                      >
                        {note}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="bg-navy-700 rounded-card border border-navy-600 p-6 text-center hover:border-gold-500 hover:bg-navy-600 transition-colors"
            >
              <span className="font-heading font-semibold text-white">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Show Announcements + GAG Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {showAnnouncements.map((announcement, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "text-heading-2 text-gold-500 mb-4"
                  : "text-lg text-slate-300 mb-2"
              }
            >
              {announcement}
            </p>
          ))}

          <div className="mt-8">
            {gagBuckleInfo.map((info, index) => (
              <p key={index} className="text-gold-400 font-semibold">
                {info}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
