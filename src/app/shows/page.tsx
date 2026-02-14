import Image from "next/image";
import Link from "next/link";
import {
  CalendarDaysIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { pageTitle, showSchedule, venue } from "@/data/shows";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Show Schedule | SWMRHA",
  description:
    "View SWMRHA show schedules, event dates, locations, classes, and entry information for reining competitions",
  openGraph: {
    title: "Show Schedule | SWMRHA",
    description:
      "View SWMRHA show schedules, event dates, locations, classes, and entry information for reining competitions",
    type: "website",
    locale: "en_US",
    siteName: "SWMRHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Show Schedule | SWMRHA",
    description:
      "View SWMRHA show schedules, event dates, locations, classes, and entry information for reining competitions",
  },
};

export default function Shows() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="SMRHA Show Schedule"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-heading-1 text-white font-heading font-bold mb-4">
            {pageTitle}
          </h1>
          <p className="text-gold-500 font-heading text-xl max-w-2xl">
            Join us for premier reining events at Lucky J Arena in Carthage, MO
          </p>
        </div>
      </section>

      {/* Show Schedule Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {showSchedule.map((event, index) => (
              <div
                key={index}
                className="bg-navy-800 border border-gold-500/20 p-6 rounded-lg"
              >
                {/* Event Name */}
                <h2 className="text-heading-2 text-white mb-2">
                  {event.name}
                </h2>

                {/* Subtitle */}
                {event.subtitle && (
                  <p className="text-gold-500 italic mb-4">{event.subtitle}</p>
                )}

                {/* Dates */}
                <div className="flex items-start gap-2 mb-3">
                  <CalendarDaysIcon className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <p className="text-white font-medium">{event.dates}</p>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 mb-4">
                  <MapPinIcon className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <div className="text-slate-300">
                    <p>{event.location}</p>
                    <p>{event.venue}</p>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {event.links.map((link, linkIndex) =>
                    link.external ? (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:text-teal-400 underline text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={linkIndex}
                        href={link.url}
                        className="text-teal-500 hover:text-teal-400 underline text-sm"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>

                {/* Notes */}
                {event.notes && event.notes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-navy-700">
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

      {/* Venue Information Section */}
      <section className="bg-navy-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BuildingStorefrontIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">{venue.name}</h2>
          </div>
          <p className="text-slate-300 text-lg">{venue.location}</p>
        </div>
      </section>

      {/* Entry Instructions Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <TicketIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">How to Enter</h2>
          </div>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              Entries for SMRHA shows are quick and convenient. Each show card
              above provides direct links to enter your classes online.
            </p>

            <p>
              All online entries are processed through{" "}
              <a
                href="https://www.whitehorseshowmgt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-400 underline"
              >
                White Horse Show Management
              </a>
              . Their platform makes it easy to select your classes, manage your
              entries, and receive confirmation.
            </p>

            <p>
              For complete class lists, rules, and prize money information,
              please reference the show bill for each event. Show bills are
              available as downloadable PDFs on each show card.
            </p>

            <p>
              <strong className="text-white">Stall and RV Reservations:</strong>{" "}
              Stall and RV spaces can be reserved using the reservation maps
              linked on each show card. Early reservation is recommended to
              secure your preferred location.
            </p>

            <p>
              <strong className="text-white">Warm-Up Reservations:</strong> Paid
              warm-up times are available and can be reserved through SignUp
              Genius. Links to reserve your warm-up slot are provided on each
              show card.
            </p>

            <p className="text-gold-400 italic">
              For questions about entries or show details, please contact the
              show office or visit our{" "}
              <Link
                href="/contact"
                className="text-teal-500 hover:text-teal-400 underline"
              >
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
