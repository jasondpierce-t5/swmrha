/**
 * Shared TypeScript interfaces for SMRHA content data.
 * These types enforce consistency across all data files extracted from the Wix site.
 */

export interface BoardMember {
  name: string;
  role?: string;
  image?: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
  role: string;
}

export interface EventLink {
  label: string;
  url: string;
  external?: boolean;
}

export interface Event {
  name: string;
  subtitle?: string;
  dates: string;
  location: string;
  venue: string;
  links: EventLink[];
  notes?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
  link?: {
    label: string;
    url: string;
  };
}

export interface Sponsor {
  name: string;
  image?: string;
  url?: string;
  level?: string;
}

export interface SponsorLevel {
  name: string;
  amount: string;
  benefits: string[];
}

export interface Trainer {
  name: string;
  role: string;
  business?: string;
  location?: string;
  phone?: string;
  image?: string;
  url?: string;
}

export interface Venue {
  name: string;
  city: string;
  state: string;
}

export interface PageContent {
  title: string;
  description?: string;
  sections: {
    heading?: string;
    content: string[];
  }[];
}

export interface MailAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface QuickLink {
  label: string;
  url: string;
}

export interface RelatedOrg {
  name: string;
  url: string;
}
