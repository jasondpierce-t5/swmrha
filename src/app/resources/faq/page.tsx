import Image from "next/image";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { pageTitle, intro, faqs } from "@/data/faq";
import { images } from "@/data/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | SMRHA",
  description:
    "Frequently asked questions about Southwest Missouri Reining Horse Association - membership, horses, rules, and more.",
};

export default function FAQ() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Frequently Asked Questions"
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
            Get answers to common questions about SMRHA
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-navy-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-300 text-lg leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* FAQ List Section */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <QuestionMarkCircleIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Common Questions</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-navy-900 border border-gold-500/20 p-6 rounded-lg"
              >
                {/* Question */}
                <h3 className="text-xl font-bold text-white mb-3">
                  Q: {faq.question}
                </h3>

                {/* Answer */}
                <p className="text-slate-300 leading-relaxed mb-3">
                  A: {faq.answer}
                </p>

                {/* Optional Link */}
                {faq.link && (
                  <a
                    href={faq.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-teal-500 hover:text-teal-400 underline text-sm mt-2"
                  >
                    {faq.link.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-heading-2 text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            We're here to help! If you don't see your question answered above,
            please don't hesitate to reach out to an SMRHA officer or board
            member.
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
