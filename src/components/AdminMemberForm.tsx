'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateMemberAdmin } from '@/lib/actions/admin-members';
import type { MemberRow, MembershipTypeRow } from '@/types/database';

interface AdminMemberFormProps {
  member: MemberRow;
  membershipTypes: MembershipTypeRow[];
}

export default function AdminMemberForm({ member, membershipTypes }: AdminMemberFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Personal info state
  const [firstName, setFirstName] = useState(member.first_name);
  const [lastName, setLastName] = useState(member.last_name);
  const [phone, setPhone] = useState(member.phone ?? '');

  // Address state
  const [addressLine1, setAddressLine1] = useState(member.address_line1 ?? '');
  const [addressLine2, setAddressLine2] = useState(member.address_line2 ?? '');
  const [city, setCity] = useState(member.city ?? '');
  const [state, setState] = useState(member.state ?? 'MO');
  const [zip, setZip] = useState(member.zip ?? '');

  // Membership state
  const [membershipType, setMembershipType] = useState(member.membership_type);
  const [membershipStatus, setMembershipStatus] = useState(member.membership_status);
  const [membershipStart, setMembershipStart] = useState(member.membership_start ?? '');
  const [membershipExpiry, setMembershipExpiry] = useState(member.membership_expiry ?? '');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateMemberAdmin(member.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        address_line1: addressLine1.trim() || null,
        address_line2: addressLine2.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        zip: zip.trim() || null,
        membership_type: membershipType,
        membership_status: membershipStatus,
        membership_start: membershipStart || null,
        membership_expiry: membershipExpiry || null,
      });

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push('/admin/members?success=updated');
    });
  }

  const inputClasses =
    'w-full rounded-lg border border-navy-700 bg-navy-700 px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none';

  const selectClasses =
    'w-full rounded-lg border border-navy-700 bg-navy-700 px-3 py-2 text-white transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Personal Information</h3>
        <div className="space-y-5">
          {/* First Name / Last Name row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-white">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                required
                maxLength={100}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-white">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                required
                maxLength={100}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Address</h3>
        <div className="space-y-5">
          {/* Address Line 1 */}
          <div>
            <label htmlFor="addressLine1" className="mb-1.5 block text-sm font-medium text-white">
              Address Line 1
            </label>
            <input
              id="addressLine1"
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Street address"
              className={inputClasses}
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="addressLine2" className="mb-1.5 block text-sm font-medium text-white">
              Address Line 2
            </label>
            <input
              id="addressLine2"
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Apt, suite, unit, etc."
              className={inputClasses}
            />
          </div>

          {/* City / State / Zip row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-white">
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-white">
                State
              </label>
              <input
                id="state"
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="MO"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-white">
                ZIP Code
              </label>
              <input
                id="zip"
                type="text"
                maxLength={10}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="65802"
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Membership */}
      <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Membership</h3>
        <div className="space-y-5">
          {/* Membership Type / Status row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="membershipType" className="mb-1.5 block text-sm font-medium text-white">
                Membership Type
              </label>
              <select
                id="membershipType"
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className={selectClasses}
              >
                {membershipTypes.map((mt) => (
                  <option key={mt.id} value={mt.slug}>
                    {mt.name} &mdash; ${(mt.price_cents / 100).toFixed(2)}/yr
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="membershipStatus" className="mb-1.5 block text-sm font-medium text-white">
                Status
              </label>
              <select
                id="membershipStatus"
                value={membershipStatus}
                onChange={(e) => setMembershipStatus(e.target.value)}
                className={selectClasses}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Start Date / Expiry Date row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="membershipStart" className="mb-1.5 block text-sm font-medium text-white">
                Membership Start
              </label>
              <input
                id="membershipStart"
                type="date"
                value={membershipStart}
                onChange={(e) => setMembershipStart(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="membershipExpiry" className="mb-1.5 block text-sm font-medium text-white">
                Membership Expiry
              </label>
              <input
                id="membershipExpiry"
                type="date"
                value={membershipExpiry}
                onChange={(e) => setMembershipExpiry(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/members"
          className="rounded-lg border border-navy-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-navy-700 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Update Member'}
        </button>
      </div>
    </form>
  );
}
