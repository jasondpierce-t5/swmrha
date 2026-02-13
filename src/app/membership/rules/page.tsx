import Image from "next/image";
import { BookOpenIcon, ScaleIcon } from "@heroicons/react/24/outline";
import { nrhaPatternBookUrl } from "@/data/membership";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules & Classes | SMRHA",
  description:
    "SMRHA follows NRHA rules and regulations. Access the official NRHA Handbook, Pattern Book, and resources for complete rules and class information.",
};

export default function Rules() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Rules & Classes"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-heading-1 text-white font-heading font-bold mb-4">
            Rules &amp; Classes
          </h1>
          <p className="text-gold-500 font-heading text-xl max-w-2xl">
            SMRHA is proud to be affiliated with the National Reining Horse
            Association
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ScaleIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">NRHA Affiliation</h2>
          </div>

          <div className="text-slate-300 leading-relaxed text-center max-w-3xl mx-auto space-y-4">
            <p>
              The Southwest Missouri Reining Horse Association operates under
              the rules and regulations established by the National Reining
              Horse Association (NRHA). As an NRHA affiliate, our shows follow
              official NRHA patterns, judging criteria, and class structures.
            </p>
            <p>
              This affiliation ensures consistency with reining standards across
              the country and allows our members to earn NRHA points and
              recognition at our events.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <BookOpenIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Official Resources</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* NRHA Handbook */}
            <div className="bg-navy-900 border border-gold-500/20 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <BookOpenIcon className="w-12 h-12 text-gold-500" />
              </div>
              <h3 className="text-heading-3 text-white mb-4">NRHA Handbook</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                The complete rulebook covering all aspects of NRHA competition,
                from membership requirements to judging procedures and class
                specifications.
              </p>
              <a
                href="https://nrha.com/handbook"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 font-heading font-bold px-6 py-3 rounded-lg transition-colors"
              >
                View Handbook
              </a>
            </div>

            {/* NRHA Pattern Book */}
            <div className="bg-navy-900 border border-gold-500/20 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <BookOpenIcon className="w-12 h-12 text-gold-500" />
              </div>
              <h3 className="text-heading-3 text-white mb-4">
                NRHA Pattern Book
              </h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Download the official pattern book featuring all 14 NRHA
                patterns with detailed diagrams and maneuver descriptions.
              </p>
              <a
                href={nrhaPatternBookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 font-heading font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Download Patterns
              </a>
            </div>

            {/* NRHA Website */}
            <div className="bg-navy-900 border border-gold-500/20 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <BookOpenIcon className="w-12 h-12 text-gold-500" />
              </div>
              <h3 className="text-heading-3 text-white mb-4">NRHA Website</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Visit the official NRHA website for news, events, membership
                information, and additional resources for reining enthusiasts.
              </p>
              <a
                href="http://nrha1.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 font-heading font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Visit NRHA.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto">
            For specific class lists, prize money, and show-specific rules,
            please refer to the show bills available on our{" "}
            <a
              href="/shows"
              className="text-teal-500 hover:text-teal-400 underline"
            >
              shows page
            </a>
            . Each event may have unique class offerings and special
            competitions.
          </p>
        </div>
      </section>
    </>
  );
}
