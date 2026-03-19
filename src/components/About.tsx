import { useEffect, useRef, useState } from 'react';
import FloatingDoodles, { ABOUT_DOODLES, PARTNERS_DOODLES, ACK_DOODLES } from './FloatingDoodles';
import WavyDivider from './WavyDivider';
import PolaroidWall, { ABOUT_POLAROIDS, PARTNERS_POLAROIDS, ACK_POLAROIDS } from './PolaroidWall';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const PARTNERS = [
  'UPMC Children\'s Hospital of Pittsburgh',
  'Pittsburgh Public Schools',
  'Allegheny Health Network',
  'Carnegie Library of Pittsburgh',
  'United Way of Southwestern PA',
];

const ACKNOWLEDGEMENTS = [
  'Our incredible volunteers who sort, pack, and deliver books every week',
  'Local bookstores and publishers who donate inventory',
  'Medical professionals who prescribe reading in their clinics',
  'Families who share the gift of literacy with their communities',
];

/* ── Founder ── */
export function Founder() {
  const { ref, inView } = useInView();

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-navy overflow-hidden snap-section flex items-center"
      style={{ minHeight: '100vh', padding: 'clamp(6rem, 12vw, 11rem) 0' }}
    >
      <PolaroidWall polaroids={ABOUT_POLAROIDS} />
      <FloatingDoodles doodles={ABOUT_DOODLES} color="var(--color-accent-yellow)" />
      <WavyDivider fillTop="#0A1628" fillBottom="#132238" />

      <div className="relative w-full" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}>
        <div
          className={`grid grid-cols-1 lg:grid-cols-[300px_1fr] items-start transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ gap: 'clamp(3rem, 6vw, 5rem)' }}
        >
          {/* Photo placeholder */}
          <div className="relative mx-auto lg:mx-0 w-full" style={{ maxWidth: '300px' }}>
            <div className="aspect-[3/4] rounded-2xl bg-navy-light border border-white/[0.06] overflow-hidden flex items-center justify-center">
              <div className="text-center px-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 mx-auto mb-3">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <p className="text-white/20 text-xs font-body">Your photo here</p>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-r-2 border-b-2 border-accent-yellow/20 rounded-br-2xl" aria-hidden="true" />
          </div>

          {/* Bio */}
          <div>
            <span className="text-accent-yellow text-xs font-semibold tracking-[0.2em] uppercase font-body block">
              About the Founder
            </span>
            <h2
              className="font-display text-white leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: '1.25rem', marginBottom: '1.75rem' }}
            >
              Alton Chung
            </h2>
            <div className="text-white/55 leading-relaxed font-body" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)' }}>
              <p>
                Growing up, I saw firsthand how access to books could transform a child's
                trajectory. A single story can spark curiosity, build empathy, and open doors
                that might otherwise stay closed.
              </p>
              <p style={{ marginTop: '1.25rem' }}>
                I started Healing Pages because I believe every child deserves
                that spark — whether they're in a hospital bed, a classroom, or at home.
                What began as collecting books from neighbors has grown into a city-wide
                initiative partnering with hospitals and schools across the region.
              </p>
              <p className="text-white/70 italic" style={{ marginTop: '1.25rem' }}>
                "A book in a child's hands isn't just pages — it's possibility."
              </p>
            </div>
            <div className="flex items-center gap-1.5" style={{ marginTop: '2rem' }}>
              <span className="inline-block w-10 h-[2px] bg-accent-yellow rounded-full" />
              <span className="inline-block w-2 h-[2px] bg-accent-yellow/40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Partners ── */
export function Partners() {
  const { ref, inView } = useInView();

  return (
    <section
      id="partners"
      ref={ref}
      className="relative bg-navy-light overflow-hidden snap-section flex items-center"
      style={{ minHeight: '100vh', padding: 'clamp(6rem, 12vw, 11rem) 0' }}
    >
      <PolaroidWall polaroids={PARTNERS_POLAROIDS} />
      <FloatingDoodles doodles={PARTNERS_DOODLES} color="var(--color-medical-blue)" />

      <div
        className={`relative w-full transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}
      >
        <div className="text-center" style={{ marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <span className="text-medical-blue text-xs font-semibold tracking-[0.2em] uppercase font-body block">
            Current Partners
          </span>
          <h3
            className="font-display text-white leading-[0.95]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1.25rem' }}
          >
            Building literacy together
          </h3>
        </div>

        <div className="flex flex-wrap justify-center" style={{ gap: 'clamp(0.75rem, 1.5vw, 1.25rem)' }}>
          {PARTNERS.map((partner) => (
            <div
              key={partner}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/50 text-sm font-body font-medium card-playful transition-colors duration-200 hover:border-medical-blue/30 hover:text-white/70 cursor-default"
              style={{ padding: '1rem 1.75rem' }}
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Acknowledgements (includes footer at bottom) ── */

const FOOTER_LINKS = [
  {
    heading: 'Pages',
    items: [
      { label: 'Impact', href: '#impact' },
      { label: 'Medical Why', href: '#medical-why' },
      { label: 'About', href: '#about' },
      { label: 'Partners', href: '#partners' },
      { label: 'Acknowledgements', href: '#acknowledgements' },
    ],
  },
  {
    heading: 'Get Involved',
    items: [
      { label: 'Donate Books', href: '#donate' },
      { label: 'Schedule Pickup', href: '#schedule' },
      { label: 'Volunteer', href: '#volunteer' },
    ],
  },
];

export function Acknowledgements() {
  const { ref, inView } = useInView();

  return (
    <section
      id="acknowledgements"
      ref={ref}
      className="relative bg-navy overflow-hidden snap-section flex flex-col justify-between"
      style={{ minHeight: '100vh' }}
    >
      <PolaroidWall polaroids={ACK_POLAROIDS} />
      <FloatingDoodles doodles={ACK_DOODLES} color="var(--color-accent-orange)" />

      {/* Acknowledgements content */}
      <div
        className={`relative w-full flex-1 flex items-center transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ padding: 'clamp(4rem, 8vw, 6rem) 0' }}
      >
        <div className="w-full" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}>
          <div className="text-center" style={{ marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
            <span className="text-accent-orange text-xs font-semibold tracking-[0.2em] uppercase font-body block">
              Thank You
            </span>
            <h3
              className="font-display text-white leading-[0.95]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1.25rem' }}
            >
              We couldn't do this alone
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mx-auto" style={{ gap: 'clamp(1rem, 2vw, 1.5rem)', maxWidth: '880px' }}>
            {ACKNOWLEDGEMENTS.map((item, i) => (
              <div
                key={i}
                className="flex items-start rounded-2xl border border-white/[0.04] bg-white/[0.015] card-playful"
                style={{ gap: '1.25rem', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
              >
                <div className="shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-orange/60">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <p className="text-white/50 text-sm leading-relaxed font-body">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer pinned to bottom */}
      <footer className="border-t border-white/[0.06]">
        <div className="w-full" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}>
          <div
            className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr]"
            style={{ gap: 'clamp(2rem, 4vw, 3rem)', padding: 'clamp(2.5rem, 5vw, 3.5rem) 0' }}
          >
            <div>
              <a href="/" className="font-display text-white leading-none select-none" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
                Healing Pages
              </a>
              <p className="text-white/40 text-xs leading-relaxed max-w-xs" style={{ marginTop: '0.75rem' }}>
                Prescribing literacy to children in Pittsburgh & Philadelphia's hospitals and schools.
              </p>
            </div>
            {FOOTER_LINKS.map((col) => (
              <div key={col.heading}>
                <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30" style={{ marginBottom: '1rem' }}>
                  {col.heading}
                </h4>
                <ul className="flex flex-col" style={{ gap: '0.625rem' }}>
                  {col.items.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-xs text-white/45 transition-colors duration-200 hover:text-white cursor-pointer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between" style={{ padding: '1rem 0', gap: '0.5rem' }}>
            <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Healing Pages. Pittsburgh & Philadelphia, PA.</p>
            <p className="text-white/20 text-xs">Made with care for kids who need it most.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
