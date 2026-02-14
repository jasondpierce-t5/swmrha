/**
 * Home page content extracted from Wix HTML source.
 * Source: currentsite/moreininghorseassc.wixsite.com/momrha.html
 */

import type { Event, QuickLink, RelatedOrg } from "./types";

export const heroImage = "/images/gallery/lipps_updated.png";

export const heroTitle = "Southwest Missouri Reining Horse Association";

export const heroSubtitle =
  "Promoting the Sport of Reining at the Grassroots Level";

export const welcomeHeading = "The SMRHA welcomes all levels of reining horse from the professional to the enthusiast looking to learn more about the sport of reining.";

export const welcomeMessage = [
  "The Southwest Missouri Reining Horse Association was established to promote the sport of reining at the grass roots level by offering a convenient forum for reining enthusiasts to compete and improve their skills.",
  "Our goal is to make reining a fun, family-oriented event, while still offering purses that draw top non-pro and open competitors. SMRHA also has a strong commitment to our youth by offering activities, awards, and classes that support and encourage the \u201cfuture reiners\u201d in our region.",
] as const;

export const openInvitation =
  "We would like to extend an open invitation to attend one of our shows as a spectator and visit with some of our members face to face.";

export const contactCallout =
  "If you would like more information regarding membership or shows, please feel free to call or text Jeromy Lipps 918.520.9962";

export const upcomingEvents: Event[] = [
  {
    name: "The Route 66 Slide",
    subtitle: "Derby & Rookie Scooter Shootout",
    dates: "April 4-6, 2025",
    location: "Carthage, MO",
    venue: "Lucky J Arena and Steakhouse",
    links: [
      {
        label: "Show Bill",
        url: "https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_e6c453135fff43afac82bd2e806bcfe7.pdf",
        external: true,
      },
      {
        label: "Online Entries",
        url: "https://www.whitehorseshowmgt.com/showcalendar",
        external: true,
      },
      {
        label: "Results",
        url: "https://www.whitehorseshowmgt.com/post/smrha-route-66-slide-4-4-4-6",
        external: true,
      },
      {
        label: "Photos & Video",
        url: "https://www.tdphoto.org/",
        external: true,
      },
      {
        label: "Paid Warm Up Reservation",
        url: "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-54952261-2025",
        external: true,
      },
    ],
  },
  {
    name: "The Patriot Slide",
    subtitle: "Pre Futurity & Freestyle",
    dates: "July 19-20, 2025",
    location: "Carthage, MO",
    venue: "Lucky J Arena and Steakhouse",
    links: [
      {
        label: "Show Bill",
        url: "https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_d351c9264b6d4c6fa825d2342d71434a.pdf",
        external: true,
      },
      {
        label: "Stall and RV Reservation Maps",
        url: "/shows/reserve",
        external: false,
      },
      {
        label: "Paid Warm Up Reservation",
        url: "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-57185231-2025",
        external: true,
      },
      {
        label: "Online Entries",
        url: "/shows/reserve",
        external: false,
      },
    ],
    notes: [
      "$10 discount on each Stall, if paying with CC online by July 13th, 2025",
    ],
  },
];

export const showAnnouncements = [
  "TWO (2) SHOWS",
  "April & July Show @ Carthage, MO Lucky J Steakhouse & Arena",
  "April ~Open and Non Pro Derby",
  "July~Open and Non Pro Futurity~ more $$ Added",
  "CLUB CLASSES run concurrent with NRHA Classes",
  "No NRHA Membership or Comp License required",
] as const;

export const gagBuckleInfo = [
  "2022-2024 GREEN AS GRASS (GAG) BUCKLE POINTS",
  "CARRY OVER TO 2025",
] as const;

export const quickLinks: QuickLink[] = [
  { label: "Join SMRHA", url: "/join" },
  { label: "Show Schedule", url: "/shows" },
  { label: "Show Results", url: "/results" },
  { label: "Find A Trainer", url: "/trainers" },
];

export const relatedOrgs: RelatedOrg[] = [
  { name: "Kansas Reining", url: "http://www.kansasreining.com/" },
  { name: "MQHA", url: "http://www.MQHA.com" },
];
