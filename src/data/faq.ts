/**
 * FAQ page content extracted from Wix HTML source.
 * Source: currentsite/moreininghorseassc.wixsite.com/momrha/faq.html
 */

import type { FAQ } from "./types";

export const pageTitle = "FAQ";

export const intro =
  "Please email us your questions and we will answer them as soon as possible OR Check out our live Forum...your answer may be on there or someone else may want to know yours......";

export const faqs: FAQ[] = [
  {
    question: "Can anyone join the SMRHA",
    answer:
      "Yes anyone who is willing and able may join. We have classes for all skill levels. Minors must have permission from legal guardian.",
  },
  {
    question: "Do I need to have a special breed of horse?",
    answer:
      "Not at all. Any breed or mixed breed horse may compete at our shows",
  },
  {
    question: "Where can I learn more about Reining Horses",
    answer:
      "Your options are as vast as an internet search will allow. A great place to start is the National Reining Horse association.",
    link: {
      label: "National Reining Horse Association",
      url: "http://nrha1.com/",
    },
  },
  {
    question: "Where can I get a copy of the rules?",
    answer:
      "Visit the NRHA (National Reining Horse Association) website to get the most up to date rules and regulation. A copy of the handbook can downloaded from there. However, please contact an SMRHA Officer or Board member, we are always happy to help!",
    link: {
      label: "NRHA Handbook",
      url: "https://nrha.com/handbook",
    },
  },
  {
    question: "Do I have to live in Missouri to join your association",
    answer: "No! We have members who belong to multiple associations.",
  },
];
