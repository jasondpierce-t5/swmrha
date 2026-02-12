/**
 * Central image manifest mapping logical names to file paths.
 * All image paths are relative to the Next.js public/ directory.
 *
 * Source images were extracted from the Wix site's static media directory
 * and organized into categorized subdirectories under public/images/.
 */

export const images = {
  logos: {
    primary: "/images/logos/smrha-logo.jpg",
    alternate: "/images/logos/smrha-logo-2022.jpg",
  },
  sponsors: {
    itsAllAboutRuf: "/images/sponsors/its-all-about-ruf.jpg",
    cowtownUsa: "/images/sponsors/cowtown-usa.jpg",
    merhowTrailers: "/images/sponsors/merhow-trailers.jpg",
    rdsFinancing: "/images/sponsors/rds-financing.jpg",
    statelineTack: "/images/sponsors/stateline-tack.jpg",
    rockingH: "/images/sponsors/rocking-h.jpg",
    equineOasis: "/images/sponsors/equine-oasis.jpg",
    lipps: "/images/sponsors/lipps.jpg",
    aussieFlair: "/images/sponsors/aussie-flair.jpg",
    reiningHorseUnlimited: "/images/sponsors/reining-horse-unlimited.jpg",
    shaffhauserStables: "/images/sponsors/shaffhauser-stables.jpg",
    circleX: "/images/sponsors/circle-x.jpg",
    sponsor1: "/images/sponsors/sponsor-1.jpg",
    sponsor2: "/images/sponsors/sponsor-2.jpg",
    sponsor3: "/images/sponsors/sponsor-3.jpg",
  },
  trainers: {
    elizabethHartin: "/images/trainers/elizabeth-hartin.jpg",
    beckyShelton: "/images/trainers/becky-shelton.jpg",
    bobbyAvila: "/images/trainers/bobby-avila.jpg",
    randyShaffhauser: "/images/trainers/randy-shaffhauser.jpg",
    jeromyLipps: "/images/trainers/jeromy-lipps.jpg",
  },
  events: {
    yearEnd2024: "/images/events/2024-year-end-champions.jpg",
    yearEnd2022: "/images/events/2022-year-end-announcement.jpg",
    fiestaDinner2022: "/images/events/fiesta-dinner-2022.jpg",
    hero1: "/images/events/hero-1.jpg",
  },
  venue: {
    stallChart: "/images/venue/stall-chart.jpg",
    rvMap: "/images/venue/rv-map.jpg",
  },
  gallery: [
    "/images/gallery/photo-1.jpg",
    "/images/gallery/photo-2.jpg",
    "/images/gallery/photo-3.jpg",
    "/images/gallery/photo-4.jpg",
    "/images/gallery/photo-5.jpg",
    "/images/gallery/photo-6.jpg",
    "/images/gallery/photo-7.jpg",
  ],
} as const;
