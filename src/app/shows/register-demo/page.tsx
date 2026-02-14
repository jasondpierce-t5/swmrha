"use client";

import { useState } from "react";
import { CheckCircleIcon, CreditCardIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const shows = [
  {
    id: "route66",
    name: "The Route 66 Slide",
    date: "April 4-6, 2025",
    location: "Carthage, MO - Lucky J Arena",
    type: "Derby & Rookie Scooter Shootout",
  },
  {
    id: "patriot",
    name: "The Patriot Slide",
    date: "July 19-20, 2025",
    location: "Carthage, MO - Lucky J Arena",
    type: "Pre Futurity & Freestyle",
  },
];

const classes = [
  { id: "open-derby", name: "Open Derby", fee: 150, level: "Open" },
  { id: "non-pro-derby", name: "Non Pro Derby", fee: 125, level: "Non Pro" },
  { id: "rookie-1", name: "Rookie Professional Level 1", fee: 100, level: "Rookie" },
  { id: "rookie-2", name: "Rookie Professional Level 2", fee: 100, level: "Rookie" },
  { id: "intermediate-open", name: "Intermediate Open", fee: 75, level: "Open" },
  { id: "intermediate-non-pro", name: "Intermediate Non Pro", fee: 75, level: "Non Pro" },
  { id: "prime-time-open", name: "Prime Time Plus Open", fee: 75, level: "Open" },
  { id: "prime-time-non-pro", name: "Prime Time Plus Non Pro", fee: 75, level: "Non Pro" },
  { id: "youth", name: "Youth Reining", fee: 50, level: "Youth" },
];

interface Entry {
  id: string;
  horseName: string;
  riderName: string;
  selectedClasses: string[];
}

export default function ShowRegisterDemo() {
  const [step, setStep] = useState(1);
  const [selectedShow, setSelectedShow] = useState("");
  const [entries, setEntries] = useState<Entry[]>([
    { id: "1", horseName: "", riderName: "", selectedClasses: [] },
  ]);

  const addEntry = () => {
    setEntries([
      ...entries,
      { id: Date.now().toString(), horseName: "", riderName: "", selectedClasses: [] },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: string, field: keyof Entry, value: any) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const toggleClass = (entryId: string, classId: string) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === entryId) {
          const classes = entry.selectedClasses.includes(classId)
            ? entry.selectedClasses.filter((c) => c !== classId)
            : [...entry.selectedClasses, classId];
          return { ...entry, selectedClasses: classes };
        }
        return entry;
      })
    );
  };

  const calculateTotal = () => {
    let total = 0;
    entries.forEach((entry) => {
      entry.selectedClasses.forEach((classId) => {
        const classInfo = classes.find((c) => c.id === classId);
        if (classInfo) total += classInfo.fee;
      });
    });
    return total;
  };

  const selectedShowInfo = shows.find((show) => show.id === selectedShow);

  return (
    <>
      {/* Demo Banner */}
      <div className="bg-gold-500 text-navy-900 py-3 text-center font-bold">
        🎯 DEMO MODE - This is a demonstration of the show registration flow
      </div>

      <div className="min-h-screen bg-navy-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-heading-1 text-white mb-4">Show Registration</h1>
            <p className="text-slate-300 text-lg">
              Register for SWMRHA shows and enter your classes online
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
            {/* Step 1: Select Show */}
            {step === 1 && (
              <div>
                <h2 className="text-heading-2 text-white mb-6">Select Show</h2>
                <div className="space-y-4">
                  {shows.map((show) => (
                    <label
                      key={show.id}
                      className={`block p-6 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedShow === show.id
                          ? "border-gold-500 bg-navy-800"
                          : "border-navy-600 hover:border-navy-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="show"
                        value={show.id}
                        checked={selectedShow === show.id}
                        onChange={(e) => setSelectedShow(e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {show.name}
                        </h3>
                        <p className="text-gold-500 font-medium mb-1">{show.type}</p>
                        <p className="text-slate-400">{show.date}</p>
                        <p className="text-slate-400">{show.location}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Entries and Classes */}
            {step === 2 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-heading-2 text-white">Entries & Classes</h2>
                  <button
                    onClick={addEntry}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Entry
                  </button>
                </div>

                <div className="space-y-8">
                  {entries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-navy-800 rounded-lg p-6 border border-navy-600"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">
                          Entry #{index + 1}
                        </h3>
                        {entries.length > 1 && (
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <XMarkIcon className="w-6 h-6" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Horse Name *
                          </label>
                          <input
                            type="text"
                            value={entry.horseName}
                            onChange={(e) =>
                              updateEntry(entry.id, "horseName", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                            placeholder="Enter horse name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Rider Name *
                          </label>
                          <input
                            type="text"
                            value={entry.riderName}
                            onChange={(e) =>
                              updateEntry(entry.id, "riderName", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                            placeholder="Enter rider name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                          Select Classes *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {classes.map((classInfo) => (
                            <label
                              key={classInfo.id}
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                                entry.selectedClasses.includes(classInfo.id)
                                  ? "border-gold-500 bg-navy-900"
                                  : "border-navy-600 hover:border-navy-500"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={entry.selectedClasses.includes(classInfo.id)}
                                  onChange={() => toggleClass(entry.id, classInfo.id)}
                                  className="w-4 h-4"
                                />
                                <div>
                                  <div className="text-white font-medium">
                                    {classInfo.name}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    {classInfo.level}
                                  </div>
                                </div>
                              </div>
                              <div className="text-gold-500 font-bold">
                                ${classInfo.fee}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 className="text-heading-2 text-white mb-6">
                  Review & Payment
                </h2>

                {/* Order Summary */}
                <div className="bg-navy-800 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Registration Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="text-slate-300">
                      <strong className="text-gold-500">Show:</strong>{" "}
                      {selectedShowInfo?.name}
                    </div>
                    {entries.map((entry, index) => (
                      <div key={entry.id} className="border-t border-navy-600 pt-4">
                        <div className="font-bold text-white mb-2">
                          Entry #{index + 1}: {entry.horseName || "Unnamed Horse"} /{" "}
                          {entry.riderName || "Unnamed Rider"}
                        </div>
                        {entry.selectedClasses.map((classId) => {
                          const classInfo = classes.find((c) => c.id === classId);
                          return (
                            <div
                              key={classId}
                              className="flex justify-between text-slate-300 ml-4"
                            >
                              <span>{classInfo?.name}</span>
                              <span className="font-bold">${classInfo?.fee}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div className="border-t border-navy-600 pt-4">
                      <div className="flex justify-between text-xl font-bold text-gold-500">
                        <span>Total Entry Fees</span>
                        <span>${calculateTotal()}</span>
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
                    In the live system, this is where Stripe's secure payment form
                    would appear
                  </p>
                  <div className="bg-navy-800 rounded-lg p-6 text-left max-w-md mx-auto">
                    <p className="text-sm text-slate-400 mb-4">What happens here:</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>✓ Secure credit card form (PCI compliant)</li>
                      <li>✓ Immediate entry confirmation</li>
                      <li>✓ Automatic receipt generation</li>
                      <li>✓ Entry confirmation email sent</li>
                      <li>✓ Admin dashboard updates with new entries</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t border-navy-600">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-600 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 && (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !selectedShow}
                  className="ml-auto px-6 py-2 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              )}
              {step === 3 && (
                <button className="ml-auto px-6 py-2 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors">
                  Complete Payment (Demo)
                </button>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-navy-900 rounded-lg p-6 border border-navy-600">
            <h3 className="text-xl font-bold text-white mb-4">
              How Show Registration Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
              <div>
                <h4 className="font-bold text-gold-500 mb-2">For Members:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Select show and entry dates</li>
                  <li>• Enter multiple horse/rider combinations</li>
                  <li>• Choose classes for each entry</li>
                  <li>• See real-time fee calculation</li>
                  <li>• Pay securely with Stripe</li>
                  <li>• Receive instant confirmation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gold-500 mb-2">For Admins:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• View all entries in dashboard</li>
                  <li>• Track payments and confirmations</li>
                  <li>• Export entry lists for show day</li>
                  <li>• Process refunds if needed</li>
                  <li>• Send updates to participants</li>
                  <li>• Generate reports and analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
