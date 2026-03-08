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
    const smoothness = 0.08;

    const tick = () => {
      const video = videoRef.current;
      if (!video || !video.duration) {
        animatingRef.current = false;
        return;
      }

      const diff = targetTimeRef.current - currentTimeRef.current;

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

  // Content fades out as user scrolls deeper
  const contentOpacity = Math.max(1 - scrollProgress * 3, 0);
  const contentTranslateY = scrollProgress * -60;

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

        {/* Warm gradient overlay — bottom-heavy for text legibility */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(170deg, rgba(10, 22, 40, 0.35) 0%, rgba(10, 22, 40, 0.5) 50%, rgba(10, 22, 40, 0.8) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Warm accent glow — subtle golden light from top-left */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              'radial-gradient(ellipse at 20% 20%, rgba(255, 179, 0, 0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        {/* Content — parallax fade on scroll */}
        <div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY}px)`,
          }}
        >
          {/* Impact stat badge */}
          <div
            className={`inline-flex items-center gap-2.5 mb-10 px-5 py-2.5 rounded-full border border-accent-yellow/25 bg-accent-yellow/10 backdrop-blur-sm transition-all duration-700 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-yellow">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            <span className="text-accent-yellow text-sm font-medium tracking-wide font-body">
              10,000+ books prescribed to Pittsburgh kids
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`font-display text-white leading-[0.9] mb-5 transition-all duration-700 delay-150 select-none ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(4.5rem, 12vw, 10rem)' }}
          >
            Healing Pages
          </h1>

          {/* Hand-drawn underline */}
          <svg
            className={`mx-auto mb-8 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            width="160"
            height="12"
            viewBox="0 0 160 12"
            fill="none"
            aria-hidden="true"
            style={{ transformOrigin: 'center' }}
          >
            <path
              d="M4 8C30 3 55 9 80 5C105 1 130 7 156 4"
              stroke="url(#underlineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="underlineGrad" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFB300" />
                <stop offset="1" stopColor="#F57C00" />
              </linearGradient>
            </defs>
          </svg>

          {/* Subheadline */}
          <p
            className={`text-white/85 font-body font-light max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-300 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
          >
            Prescribing literacy to children in Pittsburgh's hospitals and schools —{' '}
            <span className="text-white font-normal">because every child deserves a story.</span>
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 transition-all duration-700 delay-500 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Primary: Donate Books — filled, warm */}
            <a
              href="#donate"
              className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-accent-yellow text-navy font-semibold text-base cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-[0_0_30px_rgba(255,179,0,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow/50"
              style={{ padding: '1.125rem 2.75rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:scale-110">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              Donate Books
            </a>

            {/* Secondary: Schedule Pickup — ghost */}
            <a
              href="#schedule"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto border border-white/30 text-base text-white/90 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              style={{ padding: '1.125rem 2.75rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Schedule a Pickup
            </a>
          </div>
        </div>

        {/* Scroll indicator — simplified, just the mouse icon */}
        <div
          className={`absolute bottom-8 left-1/2 z-10 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
            isLoaded ? (scrollProgress < 0.05 ? 'opacity-60' : 'opacity-0') : 'opacity-0'
          }`}
          style={{
            transform: 'translateX(-50%)',
            animation: isLoaded && scrollProgress < 0.05 ? 'heroFloat 2.5s ease-in-out infinite' : 'none',
          }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/25 flex items-start justify-center p-1">
            <div className="w-1 h-1 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>

        {/* Inline keyframes for hero animations */}
        <style>{`
          @keyframes heroFloat {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-6px); }
          }
        `}</style>
      </div>
    </section>
  );
}
