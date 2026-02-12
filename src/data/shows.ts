/**
 * Show schedule and results content extracted from Wix HTML source.
 * Sources:
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/smrhashow-schedule.html
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/smrhashowresults.html
 */

import type { Event } from "./types";

export const pageTitle = "2025 Show Schedule";

export const venue = {
  name: "Lucky J Arena and Steakhouse",
  location: "Carthage, MO",
} as const;

export const showSchedule: Event[] = [
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
        label: "Stall and RV Reservation Maps",
        url: "/shows/reserve",
        external: false,
      },
      {
        label: "Paid Warm Up Reservation",
        url: "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-54952261-2025",
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
      {
        label: "Draws and Results",
        url: "/results",
        external: false,
      },
      {
        label: "Photos & Video",
        url: "/results",
        external: false,
      },
      {
        label: "Live Web Feed",
        url: "https://www.tdphoto.org/events/2024_events/patriot_slide_pre-futurity__freestyle_july_2021_2024/",
        external: true,
      },
    ],
    notes: [
      "$10 discount on each Stall, if paying with CC online by July 13th, 2025",
    ],
  },
];

/**
 * Links to show results from the results page.
 * The Wix results page is mostly dynamically-loaded iframes,
 * but these button/link URLs were found in the static HTML.
 */
export const resultsLinks = [
  {
    label: "2025 Rt 66 Slide Results",
    url: "https://www.whitehorseshowmgt.com/post/smrha-route-66-slide-4-4-4-6",
    external: true,
  },
  {
    label: "2024 Year End Champions",
    url: "https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_dbad005d02bf4896a5341a3fccf75ddf.xlsx?dn=2023-YEAR-END.xlsx",
    external: true,
  },
  {
    label: "2024 Show Results",
    url: "https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_95ee650547674add91f6eda6358fe319.pdf",
    external: true,
  },
  {
    label: "RESULTS 2024 Patriot Slide Show",
    url: "https://www.whitehorseshowmgt.com/post/smrha-patriot-slide-7-20-7-21",
    external: true,
  },
  {
    label: "Photos from 2023 Patriot Slide Show",
    url: "https://tdphoto.org/events/2024_events/patriot_slide_pre-futurity__freestyle_july_2021_2024/#splash",
    external: true,
  },
  {
    label: "Current GAG Standings",
    url: "https://4575bd99-f172-4e64-8a18-f81dbe062550.filesusr.com/ugd/63abc5_b7c68a7860fe47aaab076b87939301bc.pdf",
    external: true,
  },
] as const;

export const resultsProviders = {
  whiteHorse: {
    name: "White Horse Show Management",
    url: "https://www.whitehorseshowmgt.com",
  },
  tdPhoto: {
    name: "Tracy Devenport Photography",
    url: "https://www.tdphoto.org",
  },
} as const;
