import { useEffect, useRef, useState } from 'react';

export interface Polaroid {
  x: string;        // CSS left %
  y: string;        // CSS top %
  rotation: number;  // degrees
  caption: string;
  illustration: 'reading' | 'bookshelf' | 'storytime' | 'stacking' | 'sharing';
  width: number;     // px
  image_url?: string; // Supabase Storage URL — if present, renders <img> instead of illustration
}

// Simple line-art illustrations for placeholders
// Replace the <div> inside each polaroid with <img src="..." /> when you have real photos
function Illustration({ type, w }: { type: Polaroid['illustration']; w: number }) {
  const h = w * 0.85;
  return (
    <svg width={w} height={h} viewBox="0 0 100 85" fill="none" className="text-navy/20">
      {type === 'reading' && (
        <>
          {/* Kid sitting and reading */}
          <circle cx="50" cy="28" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 38v20" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 48l-15 10M50 48l15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M35 45h-5v15h20v-15h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 45v15" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </>
      )}
      {type === 'bookshelf' && (
        <>
          {/* Bookshelf with books */}
          <rect x="20" y="15" width="60" height="60" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="55" x2="80" y2="55" stroke="currentColor" strokeWidth="1.5" />
          {/* Books on shelves */}
          <rect x="25" y="18" width="6" height="15" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="33" y="20" width="5" height="13" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="40" y="17" width="7" height="16" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="50" y="19" width="5" height="14" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="57" y="18" width="8" height="15" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="26" y="38" width="7" height="15" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="35" y="40" width="5" height="13" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="43" y="37" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="52" y="39" width="8" height="14" rx="1" stroke="currentColor" strokeWidth="1" />
        </>
      )}
      {type === 'storytime' && (
        <>
          {/* Adult reading to kids */}
          <circle cx="35" cy="25" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M35 33v18" stroke="currentColor" strokeWidth="1.5" />
          <path d="M35 40l-12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M35 40l10-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Book in hand */}
          <rect x="43" y="34" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <line x1="49" y1="34" x2="49" y2="42" stroke="currentColor" strokeWidth="0.8" />
          {/* Small kid */}
          <circle cx="65" cy="42" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M65 48v12" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="75" cy="45" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M75 50v10" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
      {type === 'stacking' && (
        <>
          {/* Stack of books */}
          <rect x="30" y="55" width="40" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(-2 50 58)" />
          <rect x="32" y="47" width="38" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(1 50 50)" />
          <rect x="28" y="39" width="42" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(-1.5 50 42)" />
          <rect x="31" y="31" width="36" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(2 50 34)" />
          <rect x="33" y="23" width="34" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(-0.5 50 26)" />
          {/* Little star on top */}
          <path d="M50 15l2 5h5l-4 3 1.5 5L50 25l-4.5 3 1.5-5-4-3h5z" stroke="currentColor" strokeWidth="1" fill="none" />
        </>
      )}
      {type === 'sharing' && (
        <>
          {/* Two kids sharing a book */}
          <circle cx="38" cy="30" r="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="62" cy="30" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M38 37v16M62 37v16" stroke="currentColor" strokeWidth="1.5" />
          <path d="M38 44l10 2M62 44l-10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Shared book */}
          <rect x="42" y="42" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="50" y1="42" x2="50" y2="52" stroke="currentColor" strokeWidth="0.8" />
          {/* Hearts */}
          <path d="M48 35c-1-2-4-2-4 0s4 4 4 4 4-2 4-4-3-2-4 0z" stroke="currentColor" strokeWidth="0.8" fill="none" />
        </>
      )}
    </svg>
  );
}

// Tape strip SVG
function Tape({ color = '#FFB300' }: { color?: string }) {
  return (
    <svg
      width="40"
      height="14"
      viewBox="0 0 40 14"
      fill="none"
      className="absolute -top-2 left-1/2 -translate-x-1/2"
      style={{ opacity: 0.6 }}
    >
      <rect x="1" y="2" width="38" height="10" rx="1" fill={color} opacity="0.35" />
      <rect x="1" y="2" width="38" height="10" rx="1" stroke={color} strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

interface Props {
  polaroids: Polaroid[];
  parallaxSpeed?: number; // 0 = no parallax, 0.5 = half speed, etc
}

export default function PolaroidWall({ polaroids, parallaxSpeed = 0.35 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const sectionMid = rect.top + rect.height / 2;
      const viewMid = window.innerHeight / 2;
      setOffset((sectionMid - viewMid) * parallaxSpeed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxSpeed]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        style={{ transform: `translateY(${offset}px)`, willChange: 'transform' }}
        className="absolute inset-0"
      >
        {polaroids.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              transform: `rotate(${p.rotation}deg)`,
              width: p.width,
            }}
          >
            {/* Polaroid frame */}
            <div
              className="relative bg-white/[0.04] border border-white/[0.08] backdrop-blur-[2px]"
              style={{
                padding: `${p.width * 0.06}px ${p.width * 0.06}px ${p.width * 0.18}px`,
                borderRadius: '3px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              <Tape />
              {/* Photo area */}
              <div
                className="bg-navy/30 overflow-hidden flex items-center justify-center"
                style={{
                  aspectRatio: '1 / 0.85',
                  borderRadius: '1px',
                }}
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Illustration type={p.illustration} w={p.width * 0.8} />
                )}
              </div>
              {/* Caption */}
              <p
                className="font-display text-white/30 text-center leading-tight mt-1"
                style={{ fontSize: `${Math.max(p.width * 0.09, 10)}px` }}
              >
                {p.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pre-built layouts per section — spread across full area including behind content
export const IMPACT_POLAROIDS: Polaroid[] = [
  { x: '-2%', y: '5%', rotation: -8, caption: 'Book drive day!', illustration: 'stacking', width: 190 },
  { x: '75%', y: '3%', rotation: 5, caption: 'So many stories', illustration: 'bookshelf', width: 180 },
  { x: '35%', y: '65%', rotation: -3, caption: 'Reading buddies', illustration: 'sharing', width: 170 },
  { x: '78%', y: '58%', rotation: 6, caption: 'Storytime!', illustration: 'storytime', width: 175 },
  { x: '8%', y: '55%', rotation: 4, caption: 'New friends', illustration: 'reading', width: 160 },
];

export const MEDICAL_POLAROIDS: Polaroid[] = [
  { x: '-3%', y: '8%', rotation: 5, caption: 'Hospital visit', illustration: 'reading', width: 185 },
  { x: '42%', y: '2%', rotation: -4, caption: 'Healthy minds', illustration: 'stacking', width: 170 },
  { x: '78%', y: '50%', rotation: -6, caption: 'Dr. Books!', illustration: 'storytime', width: 180 },
  { x: '20%', y: '60%', rotation: 3, caption: 'Check-up day', illustration: 'bookshelf', width: 165 },
];

export const ABOUT_POLAROIDS: Polaroid[] = [
  { x: '72%', y: '5%', rotation: -5, caption: 'Where it started', illustration: 'stacking', width: 185 },
  { x: '-2%', y: '55%', rotation: 4, caption: 'First delivery', illustration: 'sharing', width: 175 },
  { x: '55%', y: '60%', rotation: -3, caption: 'Growing up', illustration: 'reading', width: 165 },
];

export const PARTNERS_POLAROIDS: Polaroid[] = [
  { x: '-2%', y: '5%', rotation: 5, caption: 'Team work!', illustration: 'storytime', width: 180 },
  { x: '76%', y: '8%', rotation: -4, caption: 'Book sorting day', illustration: 'stacking', width: 175 },
  { x: '40%', y: '58%', rotation: 3, caption: 'At the library', illustration: 'bookshelf', width: 185 },
  { x: '5%', y: '55%', rotation: -6, caption: 'Together', illustration: 'sharing', width: 165 },
  { x: '72%', y: '55%', rotation: 5, caption: 'Making a difference', illustration: 'reading', width: 170 },
];

export const ACK_POLAROIDS: Polaroid[] = [
  { x: '-1%', y: '3%', rotation: -5, caption: 'Thank you!', illustration: 'sharing', width: 185 },
  { x: '75%', y: '5%', rotation: 6, caption: 'Volunteers rock', illustration: 'storytime', width: 178 },
  { x: '38%', y: '55%', rotation: -3, caption: 'With love', illustration: 'reading', width: 170 },
];

export const DONATE_POLAROIDS: Polaroid[] = [
  { x: '-2%', y: '6%', rotation: -6, caption: 'Share a story', illustration: 'sharing', width: 180 },
  { x: '76%', y: '4%', rotation: 5, caption: 'Books galore', illustration: 'stacking', width: 175 },
  { x: '42%', y: '62%', rotation: -3, caption: 'Happy readers', illustration: 'reading', width: 170 },
];
