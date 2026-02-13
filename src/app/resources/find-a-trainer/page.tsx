import Image from "next/image";
import { UserGroupIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { pageTitle, intro, trainers } from "@/data/trainers";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Trainer | SMRHA",
  description:
    "Connect with professional reining horse trainers in the Southwest Missouri region. Browse trainer profiles with contact information and websites.",
};

export default function FindATrainer() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Find a Trainer"
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
            Connect with professional reining trainers in our region
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-navy-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-300 text-lg leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* Trainer Directory Section */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <UserGroupIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Our Trainers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainers.map((trainer, index) => (
              <div
                key={index}
                className="bg-navy-900 border border-gold-500/20 rounded-lg overflow-hidden"
              >
                {/* Trainer Image */}
                {trainer.image && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Trainer Info */}
                <div className="p-6">
                  {/* Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {trainer.name}
                  </h3>

                  {/* Business */}
                  {trainer.business && (
                    <p className="text-gold-500 font-medium mb-4">
                      {trainer.business}
                    </p>
                  )}

                  {/* Location */}
                  {trainer.location && (
                    <p className="text-slate-300 mb-4">{trainer.location}</p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    {/* Phone */}
                    {trainer.phone && (
                      <a
                        href={`tel:${trainer.phone}`}
                        className="flex items-center gap-2 text-teal-500 hover:text-teal-400 transition-colors"
                      >
                        <PhoneIcon className="w-5 h-5" />
                        <span>{trainer.phone}</span>
                      </a>
                    )}

                    {/* Website */}
                    {trainer.url && (
                      <a
                        href={trainer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-teal-500 hover:text-teal-400 transition-colors"
                      >
                        <GlobeAltIcon className="w-5 h-5" />
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>

                  {/* Visit Website Button */}
                  {trainer.url && (
                    <a
                      href={trainer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold px-6 py-3 rounded-lg transition-colors"
                    >
                      View Profile
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-heading-2 text-white mb-6">
            Want to Be Listed?
          </h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Are you a reining trainer in the Southwest Missouri region? We'd
            love to add you to our directory. Please contact us to get started.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold px-8 py-4 rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
