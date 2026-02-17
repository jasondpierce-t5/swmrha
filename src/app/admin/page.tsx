import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  TrophyIcon,
  PlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/server";
import { showSchedule, resultsLinks } from "@/data/shows";
import { sponsors } from "@/data/sponsors";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const contentCards = [
    {
      label: "Shows",
      count: showSchedule.length,
      icon: CalendarDaysIcon,
      href: "/admin/shows",
    },
    {
      label: "Sponsors",
      count: sponsors.length,
      icon: BuildingStorefrontIcon,
      href: "/admin/sponsors",
    },
    {
      label: "Results",
      count: resultsLinks.length,
      icon: TrophyIcon,
      href: "/admin/results",
    },
  ];

  const quickActions = [
    {
      label: "Add Show",
      icon: PlusIcon,
      href: "/admin/shows",
    },
    {
      label: "Add Sponsor",
      icon: PlusIcon,
      href: "/admin/sponsors",
    },
    {
      label: "Update Results",
      icon: PencilSquareIcon,
      href: "/admin/results",
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Recent activity placeholder */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-white">
          Recent Activity
        </h3>
        <div className="mt-3 rounded-lg border border-navy-700 bg-navy-800 p-6">
          <p className="text-sm italic text-gray-400">
            Activity tracking will be available once management features are
            enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
