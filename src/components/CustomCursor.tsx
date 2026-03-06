import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const scale = useRef(1);
  const targetScale = useRef(1);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.body.classList.add('custom-cursor');

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a, button, [role="button"]');
      targetScale.current = el ? 1.6 : 1;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    let raf: number;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      scale.current += (targetScale.current - scale.current) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${scale.current})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Book body */}
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#FFB300" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#FFB300" fill="rgba(255,179,0,0.15)" />
        {/* Spine line */}
        <path d="M12 2v20" stroke="#FFB300" opacity="0.4" />
      </svg>
    </div>
  );
}
