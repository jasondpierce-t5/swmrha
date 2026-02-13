import Image from "next/image";
import Link from "next/link";
import {
  UserCircleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import {
  joinHeading,
  joinIntro,
  membershipFormIntro,
  membershipFormUrl,
  membershipFormLabel,
  mailInIntro,
  membershipApplicationPdf,
  mailInAddress,
  nrhaPatternBookUrl,
  nrhaPatternBookLabel,
  whatIsReining,
  breedInfo,
  breedInfoQuestion,
  isReiningForMe,
  isReiningForMeQuestion,
} from "@/data/membership";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join SMRHA | Southwest Missouri Reining Horse Association",
  description:
    "Join SMRHA and become part of our reining community. Learn about membership benefits, application process, and what makes reining the perfect equestrian sport.",
};

export default function JoinSMRHA() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Join SMRHA"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-heading-1 text-white font-heading font-bold mb-4">
            Join SMRHA
          </h1>
          <p className="text-gold-500 font-heading text-xl max-w-2xl">
            {joinIntro}
          </p>
        </div>
      </section>

      {/* Membership Application Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <UserCircleIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">{joinHeading}</h2>
          </div>

          <div className="space-y-8">
            {/* Online Application */}
            <div className="bg-navy-800 border border-gold-500/20 p-8 rounded-lg">
              <h3 className="text-heading-3 text-white mb-4">
                {membershipFormLabel}
              </h3>
              <p className="text-slate-300 mb-6">{membershipFormIntro}</p>
              <a
                href={membershipFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 font-heading font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Complete Online Form
              </a>
            </div>

            {/* Mail-In Option */}
            <div className="bg-navy-800 border border-gold-500/20 p-8 rounded-lg">
              <h3 className="text-heading-3 text-white mb-4">
                Mail-In Application
              </h3>
              <p className="text-slate-300 mb-4">{mailInIntro}</p>
              <a
                href={membershipApplicationPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-teal-500 hover:text-teal-400 underline mb-6"
              >
                Download Printable Application (PDF)
              </a>

              <div className="pt-4 border-t border-navy-700">
                <p className="text-white font-medium mb-2">Mail to:</p>
                <address className="text-slate-300 not-italic">
                  {mailInAddress.name}
                  <br />
                  {mailInAddress.address}
                  <br />
                  {mailInAddress.city}, {mailInAddress.state}{" "}
                  {mailInAddress.zip}
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Reining Section */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <QuestionMarkCircleIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">What is Reining?</h2>
          </div>

          <div className="space-y-8">
            {/* Main Explanation */}
            <div className="text-slate-300 leading-relaxed">
              <p>{whatIsReining}</p>
            </div>

            {/* Breed Question */}
            <div className="bg-navy-900 border border-gold-500/20 p-6 rounded-lg">
              <h3 className="text-heading-3 text-white mb-3">
                {breedInfoQuestion}
              </h3>
              <p className="text-slate-300 leading-relaxed">{breedInfo}</p>
            </div>

            {/* Is Reining For Me */}
            <div className="bg-navy-900 border border-gold-500/20 p-6 rounded-lg">
              <h3 className="text-heading-3 text-white mb-3">
                {isReiningForMeQuestion}
              </h3>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                {isReiningForMe.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NRHA Pattern Book Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <DocumentTextIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">NRHA Pattern Book</h2>
          </div>

          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Download the official NRHA Pattern Book to familiarize yourself with
            the patterns you'll be performing at our shows.
          </p>

          <a
            href={nrhaPatternBookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold px-8 py-3 rounded-lg transition-colors"
          >
            {nrhaPatternBookLabel}
          </a>

          <p className="text-gold-400 italic mt-8">
            Have questions? Visit our{" "}
            <Link
              href="/contact"
              className="text-teal-500 hover:text-teal-400 underline"
            >
              contact page
            </Link>{" "}
            to get in touch.
          </p>
        </div>
      </section>
    </>
  );
}
