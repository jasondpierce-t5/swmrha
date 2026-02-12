/**
 * Find A Trainer page content extracted from Wix HTML source.
 * Source: currentsite/moreininghorseassc.wixsite.com/momrha/find-a-trainer.html
 */

import type { Trainer } from "./types";

export const pageTitle = "Find A Trainer";

export const intro =
  "Click on a picture and you will relocated to that trainers website or Facebook";

/**
 * Trainer listings extracted from find-a-trainer.html.
 * Trainer headshot images are located in public/images/trainers/.
 */
export const trainers: Trainer[] = [
  {
    name: "Elizabeth Hartin",
    role: "Trainer",
    business: "Aussie Flair Performance Horses",
    location: "Eolia, MO 6334",
    phone: "314-440-1331",
    image: "/images/trainers/elizabeth-hartin.jpg",
    url: "https://www.facebook.com/joeandelizabethhartin",
  },
  {
    name: "Becky Shelton",
    role: "Trainer",
    business: "Reining Horses Unlimited",
    location: "Elkland, MO 65742",
    phone: "417-234-3330",
    image: "/images/trainers/becky-shelton.jpg",
    url: "https://www.facebook.com/Reininghorsesunlimited",
  },
  {
    name: "Bobby Avila",
    role: "Trainer",
    business: "Avila Performance Horses",
    location: "Rogersville, MO 65742",
    phone: "417-844-5240",
    image: "/images/trainers/bobby-avila.jpg",
    url: "http://www.avilaperformancehorses.net/",
  },
  {
    name: "Randy Shaffhauser",
    role: "Trainer",
    business: "Shaffhauser Stables",
    location: "Paragould, AR 72450",
    phone: "870-897-5546",
    image: "/images/trainers/randy-shaffhauser.jpg",
    url: "https://www.facebook.com/randy.schaffhauser",
  },
  {
    name: "Jeromy Lipps",
    role: "Trainer",
    business: "Lipps Horse Training",
    location: "Miami, OK 74354",
    phone: "918-520-9962",
    image: "/images/trainers/jeromy-lipps.jpg",
    url: "http://www.lippshorsetraining.com/",
  },
];
