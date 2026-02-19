import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  TrophyIcon,
  CreditCardIcon,
  PlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/server";
import { getShows } from "@/lib/actions/shows";
import { getSponsors } from "@/lib/actions/sponsors";
import { getResults } from "@/lib/actions/results";
import { getPaymentsSummary } from "@/lib/actions/admin-payments";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const showsResult = await getShows();
  const shows = Array.isArray(showsResult) ? showsResult : [];

  const sponsorsResult = await getSponsors();
  const sponsorsList = Array.isArray(sponsorsResult) ? sponsorsResult : [];

  const resultsResult = await getResults();
  const resultsList = Array.isArray(resultsResult) ? resultsResult : [];

  const paymentsSummaryResult = await getPaymentsSummary();
  const paymentsSummary =
    paymentsSummaryResult && !("error" in paymentsSummaryResult)
      ? paymentsSummaryResult
      : null;

  const contentCards = [
    {
      label: "Shows",
      count: shows.length,
      icon: CalendarDaysIcon,
      href: "/admin/shows",
    },
    {
      label: "Sponsors",
      count: sponsorsList.length,
      icon: BuildingStorefrontIcon,
      href: "/admin/sponsors",
    },
    {
      label: "Results",
      count: resultsList.length,
      icon: TrophyIcon,
      href: "/admin/results",
    },
    {
      label: "Payments",
      count: paymentsSummary?.total_count ?? 0,
      icon: CreditCardIcon,
      href: "/admin/payments",
    },
  ];

  const quickActions = [
    {
      label: "Add Show",
      icon: PlusIcon,
      href: "/admin/shows/new",
    },
    {
      label: "Add Sponsor",
      icon: PlusIcon,
      href: "/admin/sponsors/new",
    },
    {
      label: "Update Results",
      icon: PencilSquareIcon,
      href: "/admin/results",
    },
    {
      label: "View Payments",
      icon: CreditCardIcon,
      href: "/admin/payments",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-gray-400">{user.email}</p>
        <p className="mt-0.5 text-sm text-gray-500">
          SWMRHA Admin Dashboard
        </p>
      </div>

      {/* Content summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contentCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg border border-navy-700 bg-navy-800 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Icon className="h-8 w-8 text-gold-500" />
                  <p className="mt-4 text-3xl font-bold text-white">
                    {card.count}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">{card.label}</p>
                </div>
              </div>
              <Link
                href={card.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
              >
                Manage &rarr;
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-white">
          Quick Actions
        </h3>
        <div className="mt-3 flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-600"
              >
                <Icon className="h-5 w-5 text-gold-500" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
