import Image from "next/image";
import Link from "next/link";
import {
  UsersIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  officers,
  subtitle,
  mailingAddress,
  socialMedia,
  primaryContact,
} from "@/data/contact";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SMRHA",
  description:
    "Get in touch with SMRHA officers and board members. Find contact information, mailing address, and social media links.",
};

export default function Contact() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Contact Us"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-heading-1 text-white font-heading font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-gold-500 font-heading text-xl max-w-2xl">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-8">
            <h2 className="text-heading-2 text-white text-center mb-6">
              Need Help?
            </h2>
            <p className="text-slate-300 text-center mb-8">
              Have questions about membership or shows? Contact our president
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Quick Link */}
              <a
                href={`mailto:${primaryContact.email}`}
                className="flex items-center justify-center gap-3 bg-navy-900 border border-gold-500/20 hover:border-gold-500/40 rounded-lg p-6 transition-colors group"
              >
                <EnvelopeIcon className="w-8 h-8 text-gold-500" />
                <div className="text-left">
                  <p className="text-white font-heading font-bold mb-1">
                    Email Us
                  </p>
                  <p className="text-teal-500 text-sm group-hover:text-teal-400 transition-colors">
                    {primaryContact.email}
                  </p>
                </div>
              </a>

              {/* Phone Quick Link */}
              <a
                href={`tel:${primaryContact.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center justify-center gap-3 bg-navy-900 border border-gold-500/20 hover:border-gold-500/40 rounded-lg p-6 transition-colors group"
              >
                <PhoneIcon className="w-8 h-8 text-gold-500" />
                <div className="text-left">
                  <p className="text-white font-heading font-bold mb-1">
                    Call Us
                  </p>
                  <p className="text-teal-500 text-sm group-hover:text-teal-400 transition-colors">
                    {primaryContact.phone}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Contact Callout */}
      <section className="bg-navy-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-navy-900 border border-gold-500 rounded-lg p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <StarIcon className="w-8 h-8 text-gold-500" />
              <h2 className="text-heading-2 text-white">Primary Contact</h2>
            </div>

            <div className="text-center space-y-4">
              <div>
                <h3 className="text-white font-heading font-bold text-xl mb-2">
                  {primaryContact.name}
                </h3>
                <p className="text-gold-500 font-heading">{primaryContact.role}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href={`tel:${primaryContact.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-2 text-teal-500 hover:text-teal-400 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span className="text-lg">{primaryContact.phone}</span>
                </a>
                <span className="hidden sm:inline text-slate-600">|</span>
                <a
                  href={`mailto:${primaryContact.email}`}
                  className="flex items-center gap-2 text-teal-500 hover:text-teal-400 transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="text-lg">{primaryContact.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Officers & Board Members Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <UsersIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">
              Officers & Board Members
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officers.map((officer) => (
              <div
                key={officer.name}
                className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 flex flex-col items-center text-center space-y-4"
              >
                {/* Placeholder Icon */}
                <UserCircleIcon className="w-20 h-20 text-gold-500/50" />

                {/* Officer Info */}
                <div>
                  <h3 className="text-white font-heading font-bold text-lg mb-1">
                    {officer.name}
                  </h3>
                  <p className="text-gold-500 text-sm mb-3">{officer.role}</p>

                  {/* Contact Links */}
                  <div className="space-y-2">
                    {officer.phone && (
                      <a
                        href={`tel:${officer.phone.replace(/[^0-9]/g, "")}`}
                        className="flex items-center justify-center gap-2 text-teal-500 hover:text-teal-400 transition-colors"
                      >
                        <PhoneIcon className="w-5 h-5" />
                        <span className="text-sm">{officer.phone}</span>
                      </a>
                    )}
                    {officer.email && (
                      <a
                        href={`mailto:${officer.email}`}
                        className="flex items-center justify-center gap-2 text-teal-500 hover:text-teal-400 transition-colors"
                      >
                        <EnvelopeIcon className="w-5 h-5" />
                        <span className="text-sm break-all">
                          {officer.email}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mailing Address Section */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPinIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Mailing Address</h2>
          </div>

          <div className="bg-navy-900 border border-gold-500/20 rounded-lg p-8 text-center">
            <address className="text-slate-300 not-italic text-lg leading-relaxed">
              {mailingAddress.name}
              <br />
              {mailingAddress.address}
              <br />
              {mailingAddress.city}, {mailingAddress.state}{" "}
              {mailingAddress.zip}
            </address>
          </div>
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <EnvelopeIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Connect With Us</h2>
          </div>

          <p className="text-slate-300 mb-8">
            Follow us for updates and photos from our events
          </p>

          <a
            href={socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold px-8 py-3 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
            Follow Us on Facebook
          </a>
        </div>
      </section>
    </>
  );
}
