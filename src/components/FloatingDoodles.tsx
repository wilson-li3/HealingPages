/**
 * Hand-drawn SVG doodles that float around a section.
 * Pass a color and which shapes to include.
 */

const SHAPES = {
  star: (
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </>
  ),
  circle: (
    <circle cx="12" cy="12" r="4" />
  ),
};

type ShapeName = keyof typeof SHAPES;

interface Doodle {
  shape: ShapeName;
  x: string;     // CSS left %
  y: string;     // CSS top %
  size: number;  // px
  delay: number; // animation delay in s
  duration: number;
  rotation: number;
  opacity: number;
}

interface Props {
  doodles: Doodle[];
  color?: string;
}

export default function FloatingDoodles({ doodles, color = 'currentColor' }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {doodles.map((d, i) => (
        <svg
          key={i}
          width={d.size}
          height={d.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute"
          style={{
            left: d.x,
            top: d.y,
            opacity: d.opacity,
            transform: `rotate(${d.rotation}deg)`,
            animation: `doodleFloat ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        >
          {SHAPES[d.shape]}
        </svg>
      ))}
    </div>
  );
}

// Pre-built doodle layouts for different sections
export const IMPACT_DOODLES: Doodle[] = [
  { shape: 'star', x: '5%', y: '15%', size: 24, delay: 0, duration: 6, rotation: 15, opacity: 0.12 },
  { shape: 'book', x: '92%', y: '20%', size: 28, delay: 1.5, duration: 7, rotation: -10, opacity: 0.1 },
  { shape: 'sparkle', x: '88%', y: '75%', size: 20, delay: 0.8, duration: 5, rotation: 30, opacity: 0.1 },
  { shape: 'heart', x: '8%', y: '80%', size: 18, delay: 2, duration: 8, rotation: -20, opacity: 0.08 },
  { shape: 'circle', x: '15%', y: '50%', size: 12, delay: 3, duration: 9, rotation: 0, opacity: 0.06 },
];

export const MEDICAL_DOODLES: Doodle[] = [
  { shape: 'sparkle', x: '4%', y: '25%', size: 22, delay: 0.5, duration: 7, rotation: 20, opacity: 0.1 },
  { shape: 'circle', x: '93%', y: '60%', size: 14, delay: 1, duration: 6, rotation: 0, opacity: 0.08 },
  { shape: 'star', x: '90%', y: '15%', size: 18, delay: 2, duration: 8, rotation: -15, opacity: 0.08 },
  { shape: 'book', x: '6%', y: '75%', size: 26, delay: 0, duration: 9, rotation: 12, opacity: 0.07 },
];

export const ABOUT_DOODLES: Doodle[] = [
  { shape: 'heart', x: '90%', y: '20%', size: 22, delay: 0, duration: 7, rotation: 15, opacity: 0.1 },
  { shape: 'star', x: '5%', y: '85%', size: 20, delay: 1.5, duration: 6, rotation: -25, opacity: 0.08 },
  { shape: 'book', x: '92%', y: '78%', size: 24, delay: 2.5, duration: 8, rotation: 8, opacity: 0.07 },
];

export const PARTNERS_DOODLES: Doodle[] = [
  { shape: 'sparkle', x: '6%', y: '30%', size: 20, delay: 0, duration: 6, rotation: 10, opacity: 0.1 },
  { shape: 'heart', x: '92%', y: '40%', size: 18, delay: 1, duration: 7, rotation: -20, opacity: 0.08 },
  { shape: 'star', x: '88%', y: '80%', size: 16, delay: 2, duration: 8, rotation: 30, opacity: 0.06 },
  { shape: 'circle', x: '10%', y: '70%', size: 12, delay: 0.5, duration: 9, rotation: 0, opacity: 0.07 },
];

export const ACK_DOODLES: Doodle[] = [
  { shape: 'heart', x: '5%', y: '20%', size: 24, delay: 0, duration: 7, rotation: -10, opacity: 0.12 },
  { shape: 'star', x: '93%', y: '25%', size: 20, delay: 1, duration: 6, rotation: 20, opacity: 0.08 },
  { shape: 'sparkle', x: '8%', y: '65%', size: 18, delay: 2, duration: 8, rotation: 15, opacity: 0.07 },
  { shape: 'book', x: '90%', y: '70%', size: 22, delay: 0.5, duration: 9, rotation: -12, opacity: 0.08 },
];

export const DONATE_DOODLES: Doodle[] = [
  { shape: 'book', x: '5%', y: '18%', size: 26, delay: 0, duration: 7, rotation: -12, opacity: 0.12 },
  { shape: 'heart', x: '92%', y: '22%', size: 20, delay: 1.2, duration: 6, rotation: 18, opacity: 0.1 },
  { shape: 'star', x: '88%', y: '72%', size: 22, delay: 0.5, duration: 8, rotation: -20, opacity: 0.08 },
  { shape: 'sparkle', x: '7%', y: '78%', size: 18, delay: 2, duration: 9, rotation: 25, opacity: 0.07 },
  { shape: 'circle', x: '50%', y: '90%', size: 12, delay: 3, duration: 7, rotation: 0, opacity: 0.06 },
];
