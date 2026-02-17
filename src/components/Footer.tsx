import Link from "next/link";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 border-t border-navy-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: SWMRHA */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-heading text-gold-500 font-bold text-xl">
                SWMRHA
              </span>
            </Link>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              Southwest Missouri Reining Horse Association
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.facebook.com/SWMRHA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-gold-500 transition-colors"
                aria-label="SWMRHA on Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/swmrha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-gold-500 transition-colors"
                aria-label="SWMRHA on Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/shows/schedule"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Shows &amp; Events
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Results
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Membership & Resources */}
          <div>
            <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Membership &amp; Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/membership/join"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Join SWMRHA
                </Link>
              </li>
              <li>
                <Link
                  href="/membership/rules"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Rules &amp; Classes
                </Link>
              </li>
              <li>
                <Link
                  href="/membership/green-as-grass"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Green as Grass
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/find-a-trainer"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Find a Trainer
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/faq"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@swmrha.com"
                  className="text-slate-400 hover:text-gold-500 transition-colors text-sm"
                >
                  info@swmrha.com
                </a>
              </li>
              <li>
                <span className="text-slate-400 text-sm">
                  Southwest Missouri
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-500 text-sm">
            &copy; {currentYear} SWMRHA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
