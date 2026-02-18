import Link from 'next/link';
import {
  CheckCircleIcon,
  TagIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { getActiveMembershipTypes } from '@/lib/actions/membership-types';
import {
  joinHeading,
  joinIntro,
  membershipFormUrl,
  membershipFormLabel,
  mailInIntro,
  membershipApplicationPdf,
  mailInAddress,
} from '@/data/membership';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership | SWMRHA',
  description:
    "Join SWMRHA and become part of southwest Missouri's premier reining horse association with benefits and events",
  openGraph: {
    title: 'Membership | SWMRHA',
    description:
      "Join SWMRHA and become part of southwest Missouri's premier reining horse association with benefits and events",
    type: 'website',
    locale: 'en_US',
    siteName: 'SWMRHA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Membership | SWMRHA',
    description:
      "Join SWMRHA and become part of southwest Missouri's premier reining horse association with benefits and events",
  },
};

function formatPrice(priceCents: number, durationMonths: number | null): string {
  const dollars = (priceCents / 100).toFixed(2);
  if (durationMonths === null) {
    return `One-time $${dollars}`;
  }
  if (durationMonths === 12) {
    return `$${dollars}/year`;
  }
  return `$${dollars}/${durationMonths} mo`;
}

export default async function MembershipPage() {
  const result = await getActiveMembershipTypes();
  const membershipTypes = Array.isArray(result) ? result : [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-heading-1 mb-4 font-heading font-bold text-white">
            Membership
          </h1>
          <p className="mx-auto max-w-2xl font-heading text-xl text-gold-500">
            {joinIntro}
          </p>
        </div>
      </section>

      {/* Membership Options Section */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 flex items-center justify-center gap-3">
            <TagIcon className="h-8 w-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Membership Options</h2>
          </div>

          {membershipTypes.length > 0 ? (
            <div
              className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${
                membershipTypes.length >= 4
                  ? 'lg:grid-cols-4'
                  : membershipTypes.length === 3
                    ? 'lg:grid-cols-3'
                    : 'lg:grid-cols-2'
              }`}
            >
              {membershipTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex flex-col rounded-lg border border-navy-700 bg-navy-800 p-6 transition-colors hover:border-gold-500/30"
                >
                  {/* Tier Name */}
                  <h3 className="font-heading text-xl font-bold text-white">
                    {type.name}
                  </h3>

                  {/* Price */}
                  <p className="mt-2 font-heading text-2xl font-bold text-gold-500">
                    {formatPrice(type.price_cents, type.duration_months)}
                  </p>

                  {/* Description */}
                  {type.description && (
                    <p className="mt-3 text-sm text-slate-300">
                      {type.description}
                    </p>
                  )}

                  {/* Benefits */}
                  {type.benefits && type.benefits.length > 0 && (
                    <ul className="mt-4 flex-1 space-y-2">
                      {type.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Join Now Button */}
                  <Link
                    href="/member/register"
                    className="mt-6 block rounded-lg bg-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
                  >
                    Join Now
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
              <p className="text-slate-300">
                Contact us for membership information.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block font-medium text-gold-500 transition-colors hover:text-gold-400"
              >
                Get in Touch
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How to Join Section */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8 flex items-center justify-center gap-3">
            <EnvelopeIcon className="h-8 w-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">{joinHeading}</h2>
          </div>

          <div className="space-y-8">
            {/* Online Application */}
            <div className="rounded-lg border border-gold-500/20 bg-navy-800 p-8">
              <h3 className="text-heading-3 mb-4 text-white">
                {membershipFormLabel}
              </h3>
              <p className="mb-6 text-slate-300">
                Complete your membership application and payment online for the fastest way to join.
              </p>
              <a
                href={membershipFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-gold-500 px-8 py-3 font-heading font-bold text-navy-900 transition-colors hover:bg-gold-600"
              >
                Complete Online Form
              </a>
            </div>

            {/* Mail-In Option */}
            <div className="rounded-lg border border-gold-500/20 bg-navy-800 p-8">
              <h3 className="text-heading-3 mb-4 text-white">
                Mail-In Application
              </h3>
              <p className="mb-4 text-slate-300">{mailInIntro}</p>
              <a
                href={membershipApplicationPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-block text-teal-500 underline hover:text-teal-400"
              >
                Download Printable Application (PDF)
              </a>

              <div className="border-t border-navy-700 pt-4">
                <p className="mb-2 font-medium text-white">Mail to:</p>
                <address className="not-italic text-slate-300">
                  {mailInAddress.name}
                  <br />
                  {mailInAddress.address}
                  <br />
                  {mailInAddress.city}, {mailInAddress.state} {mailInAddress.zip}
                </address>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <p className="mt-8 text-center italic text-slate-400">
            Have questions?{' '}
            <Link
              href="/contact"
              className="text-teal-500 underline hover:text-teal-400"
            >
              Contact us
            </Link>{' '}
            for more information about membership.
          </p>
        </div>
      </section>
    </>
  );
}
