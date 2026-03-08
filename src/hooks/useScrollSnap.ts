import { useEffect } from 'react';

export default function useScrollSnap(selectors: string[]) {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let isSnapping = false;

    const handleScrollEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isSnapping) return;

        const viewportH = window.innerHeight;
        let best: { el: Element; distance: number } | null = null;

        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (!el) continue;
          const rect = el.getBoundingClientRect();

          // Only consider sections whose top is within ±40% of viewport
          if (rect.top > viewportH * 0.4 || rect.top < -viewportH * 0.4) continue;

          const distance = Math.abs(rect.top);
          // Don't snap if already very close (within 10px)
          if (distance < 10) continue;

          if (!best || distance < best.distance) {
            best = { el, distance };
          }
        }

        if (best) {
          isSnapping = true;
          best.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Reset snapping flag after animation completes
          setTimeout(() => { isSnapping = false; }, 800);
        }
      }, 150); // Wait 150ms after scroll stops
    };

    window.addEventListener('scroll', handleScrollEnd, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollEnd);
      clearTimeout(timeout);
    };
  }, [selectors]);
}
