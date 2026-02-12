/**
 * Sponsor content extracted from Wix HTML source.
 * Sources:
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/sponsors.html
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/copy-of-sponsors.html
 *   - currentsite/moreininghorseassc.wixsite.com/momrha.html (home page sponsor logos)
 */

import type { Sponsor, SponsorLevel } from "./types";

export const pageTitle = "Sponsors";

export const intro =
  "SMRHA appreciates each and every sponsor. If you would like to become a SMRHA Sponsor, please click the button below and follow the prompts to complete your Sponsor Level and payment.";

export const prizeNote =
  "For those providing prizes or have other requests for your sponsorship, you can list that information in the OTHER ~ products selection";

export const detailsNote =
  "For details of the different sponsorship levels and the benefits you will receive, please visit this page";

export const signupUrl =
  "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-47368756-smrha";

export const signupLabel = "Click here..........";

/**
 * Sponsors identified from logo images on the home page.
 * Sponsor names are derived from image filenames, alt text, and link targets.
 * Organized by tier as displayed on the Wix home page.
 */
export const sponsors: Sponsor[] = [
  // Platinum
  {
    name: "Its All About Ruf",
    image: "/images/sponsors/its-all-about-ruf.jpg",
    url: "https://tmreining.com/stallions/its-all-about-ruf/",
    level: "Platinum",
  },
  {
    name: "Cowtown USA",
    image: "/images/sponsors/cowtown-usa.jpg",
    url: "https://cowtownusainc.com/",
    level: "Platinum",
  },
  {
    name: "Merhow Trailers",
    image: "/images/sponsors/merhow-trailers.jpg",
    url: "https://merhow.com/",
    level: "Platinum",
  },
  // Diamond
  {
    name: "Equine Oasis",
    image: "/images/sponsors/equine-oasis.jpg",
    url: "http://equineoasis.com/",
    level: "Diamond",
  },
  // Gold
  {
    name: "RDS Financing",
    image: "/images/sponsors/rds-financing.jpg",
    url: "https://www.rdsfinancing.com/about.aspx",
    level: "Gold",
  },
  {
    name: "Stateline Tack",
    image: "/images/sponsors/stateline-tack.jpg",
    url: "https://www.statelinetack.com/",
    level: "Gold",
  },
  // Silver
  {
    name: "Lipps Horse Training",
    image: "/images/sponsors/lipps.jpg",
    url: "http://www.lippshorsetraining.com/",
    level: "Silver",
  },
  {
    name: "Aussie Flair Performance Horses",
    image: "/images/sponsors/aussie-flair.jpg",
    url: "https://www.facebook.com/joeandelizabethhartin",
    level: "Silver",
  },
  {
    name: "Reining Horse Unlimited",
    image: "/images/sponsors/reining-horse-unlimited.jpg",
    url: "https://www.facebook.com/Reininghorsesunlimited/",
    level: "Silver",
  },
  {
    name: "Shaffhauser Stables",
    image: "/images/sponsors/shaffhauser-stables.jpg",
    url: "https://www.facebook.com/randy.schaffhauser",
    level: "Silver",
  },
  // Bronze
  {
    name: "Rocking H LLC",
    image: "/images/sponsors/rocking-h.jpg",
    url: "https://www.facebook.com/RockingHLLC",
    level: "Bronze",
  },
  {
    name: "Circle X",
    image: "/images/sponsors/circle-x.jpg",
    level: "Bronze",
  },
];

/**
 * Sponsorship tier/level information from the "Sponsor Levels" page.
 * Source: copy-of-sponsors.html
 */
export const sponsorLevelsHeading = "Ways you can support SMRHA in 2023";

export const sponsorLevels: SponsorLevel[] = [
  {
    name: "Platinum Sponsor",
    amount: "$2000",
    benefits: [
      "Plaque recognizing sponsorship",
      "Vendor space available at shows",
      "Largest banner at each show",
      "Other promotional opportunities available - contact a Board Member",
      "Recognition on Facebook page, website and coverage at shows",
    ],
  },
  {
    name: "Diamond Sponsor",
    amount: "$1000",
    benefits: [
      "Year End High Point Awards",
      "Vendor space available at shows",
      "Banner at shows",
      "Recognition on Facebook page, website and coverage at shows",
    ],
  },
  {
    name: "Gold Sponsor",
    amount: "$500",
    benefits: [
      "Weekend High Point Awards",
      "Banner at each show",
      "Recognition on Facebook page, website and coverage at shows",
    ],
  },
  {
    name: "Route 66 Derby 8 Top Dinner",
    amount: "$500",
    benefits: [
      "Watch the Open and Non Pro Derby in a comfortable chair, while earing a catered meal. Premier seats to cheer on your trainer and/or favorite contestant entered in the competition. If you are a business, your banner can be hung in the arena for the entirety of the show, FB spotlight, and announced during through out the show",
    ],
  },
  {
    name: "Silver Sponsor",
    amount: "$250",
    benefits: [
      "Trainer Spotlight",
      "Banner at each show, trainers will also be featured in Find a Trainer on website",
      "Recognition on Facebook page, website and coverage at shows",
    ],
  },
  {
    name: "Bronze",
    amount: "$150 minimum",
    benefits: [
      "Daily Class Sponsor",
      "Announcement during show",
      "Recognition on Facebook page, website and additional coverage at shows",
    ],
  },
  {
    name: "Friends of the SMRHA",
    amount: "",
    benefits: [
      "Green as Grass Buckle Sponsor, Daily Breakfast Sponsor",
      "Recognition on Facebook page, website and coverage at shows",
    ],
  },
];

export const donationNote =
  "Sponsors that donate products will be placed in the sponsor category based on the value of donated items. If you have any questions, please contact Heather Ruble at";
