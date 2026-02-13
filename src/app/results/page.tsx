import Image from "next/image";
import {
  TrophyIcon,
  DocumentTextIcon,
  CameraIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { resultsLinks, resultsProviders } from "@/data/shows";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results & Standings | SMRHA",
  description: "View show results, year-end champions, current standings, and performance records for Southwest Missouri Reining Horse Association events.",
};

// Helper to determine which icon to use based on link label
function getResultIcon(label: string) {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("champion")) return TrophyIcon;
  if (lowerLabel.includes("photo")) return CameraIcon;
  if (lowerLabel.includes("standing")) return ChartBarIcon;
  return DocumentTextIcon;
}

// Helper to group results links
function groupResultsLinks() {
  const currentYear: typeof resultsLinks[number][] = [];
  const pastResults: typeof resultsLinks[number][] = [];
  const standings: typeof resultsLinks[number][] = [];

  resultsLinks.forEach((link) => {
    const label = link.label.toLowerCase();
    if (label.includes("2025")) {
      currentYear.push(link);
    } else if (label.includes("standing") || label.includes("gag")) {
      standings.push(link);
    } else {
      pastResults.push(link);
    }
  });

  return { currentYear, pastResults, standings };
}

export default function Results() {
  const { currentYear, pastResults, standings } = groupResultsLinks();

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
                {currentYear.map((link, index) => {
                  const Icon = getResultIcon(link.label);
                  return (
                    <a
                      key={index}
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
                {pastResults.map((link, index) => {
                  const Icon = getResultIcon(link.label);
                  return (
                    <a
                      key={index}
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
                {standings.map((link, index) => {
                  const Icon = getResultIcon(link.label);
                  return (
                    <a
                      key={index}
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
    </>
  );
}
