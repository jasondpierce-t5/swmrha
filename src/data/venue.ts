/**
 * Venue and stall reservation content extracted from Wix HTML source.
 * Sources:
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/copy-of-reserve-stalls.html
 *   - currentsite/moreininghorseassc.wixsite.com/momrha/smrhashow-schedule.html (venue info)
 *   - currentsite/moreininghorseassc.wixsite.com/momrha.html (related orgs)
 */

import type { RelatedOrg, Venue } from "./types";

export const primaryVenue: Venue = {
  name: "Lucky J Arena and Steakhouse",
  city: "Carthage",
  state: "MO",
};

export const reservationPageTitle = "Stall, Shavings and RV Reservations";

export const reservationInfo = [
  "Showing Horse stalls include 2) Bags of Shavings. Non showing horses and Tack Stalls do not.",
  "Online Pre Reservations are available and Payment is Due at time of Reservations",
  "100% Refunds are available if cancelled prior to July 13th, 2025. After that date, they can be refunded with Veterinarian or Dr release",
  "If you prefer to pay with a check Please call Jacqueline Lipps 918.629.9962",
  "If not Pre Reserved with payment by July 13, 2025, there is no guarantee that you will be stalled with your preferred group.",
] as const;

export const stallReservationUrl =
  "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-57185350-2025";

export const paidWarmUpReservationUrl =
  "https://www.signupgenius.com/go/10C0B4CABA92BA4F5CE9-57185231-2025";

export const onlineEntryUrl =
  "https://www.whitehorseshowmgt.com/showcalendar";

export const warmUpInfo = [
  "You MUST Reserve your time slot for Paid Warm Ups and pay for them at the time of reservation or you will NOT have a time. Slots can be sold. Money exchange is between Buyer and Seller and will NOT go through the show office.",
  "RESERVATIONS ARE AVAILABLE FOR PAID WARM UPS, UP UNTIL THE TIME SLOT TO GO",
  "Paid Warm Up order Post on July 16",
] as const;

/**
 * Image references for stall chart and RV map.
 * Files are located in public/images/venue/.
 */
export const stallChartImage = "/images/venue/stall-chart.jpg";
export const rvMapImage = "/images/venue/rv-map.jpg";

export const relatedOrgs: RelatedOrg[] = [
  {
    name: "Kansas Reining Horse Association",
    url: "http://www.kansasreining.com/",
  },
  {
    name: "Missouri Quarter Horse Association",
    url: "http://www.MQHA.com",
  },
];
