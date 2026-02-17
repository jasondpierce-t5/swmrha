import Image from "next/image";
import {
  TrophyIcon,
  DocumentTextIcon,
  CameraIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { resultsProviders } from "@/data/shows";
import { getResults } from "@/lib/actions/results";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results & Standings | SWMRHA",
  description:
    "View show results, year-end champions, current standings, and performance records for SWMRHA reining events",
  openGraph: {
    title: "Results & Standings | SWMRHA",
    description:
      "View show results, year-end champions, current standings, and performance records for SWMRHA reining events",
    type: "website",
    locale: "en_US",
    siteName: "SWMRHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Results & Standings | SWMRHA",
    description:
      "View show results, year-end champions, current standings, and performance records for SWMRHA reining events",
  },
};

// Helper to determine which icon to use based on link label
function getResultIcon(label: string) {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("champion")) return TrophyIcon;
  if (lowerLabel.includes("photo")) return CameraIcon;
  if (lowerLabel.includes("standing")) return ChartBarIcon;
  return DocumentTextIcon;
}

export default async function Results() {
  const result = await getResults();
  const results = Array.isArray(result) ? result : [];

  const currentYear = results.filter((r) => r.category === "current_year");
  const pastResults = results.filter((r) => r.category === "past_results");
  const standings = results.filter((r) => r.category === "standings");

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] lg:min-h-[60vh] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/events/hero-1.jpg"
          alt="Results and Standings"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] lg:min-h-[60vh] px-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-display text-white font-heading font-bold mb-4 max-w-4xl">
            Results & Standings
          </h1>
          <p className="text-gold-500 font-heading uppercase tracking-wider text-lg sm:text-xl lg:text-2xl">
            Access Show Results, Year-End Champions & Current Standings
          </p>
        </div>
      </section>

      {/* Results Links Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-heading-1 text-center text-white mb-12">
            Show Results & Standings
          </h2>

          {/* Current Year Results */}
          {currentYear.length > 0 && (
            <div className="mb-10">
              <h3 className="text-heading-3 text-gold-500 mb-6">
                2025 Show Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentYear.map((link) => {
                  const Icon = getResultIcon(link.label);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-navy-800 border border-gold-500/20 p-6 rounded-lg hover:border-gold-500 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1 group-hover:text-gold-500 transition-colors">
                            {link.label}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <span>View Results</span>
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Results & Champions */}
          {pastResults.length > 0 && (
            <div className="mb-10">
              <h3 className="text-heading-3 text-gold-500 mb-6">
                Past Results & Year-End Champions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastResults.map((link) => {
                  const Icon = getResultIcon(link.label);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-navy-800 border border-gold-500/20 p-6 rounded-lg hover:border-gold-500 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1 group-hover:text-gold-500 transition-colors">
                            {link.label}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <span>View Results</span>
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Standings */}
          {standings.length > 0 && (
            <div>
              <h3 className="text-heading-3 text-gold-500 mb-6">
                Current Standings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standings.map((link) => {
                  const Icon = getResultIcon(link.label);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-navy-800 border border-gold-500/20 p-6 rounded-lg hover:border-gold-500 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1 group-hover:text-gold-500 transition-colors">
                            {link.label}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <span>View Standings</span>
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Providers Section */}
      <section className="bg-navy-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-heading-2 text-center text-white mb-8">
            Results Provided By
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-heading-3 text-gold-500 mb-3">
                {resultsProviders.whiteHorse.name}
              </h3>
              <a
                href={resultsProviders.whiteHorse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-400 inline-flex items-center gap-2 text-lg"
              >
                <span>{resultsProviders.whiteHorse.url.replace("https://", "")}</span>
                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              </a>
            </div>

            <div className="text-center">
              <h3 className="text-heading-3 text-gold-500 mb-3">
                {resultsProviders.tdPhoto.name}
              </h3>
              <a
                href={resultsProviders.tdPhoto.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-400 inline-flex items-center gap-2 text-lg"
              >
                <span>{resultsProviders.tdPhoto.url.replace("https://", "")}</span>
                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Results Information Section */}
      <section className="bg-navy-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-heading-2 text-gold-500 mb-6">
            Live Results
          </h2>

          <div className="space-y-4 text-lg text-slate-300">
            <p>
              Live results are posted during shows via White Horse Show Management and TD Photo links.
            </p>
            <p>
              Final results and standings are published after each event.
            </p>
          </div>

          <div className="mt-8 bg-navy-700 rounded-card border border-gold-500/20 p-6">
            <p className="text-white font-semibold text-lg">
              Check back after each show for updated standings and year-end points!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
