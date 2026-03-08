import { useEffect, useRef, useState } from 'react';

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

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="relative bg-navy overflow-hidden" style={{ padding: 'clamp(6rem, 12vw, 11rem) 0' }}>
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative w-full" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}>

        {/* ── Founder Section ── */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-[300px_1fr] items-start transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ gap: 'clamp(3rem, 6vw, 5rem)', marginBottom: 'clamp(6rem, 12vw, 10rem)' }}
        >
          {/* Photo placeholder */}
          <div className="relative mx-auto lg:mx-0 w-full" style={{ maxWidth: '300px' }}>
            <div className="aspect-[3/4] rounded-2xl bg-navy-light border border-white/[0.06] overflow-hidden flex items-center justify-center">
              {/* Replace with <img src="/founder.jpg" alt="Wilson Li, founder of Healing Pages" className="w-full h-full object-cover" /> */}
              <div className="text-center px-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 mx-auto mb-3">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <p className="text-white/20 text-xs font-body">Your photo here</p>
              </div>
            </div>
            {/* Decorative corner accent */}
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
              Wilson Li
            </h2>
            <div className="text-white/55 leading-relaxed font-body" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)' }}>
              <p>
                Growing up, I saw firsthand how access to books could transform a child's
                trajectory. A single story can spark curiosity, build empathy, and open doors
                that might otherwise stay closed.
              </p>
              <p style={{ marginTop: '1.25rem' }}>
                I started Healing Pages because I believe every child in Pittsburgh deserves
                that spark — whether they're in a hospital bed, a classroom, or at home.
                What began as collecting books from neighbors has grown into a city-wide
                initiative partnering with hospitals and schools across the region.
              </p>
              <p className="text-white/70 italic" style={{ marginTop: '1.25rem' }}>
                "A book in a child's hands isn't just pages — it's possibility."
              </p>
            </div>
            {/* Decorative line */}
            <div className="flex items-center gap-1.5" style={{ marginTop: '2rem' }}>
              <span className="inline-block w-10 h-[2px] bg-accent-yellow rounded-full" />
              <span className="inline-block w-2 h-[2px] bg-accent-yellow/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* ── Partners ── */}
        <div
          className={`transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ marginBottom: 'clamp(6rem, 12vw, 10rem)' }}
        >
          <div className="text-center" style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
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
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/50 text-sm font-body font-medium transition-colors duration-200 hover:border-medical-blue/30 hover:text-white/70 cursor-default"
                style={{ padding: '1rem 1.75rem' }}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* ── Acknowledgements ── */}
        <div
          id="acknowledgements"
          className={`transition-all duration-700 delay-300 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center" style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
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
                className="flex items-start rounded-2xl border border-white/[0.04] bg-white/[0.015]"
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
    </section>
  );
}
