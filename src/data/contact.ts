/**
 * Contact page content extracted from Wix HTML source.
 * Sources:
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/form-map.html
 *   - currentsite/moreininghorseassc.wixsite.com/momrha.html (home page)
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/join-smrha.html (mailing address)
 */

import type { ContactInfo, MailAddress } from "./types";

export const pageTitle = "Contact Us";

export const intro =
  "Click on Picture for Contact Information for that Person";

export const subtitle =
  "Officers and Board Members are here to help you!";

/**
 * Officers and board members with contact details from form-map.html.
 * Images reference future public/images/contact/ directory (Plan 02-03).
 */
export const officers: ContactInfo[] = [
  {
    name: "Jeromy Lipps",
    phone: "918.520.9962",
    email: "jeromylipps@yahoo.com",
    role: "President",
  },
  {
    name: "Caleb Bloomer",
    phone: "(417) 689-0166",
    role: "Vice President",
  },
  {
    name: "Amy Harkrider",
    phone: "816.806.0118",
    email: "amyharkrider@gmail.com",
    role: "Treasurer",
  },
  {
    name: "Alexis Trupp",
    phone: "417.326.4417",
    role: "Youth & Prize",
  },
  {
    name: "Brett Kuhns",
    phone: "660-281-6506",
    role: "Board Member",
  },
  {
    name: "Jacqueline Lipps",
    phone: "918.629.9962",
    email: "jacquelinelipps@gmail.com",
    role: "Media",
  },
  {
    name: "Bobby Avila JR",
    phone: "417.844.5240",
    role: "Board Member",
  },
];

export const primaryContact: ContactInfo = {
  name: "Jeromy Lipps",
  phone: "918.520.9962",
  email: "jeromylipps@yahoo.com",
  role: "Contact for membership or show information",
};

export const mailingAddress: MailAddress = {
  name: "Amy Harkrider",
  address: "1596 SW Town and Country LN",
  city: "Plattsburg",
  state: "MO",
  zip: "64477",
};

export const socialMedia = {
  facebook: "https://www.facebook.com/RockingHLLC",
} as const;
