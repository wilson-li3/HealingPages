import { useEffect, useRef, useState } from 'react';

const EVIDENCE = [
  {
    stat: '3x',
    description: 'Children read to regularly score higher on language assessments',
  },
  {
    stat: '60%',
    description: 'of brain development occurs before age 3 — books are critical stimuli',
  },
  {
    stat: '1 in 4',
    description: 'Pittsburgh children live in book deserts with zero age-appropriate books at home',
  },
];

export default function MedicalWhy() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="medical-why"
      ref={ref}
      className="relative bg-navy-light overflow-hidden"
      style={{ padding: 'clamp(6rem, 12vw, 11rem) 0' }}
    >
      {/* Decorative blob */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, var(--color-medical-blue) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative w-full" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'clamp(3rem, 8vw, 6rem)' }}>
          {/* Left — Main message */}
          <div
            className={`transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-medical-blue/10 border border-medical-blue/20" style={{ padding: '0.625rem 1.25rem', marginBottom: '2rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-blue">
                <path d="M4.8 2.655A1.4 1.4 0 006 4v2a6 6 0 0012 0V4a1.4 1.4 0 001.2-1.345" />
                <path d="M18 12h.01" />
                <path d="M18 12a4 4 0 01-4 4h-2a4 4 0 01-4-4" />
                <circle cx="18" cy="16" r="2" />
                <path d="M18 18v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1" />
              </svg>
              <span className="text-medical-blue text-xs font-semibold tracking-[0.15em] uppercase font-body">
                The Medical Why
              </span>
            </div>

            <h2
              className="font-display text-white leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem' }}
            >
              Literacy is a Social Determinant of Health
            </h2>

            <p className="text-white/60 leading-relaxed font-body" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.125rem)', marginBottom: '1.5rem', maxWidth: '520px' }}>
              Studies show that early access to books improves cognitive development
              and long-term health outcomes. A child who is read to from birth develops
              stronger neural pathways, richer vocabularies, and better emotional regulation.
            </p>

            <p className="text-white/45 leading-relaxed font-body" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.125rem)', maxWidth: '520px' }}>
              That's why doctors are now prescribing books alongside medicine — because
              reading <span className="text-white/70 italic">is</span> medicine.
            </p>

            {/* Decorative line */}
            <div className="flex items-center gap-1.5" style={{ marginTop: '2.5rem' }}>
              <span className="inline-block w-10 h-[2px] bg-medical-blue rounded-full" />
              <span className="inline-block w-2 h-[2px] bg-medical-blue/40 rounded-full" />
            </div>
          </div>

          {/* Right — Evidence cards */}
          <div className="flex flex-col" style={{ gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
            {EVIDENCE.map((item, i) => (
              <div
                key={item.stat}
                className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-700 ${
                  inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)', transitionDelay: `${200 + i * 150}ms` }}
              >
                <div className="flex items-start" style={{ gap: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
                  <div
                    className="font-body font-bold text-medical-blue leading-none shrink-0"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}
                  >
                    {item.stat}
                  </div>
                  <p className="text-white/55 leading-relaxed font-body" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', paddingTop: '0.25rem' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
