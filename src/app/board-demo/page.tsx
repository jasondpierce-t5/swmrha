import Link from "next/link";
import {
  UserGroupIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

export default function BoardDemo() {
  return (
    <div className="min-h-screen bg-navy-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-heading-1 text-white mb-4">
            Online Registration & Payment System
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Streamline membership and show registration with secure online payments
          </p>

          {/* Demo Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership/join-demo"
              className="px-6 py-3 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
            >
              View Membership Demo
            </Link>
            <Link
              href="/shows/register-demo"
              className="px-6 py-3 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
            >
              View Show Registration Demo
            </Link>
          </div>
        </div>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-heading-2 text-white mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-navy-900 rounded-lg p-6 border border-navy-600">
              <UserGroupIcon className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Membership Management
              </h3>
              <p className="text-slate-300">
                Online sign-ups, automatic renewals, and member portal access
              </p>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 border border-navy-600">
              <CalendarDaysIcon className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Show Registration
              </h3>
              <p className="text-slate-300">
                Register for shows, select classes, and pay entry fees online
              </p>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 border border-navy-600">
              <CreditCardIcon className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Secure Payments
              </h3>
              <p className="text-slate-300">
                Stripe integration for PCI-compliant credit card processing
              </p>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 border border-navy-600">
              <ChartBarIcon className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Admin Dashboard
              </h3>
              <p className="text-slate-300">
                Track registrations, payments, and generate reports
              </p>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 border border-navy-600">
              <ShieldCheckIcon className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Automatic Receipts
              </h3>
              <p className="text-slate-300">
                Instant email receipts and confirmation for all transactions
              </p>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 border border-navy-600">
              <BellAlertIcon className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Notifications
              </h3>
              <p className="text-slate-300">
                Automated emails for confirmations, reminders, and updates
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-heading-2 text-white mb-8 text-center">
            Benefits for SWMRHA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-navy-900 rounded-lg p-6 border border-gold-500/20">
              <h3 className="text-xl font-bold text-gold-500 mb-4">
                For the Organization
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Reduced Administrative Work:</strong> No manual entry processing
                    or payment tracking
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Faster Payment Processing:</strong> Instant payment confirmation
                    and fund deposits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Better Record Keeping:</strong> All registrations and payments
                    tracked digitally
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Professional Image:</strong> Modern, streamlined registration
                    process
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Data Analytics:</strong> Easy reporting on membership trends and
                    show participation
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 border border-gold-500/20">
              <h3 className="text-xl font-bold text-gold-500 mb-4">For Members</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Convenience:</strong> Register and pay anytime, from anywhere
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Instant Confirmation:</strong> Immediate receipt and entry
                    confirmation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Secure Payments:</strong> Credit card data never touches our
                    servers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Easy Updates:</strong> Modify registrations online if policies
                    allow
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>
                    <strong>Digital Records:</strong> Access past registrations and receipts
                    anytime
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How Stripe Works */}
        <section className="mb-12">
          <h2 className="text-heading-2 text-white mb-8 text-center">
            Why Stripe?
          </h2>
          <div className="bg-navy-900 rounded-lg p-8 border border-navy-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gold-500 mb-4">
                  Industry Standard
                </h3>
                <p className="text-slate-300 mb-4">
                  Stripe is used by millions of businesses worldwide, including Amazon,
                  Shopify, and Lyft. It's trusted, secure, and reliable.
                </p>
                <h4 className="font-bold text-white mb-2">Security Features:</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• PCI DSS Level 1 certified (highest security level)</li>
                  <li>• Card data never touches our servers</li>
                  <li>• Built-in fraud detection</li>
                  <li>• 3D Secure authentication support</li>
                  <li>• Encrypted transactions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gold-500 mb-4">Pricing</h3>
                <div className="bg-navy-800 rounded-lg p-6">
                  <div className="text-3xl font-bold text-white mb-2">2.9% + 30¢</div>
                  <p className="text-slate-400 mb-4">per successful transaction</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>✓ No monthly fees</li>
                    <li>✓ No setup fees</li>
                    <li>✓ No hidden fees</li>
                    <li>✓ Only pay when you get paid</li>
                  </ul>
                  <div className="mt-4 p-4 bg-navy-900 rounded">
                    <p className="text-xs text-slate-400 mb-2">Example:</p>
                    <p className="text-sm text-white">
                      $100 membership = $3.20 fee = <strong>$96.80 net</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section className="mb-12">
          <h2 className="text-heading-2 text-white mb-8 text-center">
            Implementation Plan
          </h2>
          <div className="bg-navy-900 rounded-lg p-8 border border-navy-600">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Setup Stripe Account (1 week)
                  </h3>
                  <p className="text-slate-300">
                    Create business Stripe account, verify banking information, configure
                    payment settings
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Build Registration Forms (2-3 weeks)
                  </h3>
                  <p className="text-slate-300">
                    Develop membership and show registration forms, integrate Stripe
                    payment processing
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Testing & Refinement (1 week)
                  </h3>
                  <p className="text-slate-300">
                    Test with board members, collect feedback, refine user experience
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Launch & Monitor (Ongoing)
                  </h3>
                  <p className="text-slate-300">
                    Go live, monitor transactions, provide member support as needed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-navy-900 rounded-lg p-8 border border-gold-500">
          <h2 className="text-heading-2 text-white mb-4">Ready to See It in Action?</h2>
          <p className="text-slate-300 mb-6">
            Try the interactive demos to experience how members will register and pay
            online
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership/join-demo"
              className="px-6 py-3 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Membership Demo →
            </Link>
            <Link
              href="/shows/register-demo"
              className="px-6 py-3 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Show Registration Demo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
