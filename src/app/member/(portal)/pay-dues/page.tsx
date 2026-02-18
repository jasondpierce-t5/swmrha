import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { getMemberProfile } from '@/lib/actions/members';
import { getActiveMembershipTypes } from '@/lib/actions/membership-types';
import CheckoutButton from '@/components/CheckoutButton';

/** Color-coded badge for membership status. */
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: 'border-green-700 bg-green-900/50 text-green-300',
    pending: 'border-yellow-700 bg-yellow-900/50 text-yellow-300',
    expired: 'border-red-700 bg-red-900/50 text-red-300',
    suspended: 'border-red-700 bg-red-900/50 text-red-300',
  };

  const colors = colorMap[status] ?? 'border-navy-600 bg-navy-700 text-gray-300';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}

/** Badge for membership type. */
function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-gold-500">
      {type}
    </span>
  );
}

/** Format price cents to a display string with duration. */
function formatPrice(priceCents: number, durationMonths: number | null): string {
  const dollars = (priceCents / 100).toFixed(2);
  if (durationMonths === null) {
    return `$${dollars}`;
  }
  if (durationMonths === 12) {
    return `$${dollars}/year`;
  }
  return `$${dollars}/${durationMonths} mo`;
}

/** Duration label for display. */
function formatDuration(durationMonths: number | null): string {
  if (durationMonths === null) return 'One-time / Lifetime';
  if (durationMonths === 12) return 'Annual';
  return `${durationMonths} month${durationMonths !== 1 ? 's' : ''}`;
}

export default async function PayDuesPage() {
  const [memberResult, typesResult] = await Promise.all([
    getMemberProfile(),
    getActiveMembershipTypes(),
  ]);

  // Error state for member profile
  if ('error' in memberResult) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-6">
          <h2 className="font-heading text-lg font-semibold text-red-300">
            Unable to Load Profile
          </h2>
          <p className="mt-2 text-sm text-red-200">{memberResult.error}</p>
        </div>
      </div>
    );
  }

  const member = memberResult;
  const membershipTypes = Array.isArray(typesResult) ? typesResult : [];

  // Determine heading based on member status
  const isActive = member.membership_status === 'active';
  const heading = isActive ? 'Renew Your Membership' : 'Pay Membership Dues';
  const subtitle = isActive
    ? 'Select a membership type below to renew your membership.'
    : 'Select a membership type below to complete your membership payment.';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">{heading}</h1>
        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      </div>

      {/* Current Membership Info */}
      {(member.membership_status === 'active' ||
        member.membership_status === 'expired') && (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <h3 className="font-heading text-lg font-semibold text-white">
            Current Membership
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <TypeBadge type={member.membership_type} />
            <StatusBadge status={member.membership_status} />
            {member.membership_expiry && (
              <span className="text-sm text-gray-400">
                {member.membership_status === 'expired' ? 'Expired' : 'Expires'}:{' '}
                <span className="text-white">
                  {new Date(member.membership_expiry).toLocaleDateString()}
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Membership Type Cards */}
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
          {membershipTypes.map((type) => {
            const isCurrent =
              member.membership_type.toLowerCase() === type.slug.toLowerCase() ||
              member.membership_type.toLowerCase() === type.name.toLowerCase();

            // Determine button label
            let buttonLabel = `Select ${type.name}`;
            if (isCurrent) {
              buttonLabel = 'Renew';
            } else if (isActive) {
              buttonLabel = `Switch to ${type.name}`;
            }

            return (
              <div
                key={type.id}
                className={`relative flex flex-col rounded-lg border p-6 transition-colors ${
                  isCurrent
                    ? 'border-gold-500/50 bg-navy-800'
                    : 'border-navy-700 bg-navy-800 hover:border-gold-500/30'
                }`}
              >
                {/* Current Plan Badge */}
                {isCurrent && (
                  <span className="absolute -top-3 left-4 rounded-full bg-gold-500 px-3 py-0.5 text-xs font-semibold text-navy-900">
                    Current Plan
                  </span>
                )}

                {/* Tier Name */}
                <h3 className="font-heading text-xl font-bold text-white">
                  {type.name}
                </h3>

                {/* Price */}
                <p className="mt-2 font-heading text-2xl font-bold text-gold-500">
                  {formatPrice(type.price_cents, type.duration_months)}
                </p>

                {/* Duration */}
                <p className="mt-1 text-xs text-gray-400">
                  {formatDuration(type.duration_months)}
                </p>

                {/* Description */}
                {type.description && (
                  <p className="mt-3 text-sm text-slate-300">{type.description}</p>
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

                {/* Checkout Button */}
                <div className="mt-6">
                  <CheckoutButton
                    membershipTypeSlug={type.slug}
                    label={buttonLabel}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-slate-300">
            No membership types are currently available. Please check back later
            or contact us for assistance.
          </p>
        </div>
      )}
    </div>
  );
}
