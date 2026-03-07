import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const animatingRef = useRef(false);

  // Smooth lerp animation loop — interpolates video.currentTime toward the target
  useEffect(() => {
    const smoothness = 0.08; // lower = smoother/slower, higher = snappier

    const tick = () => {
      const video = videoRef.current;
      if (!video || !video.duration) {
        animatingRef.current = false;
        return;
      }

      const diff = targetTimeRef.current - currentTimeRef.current;

      // Stop animating when close enough
      if (Math.abs(diff) < 0.01) {
        currentTimeRef.current = targetTimeRef.current;
        video.currentTime = currentTimeRef.current;
        animatingRef.current = false;
        return;
      }

      currentTimeRef.current += diff * smoothness;
      video.currentTime = currentTimeRef.current;
      requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (!animatingRef.current) {
        animatingRef.current = true;
        requestAnimationFrame(tick);
      }
    };

    const handleScroll = () => {
      const video = videoRef.current;
      const section = sectionRef.current;
      if (!video || !section || !video.duration) return;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top / scrollable, 0), 1);

      setScrollProgress(scrolled);
      targetTimeRef.current = scrolled * video.duration;
      startAnimation();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set initial frame once video metadata is ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => {
      video.currentTime = 0;
      setIsLoaded(true);
    };
    video.addEventListener('loadedmetadata', onMeta);
    return () => video.removeEventListener('loadedmetadata', onMeta);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '400vh' }}
      aria-label="Healing Pages hero"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
        {/* Fallback background while video loads */}
        <div
          className="absolute inset-0 z-0 bg-navy"
          aria-hidden="true"
        />

        {/* Background Video */}
        <video
          ref={videoRef}
          className={`absolute inset-0 z-[1] w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10, 22, 40, 0.65) 0%, rgba(10, 22, 40, 0.55) 40%, rgba(10, 22, 40, 0.7) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle vignette for extra depth */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(10, 22, 40, 0.4) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Small top badge */}
          <div
            className={`inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-700 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide font-body">
              A Pittsburgh literacy initiative
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`font-display text-white leading-[0.9] mb-6 transition-all duration-700 delay-150 select-none ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(4.5rem, 12vw, 10rem)' }}
          >
            Healing Pages
          </h1>

          {/* Accent underline */}
          <div
            className={`mx-auto mb-8 h-1 rounded-full bg-gradient-to-r from-accent-yellow to-accent-orange transition-all duration-700 delay-300 ${
              isLoaded ? 'w-32 opacity-100' : 'w-0 opacity-0'
            }`}
          />

          {/* Subheadline */}
          <p
            className={`text-white/90 font-body font-light max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-300 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
          >
            Prescribing literacy to children in Pittsburgh's hospitals and schools
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 transition-all duration-700 delay-500 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Primary: Donate Books */}
            <a
              href="#donate"
              className="inline-flex items-center justify-center w-full sm:w-auto border border-white/30 text-base text-white/90 transition-colors duration-200 hover:bg-white hover:text-navy hover:border-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              style={{ padding: '1.25rem 3rem' }}
            >
              Donate Books
            </a>

            {/* Secondary: Schedule a Book Pickup */}
            <a
              href="#schedule"
              className="inline-flex items-center justify-center w-full sm:w-auto border border-white/30 text-base text-white/90 transition-colors duration-200 hover:bg-white hover:text-navy hover:border-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              style={{ padding: '1.25rem 3rem' }}
            >
              Schedule a Book Pickup
            </a>
          </div>
        </div>

        {/* Scroll indicator — stays visible, dims once scrolling */}
        <div
          className={`absolute bottom-8 left-1/2 z-10 flex flex-col items-center gap-3 transition-all duration-700 delay-700 ${
            isLoaded ? (scrollProgress < 0.05 ? 'opacity-80' : 'opacity-30') : 'opacity-0'
          }`}
          style={{
            transform: 'translateX(-50%)',
            animation: isLoaded && scrollProgress < 0.05 ? 'heroFloat 2s ease-in-out infinite' : 'none',
          }}
        >
          <span className="text-white/80 text-xs font-body tracking-widest uppercase">
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
          </div>
          {/* Chevron arrows */}
          <div className="flex flex-col items-center -mt-1 gap-0">
            <svg width="16" height="10" viewBox="0 0 16 10" className="text-white/50" style={{ animation: 'heroChevron 1.5s ease-in-out infinite' }}>
              <path d="M1 1l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="16" height="10" viewBox="0 0 16 10" className="text-white/30 -mt-1" style={{ animation: 'heroChevron 1.5s ease-in-out infinite 0.15s' }}>
              <path d="M1 1l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Scroll progress sidebar */}
        <div
          className={`absolute right-4 sm:right-6 z-10 flex flex-col items-center gap-2 transition-opacity duration-500 ${
            scrollProgress > 0 && scrollProgress < 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ top: '20%', height: '60%' }}
          aria-hidden="true"
        >
          {/* Track */}
          <div className="relative w-[2px] h-full rounded-full bg-white/10">
            {/* Fill */}
            <div
              className="absolute top-0 left-0 w-full rounded-full"
              style={{
                height: `${scrollProgress * 100}%`,
                background: 'linear-gradient(to bottom, var(--color-accent-yellow), var(--color-accent-orange))',
              }}
            />
            {/* Dot at current position */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-yellow shadow-[0_0_6px_var(--color-accent-yellow)]"
              style={{ top: `calc(${scrollProgress * 100}% - 4px)` }}
            />
          </div>
        </div>

        {/* Inline keyframes for hero animations */}
        <style>{`
          @keyframes heroFloat {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-8px); }
          }
          @keyframes heroChevron {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(3px); }
          }
        `}</style>
      </div>
    </section>
  );
}
