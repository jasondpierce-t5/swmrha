/**
 * About page content extracted from Wix HTML source.
 * Source: currentsite/moreininghorseassc.wixsite.com/momrha.html
 *
 * The mission and board info are on the home page in the original Wix site.
 * This file centralizes about/org data for the dedicated About page.
 */

import type { BoardMember, ContactInfo } from "./types";

export const mission = [
  "The Southwest Missouri Reining Horse Association was established to promote the sport of reining at the grass roots level by offering a convenient forum for reining enthusiasts to compete and improve their skills.",
  "Our goal is to make reining a fun, family-oriented event, while still offering purses that draw top non-pro and open competitors. SMRHA also has a strong commitment to our youth by offering activities, awards, and classes that support and encourage the \u201cfuture reiners\u201d in our region.",
] as const;

export const openInvitation =
  "We would like to extend an open invitation to attend one of our shows as a spectator and visit with some of our members face to face.";

/**
 * Board members listed under "Friends of The SMRHA" on the home page.
 * The Wix site labels this section "Friends of The SMRHA" rather than
 * "Board of Directors," so the role is left undefined where not specified.
 * No individual board member photos were found in the Wix site media.
 */
export const boardMembers: BoardMember[] = [
  { name: "Brett Kuhns/Kari Wilson" },
  { name: "Sheri Kauffman" },
  { name: "Kendra Cooper" },
  { name: "Darla Davis" },
];

export const contactInfo: ContactInfo = {
  name: "Jeromy Lipps",
  phone: "918.520.9962",
  role: "Contact",
};
