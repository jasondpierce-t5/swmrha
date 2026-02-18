'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateMemberProfile } from '@/lib/actions/members';
import type { MemberRow } from '@/types/database';

interface ProfileFormProps {
  member: MemberRow;
}

export default function ProfileForm({ member }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form field state
  const [firstName, setFirstName] = useState(member.first_name ?? '');
  const [lastName, setLastName] = useState(member.last_name ?? '');
  const [phone, setPhone] = useState(member.phone ?? '');
  const [addressLine1, setAddressLine1] = useState(member.address_line1 ?? '');
  const [addressLine2, setAddressLine2] = useState(member.address_line2 ?? '');
  const [city, setCity] = useState(member.city ?? '');
  const [state, setState] = useState(member.state ?? 'MO');
  const [zip, setZip] = useState(member.zip ?? '');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!firstName.trim()) {
      setError('First name is required.');
      return;
    }
    if (!lastName.trim()) {
      setError('Last name is required.');
      return;
    }

    startTransition(async () => {
      const result = await updateMemberProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
        address_line1: addressLine1.trim() || undefined,
        address_line2: addressLine2.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        zip: zip.trim() || undefined,
      });

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push('/member/profile?success=updated');
    });
  }

  const inputClasses =
    'w-full rounded-lg border border-navy-700 bg-navy-700 px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none';

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
        <h3 className="mb-4 text-sm font-semibold text-white">
          Personal Information
        </h3>
        <div className="space-y-5">
          {/* First Name / Last Name row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-sm font-medium text-white"
              >
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                required
                maxLength={100}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-sm font-medium text-white"
              >
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                required
                maxLength={100}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-white"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 555-5555"
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
            <label
              htmlFor="addressLine1"
              className="mb-1.5 block text-sm font-medium text-white"
            >
              Address Line 1
            </label>
            <input
              id="addressLine1"
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="123 Main Street"
              className={inputClasses}
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label
              htmlFor="addressLine2"
              className="mb-1.5 block text-sm font-medium text-white"
            >
              Address Line 2
            </label>
            <input
              id="addressLine2"
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Apt, Suite, Unit, etc."
              className={inputClasses}
            />
          </div>

          {/* City / State / Zip row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="city"
                className="mb-1.5 block text-sm font-medium text-white"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                maxLength={100}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Springfield"
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="mb-1.5 block text-sm font-medium text-white"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="MO"
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="mb-1.5 block text-sm font-medium text-white"
              >
                ZIP Code
              </label>
              <input
                id="zip"
                type="text"
                maxLength={10}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="65801"
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/member/profile"
          className="rounded-lg border border-navy-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-navy-700 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
