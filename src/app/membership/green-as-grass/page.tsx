import Image from "next/image";
import Link from "next/link";
import { TrophyIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import {
  pageTitle,
  description,
  entryRequirement,
  rulesHeading,
  rules,
  standingsUrl,
  standingsLabel,
} from "@/data/green-as-grass";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Green as Grass Buckle Program | SMRHA",
  description:
    "The Green As Grass program offers a non-competitive start to showing where riders earn points and graduate with a buckle after accumulating 40 points.",
};

export default function GreenAsGrass() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Green as Grass Buckle Program"
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
            A non-competitive program to get your hoofs wet and earn your buckle
          </p>
        </div>
      </section>

      {/* Program Description Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrophyIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">About the Program</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed text-center">
            {description}
          </p>
        </div>
      </section>

      {/* Entry Requirements Section */}
      <section className="bg-navy-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-heading-2 text-white mb-6 text-center">
            Entry Requirements
          </h2>
          <div className="bg-navy-900 border border-gold-500/20 p-6 rounded-lg">
            <p className="text-slate-300 leading-relaxed">{entryRequirement}</p>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <AcademicCapIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">{rulesHeading}</h2>
          </div>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-navy-800 border border-gold-500/20 p-6 rounded-lg"
              >
                <div className="flex gap-4">
                  <span className="text-gold-500 font-bold text-xl flex-shrink-0">
                    {index + 1}.
                  </span>
                  <p className="text-slate-300 leading-relaxed">{rule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standings Link Section */}
      <section className="bg-navy-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-heading-2 text-white mb-6">
            Check Your Progress
          </h2>
          <p className="text-slate-300 mb-8">
            View the current standings to see how many points you've earned
            toward your buckle.
          </p>
          <a
            href={standingsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold px-8 py-4 rounded-lg transition-colors"
          >
            <TrophyIcon className="w-5 h-5" />
            {standingsLabel}
          </a>
        </div>
      </section>
    </>
  );
}
