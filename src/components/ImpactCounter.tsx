import { useEffect, useRef, useState } from 'react';

const STATS = [
  {
    value: 500,
    label: 'Books Collected',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    value: 10,
    label: 'Read-Aloud Sessions',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    value: 10,
    label: 'Schools Impacted',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

function useInView(threshold = 0.3) {
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

function AnimatedNumber({ target, inView }: { target: number; inView: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <>{current.toLocaleString()}</>;
}

export default function ImpactCounter() {
  const { ref, inView } = useInView(0.2);

  return (
    <section
      id="impact"
      ref={ref}
      className="relative bg-navy overflow-hidden snap-section flex items-center"
      style={{ padding: 'clamp(6rem, 12vw, 11rem) 0' }}
    >
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-yellow/20 to-transparent" />

      {/* Background texture */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,179,0,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}>
        {/* Section header */}
        <div className="text-center" style={{ marginBottom: 'clamp(4rem, 8vw, 6rem)' }}>
          <span className="text-accent-yellow text-xs font-semibold tracking-[0.2em] uppercase font-body block">
            Our Impact
          </span>
          <h2
            className="font-display text-white mt-5 leading-[0.95]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Numbers that tell a story
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'clamp(1.5rem, 3vw, 2rem)' }}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`group relative text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-700 ${
                inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 3vw, 2rem)', transitionDelay: `${i * 150}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-accent-yellow/[0.04] to-transparent" />

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent-yellow/10 text-accent-yellow" style={{ marginBottom: '1.5rem' }}>
                {stat.icon}
              </div>

              {/* Number */}
              <div
                className="font-body font-bold text-white leading-none"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '0.75rem' }}
              >
                <AnimatedNumber target={stat.value} inView={inView} />
                <span className="text-accent-yellow">+</span>
              </div>

              {/* Label */}
              <p className="text-white/45 text-sm font-medium tracking-wide uppercase font-body">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
