export default function ThemePage() {
  return (
    <main className="min-h-screen bg-navy-800 px-6 py-12 font-body text-white">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Page header */}
        <header>
          <h1 className="text-display text-white">Design System</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            SWMRHA theme reference — color palette, typography scale, component
            patterns, and text hierarchy.
          </p>
        </header>

        {/* ────────────────────────────────────────────
            1. Color Swatches
        ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-heading-1 text-white">Color Palette</h2>

          {/* Navy */}
          <h3 className="text-heading-3 mt-8 text-slate-300">Navy</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ColorSwatch name="navy-900" hex="#0A1219" className="bg-navy-900" />
            <ColorSwatch name="navy-800" hex="#0F1923" className="bg-navy-800" />
            <ColorSwatch name="navy-700" hex="#162A3E" className="bg-navy-700" />
            <ColorSwatch name="navy-600" hex="#1E3A5F" className="bg-navy-600" />
          </div>

          {/* Gold */}
          <h3 className="text-heading-3 mt-8 text-slate-300">Gold</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <ColorSwatch name="gold-500" hex="#C8A55C" className="bg-gold-500" dark />
            <ColorSwatch name="gold-400" hex="#D4B76A" className="bg-gold-400" dark />
            <ColorSwatch name="gold-300" hex="#E0C97E" className="bg-gold-300" dark />
          </div>

          {/* Teal */}
          <h3 className="text-heading-3 mt-8 text-slate-300">Teal</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
            <ColorSwatch name="teal-500" hex="#2A9D8F" className="bg-teal-500" />
            <ColorSwatch name="teal-400" hex="#35B8A8" className="bg-teal-400" />
          </div>

          {/* Semantic */}
          <h3 className="text-heading-3 mt-8 text-slate-300">Semantic</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <ColorSwatch name="success" hex="#22C55E" className="bg-success" />
            <ColorSwatch name="error" hex="#EF4444" className="bg-error" />
            <ColorSwatch name="warning" hex="#F59E0B" className="bg-warning" dark />
          </div>
        </section>

        {/* ────────────────────────────────────────────
            2. Typography Scale
        ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-heading-1 text-white">Typography Scale</h2>

          <div className="mt-8 space-y-8">
            <TypographySample
              label="Display"
              specs="3.5rem / 1.1 / 800 — Montserrat"
              className="text-display"
            >
              Southwest Missouri
            </TypographySample>

            <TypographySample
              label="Heading 1"
              specs="2.25rem / 1.2 / 700 — Montserrat"
              className="text-heading-1"
            >
              Regional Housing Authority
            </TypographySample>

            <TypographySample
              label="Heading 2"
              specs="1.75rem / 1.25 / 700 — Montserrat"
              className="text-heading-2"
            >
              Upcoming Events &amp; Shows
            </TypographySample>

            <TypographySample
              label="Heading 3"
              specs="1.25rem / 1.3 / 600 — Montserrat"
              className="text-heading-3"
            >
              Membership Benefits
            </TypographySample>

            <TypographySample
              label="Body"
              specs="1rem / 1.5 / 400 — Inter"
              className="font-body text-base leading-relaxed"
            >
              The Southwest Missouri Regional Horse Association is dedicated to
              promoting equestrian events, trail rides, and community involvement
              across the region. Join us for our next show!
            </TypographySample>
          </div>
        </section>

        {/* ────────────────────────────────────────────
            3. Component Patterns
        ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-heading-1 text-white">Component Patterns</h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Sample card */}
            <div className="rounded-card border border-navy-600 bg-navy-700 p-6">
              <div className="mb-4 h-1 w-12 rounded bg-gold-500" />
              <h3 className="text-heading-3 text-white">Sample Card</h3>
              <p className="mt-2 text-sm text-slate-300">
                Card with <code className="text-gold-300">bg-navy-700</code>,{" "}
                <code className="text-gold-300">rounded-card</code> border
                radius, <code className="text-gold-300">border-navy-600</code>{" "}
                border, and a gold accent bar.
              </p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-teal-400 hover:text-teal-500"
              >
                Learn more &rarr;
              </a>
            </div>

            {/* Alternate card */}
            <div className="rounded-card border border-navy-600 bg-navy-900 p-6">
              <div className="mb-4 h-1 w-12 rounded bg-teal-500" />
              <h3 className="text-heading-3 text-white">Alternate Card</h3>
              <p className="mt-2 text-sm text-slate-300">
                Same structure with{" "}
                <code className="text-gold-300">bg-navy-900</code> background
                and a teal accent bar for variety.
              </p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-gold-400 hover:text-gold-500"
              >
                View details &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────
            4. Button Styles
        ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-heading-1 text-white">Button Styles</h2>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Primary */}
            <button
              type="button"
              className="rounded-card bg-gold-500 px-6 py-3 font-heading text-sm font-bold text-navy-900 transition-colors hover:bg-gold-400"
            >
              Primary Button
            </button>

            {/* Secondary */}
            <button
              type="button"
              className="rounded-card bg-teal-500 px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-teal-400"
            >
              Secondary Button
            </button>

            {/* Outline */}
            <button
              type="button"
              className="rounded-card border-2 border-gold-500 bg-transparent px-6 py-3 font-heading text-sm font-bold text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-900"
            >
              Outline Button
            </button>
          </div>
        </section>

        {/* ────────────────────────────────────────────
            5. Text Hierarchy
        ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-heading-1 text-white">Text Hierarchy</h2>

          <div className="mt-8 space-y-4 rounded-card border border-navy-600 bg-navy-700 p-6">
            <p className="text-lg font-semibold text-white">
              text-white — Primary headings and emphasis
            </p>
            <p className="text-base text-slate-300">
              text-slate-300 — Body text and descriptions
            </p>
            <p className="text-sm text-slate-400">
              text-slate-400 — Secondary text and captions
            </p>
            <p className="text-xs text-slate-500">
              text-slate-500 — Muted text, timestamps, and metadata
            </p>
          </div>
        </section>

        {/* Footer note */}
        <footer className="border-t border-navy-600 pt-8 text-sm text-slate-500">
          This page is a development reference for the SWMRHA design system. It
          is not part of the public site navigation.
        </footer>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────
   Helper components (co-located, not exported)
────────────────────────────────────────────────── */

function ColorSwatch({
  name,
  hex,
  className,
  dark = false,
}: {
  name: string;
  hex: string;
  className: string;
  dark?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-navy-600">
      <div className={`${className} h-20`} />
      <div className="bg-navy-900 px-3 py-2">
        <p className={`text-sm font-medium ${dark ? "text-white" : "text-white"}`}>
          {name}
        </p>
        <p className="font-mono text-xs text-slate-400">{hex}</p>
      </div>
    </div>
  );
}

function TypographySample({
  label,
  specs,
  className,
  children,
}: {
  label: string;
  specs: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-navy-600 pb-6">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gold-500">
        {label}
      </p>
      <p className={`${className} text-white`}>{children}</p>
      <p className="mt-2 font-mono text-xs text-slate-500">{specs}</p>
    </div>
  );
}
