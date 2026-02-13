import Image from "next/image";
import Link from "next/link";
import {
  heroImage,
  heroTitle,
  heroSubtitle,
  welcomeHeading,
  welcomeMessage,
  openInvitation,
  contactCallout,
} from "@/data/home";

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
    </>
  );
}
