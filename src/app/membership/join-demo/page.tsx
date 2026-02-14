"use client";

import { useState } from "react";
import { CheckCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";

const membershipTypes = [
  {
    id: "individual",
    name: "Individual Membership",
    price: 75,
    description: "Perfect for individual riders and trainers",
    features: ["NRHA affiliation", "Member discounts", "Newsletter access", "Voting rights"],
  },
  {
    id: "family",
    name: "Family Membership",
    price: 100,
    description: "Covers entire household",
    features: ["All individual benefits", "Up to 4 family members", "Shared member portal", "Family events access"],
  },
  {
    id: "youth",
    name: "Youth Membership",
    price: 50,
    description: "For riders 18 and under",
    features: ["NRHA affiliation", "Youth program access", "Educational resources", "Competition discounts"],
  },
];

export default function JoinDemo() {
  const [step, setStep] = useState(1);
  const [selectedMembership, setSelectedMembership] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const selectedType = membershipTypes.find((type) => type.id === selectedMembership);

  return (
    <>
      {/* Demo Banner */}
      <div className="bg-gold-500 text-navy-900 py-3 text-center font-bold">
        🎯 DEMO MODE - This is a demonstration of the membership registration flow
      </div>

      <div className="min-h-screen bg-navy-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-heading-1 text-white mb-4">Join SWMRHA</h1>
            <p className="text-slate-300 text-lg">
              Become a member and support grassroots reining
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= num
                        ? "bg-gold-500 text-navy-900"
                        : "bg-navy-600 text-slate-400"
                    }`}
                  >
                    {num}
                  </div>
                  {num < 3 && (
                    <div
                      className={`w-16 h-1 ${
                        step > num ? "bg-gold-500" : "bg-navy-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-navy-900 rounded-lg p-8 border border-navy-600">
            {/* Step 1: Select Membership */}
            {step === 1 && (
              <div>
                <h2 className="text-heading-2 text-white mb-6">
                  Select Membership Type
                </h2>
                <div className="space-y-4">
                  {membershipTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`block p-6 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedMembership === type.id
                          ? "border-gold-500 bg-navy-800"
                          : "border-navy-600 hover:border-navy-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="membership"
                        value={type.id}
                        checked={selectedMembership === type.id}
                        onChange={(e) => setSelectedMembership(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {type.name}
                          </h3>
                          <p className="text-slate-400 mt-1">{type.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gold-500">
                            ${type.price}
                          </div>
                          <div className="text-sm text-slate-400">per year</div>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-300">
                            <CheckCircleIcon className="w-5 h-5 text-gold-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Member Information */}
            {step === 2 && (
              <div>
                <h2 className="text-heading-2 text-white mb-6">
                  Member Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                        placeholder="Springfield"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                        placeholder="MO"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) =>
                          setFormData({ ...formData, zip: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                        placeholder="65801"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 className="text-heading-2 text-white mb-6">
                  Payment Information
                </h2>

                {/* Order Summary */}
                <div className="bg-navy-800 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span>{selectedType?.name}</span>
                      <span className="font-bold">${selectedType?.price}</span>
                    </div>
                    <div className="border-t border-navy-600 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-gold-500">
                        <span>Total</span>
                        <span>${selectedType?.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Payment Demo */}
                <div className="border-2 border-dashed border-gold-500 rounded-lg p-8 text-center">
                  <CreditCardIcon className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Stripe Payment Integration
                  </h3>
                  <p className="text-slate-300 mb-4">
                    In the live system, this is where Stripe's secure payment form would appear
                  </p>
                  <div className="bg-navy-800 rounded-lg p-6 text-left max-w-md mx-auto">
                    <p className="text-sm text-slate-400 mb-4">What happens here:</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>✓ Secure credit card form (PCI compliant)</li>
                      <li>✓ Accept Visa, Mastercard, Amex, Discover</li>
                      <li>✓ Automatic receipt generation</li>
                      <li>✓ Instant membership activation</li>
                      <li>✓ Email confirmation sent</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t border-navy-600">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-600 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 && (
                <button
                  onClick={handleNext}
                  disabled={step === 1 && !selectedMembership}
                  className="ml-auto px-6 py-2 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              )}
              {step === 3 && (
                <button
                  className="ml-auto px-6 py-2 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
                >
                  Complete Payment (Demo)
                </button>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-navy-900 rounded-lg p-6 border border-navy-600">
            <h3 className="text-xl font-bold text-white mb-4">
              How the Real System Works
            </h3>
            <div className="space-y-3 text-slate-300">
              <p>
                <strong className="text-gold-500">Step 1:</strong> Member selects membership type and sees pricing
              </p>
              <p>
                <strong className="text-gold-500">Step 2:</strong> Member fills out registration form with their information
              </p>
              <p>
                <strong className="text-gold-500">Step 3:</strong> Stripe securely processes payment (no card data touches our servers)
              </p>
              <p>
                <strong className="text-gold-500">Step 4:</strong> Member receives instant confirmation email with receipt
              </p>
              <p>
                <strong className="text-gold-500">Step 5:</strong> Admin dashboard updates with new member information
              </p>
              <p>
                <strong className="text-gold-500">Step 6:</strong> Member gains access to member portal and benefits
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
