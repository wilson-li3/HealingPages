import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-700 delay-500 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Primary: Donate Books */}
            <a
              href="#donate"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-medical-blue rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-8px_rgba(66,165,245,0.5)] active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-medical-blue-light/50 w-full sm:w-auto shadow-lg shadow-medical-blue/30"
            >
              {/* Shine sweep on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
              {/* Pulse ring on hover */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping bg-medical-blue-light/30 pointer-events-none" aria-hidden="true" />
              <svg
                className="w-5 h-5 mr-2.5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-[-8deg] group-active:scale-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="relative transition-transform duration-300 group-hover:tracking-wider">Donate Books</span>
              {/* Arrow that slides in on hover */}
              <svg
                className="w-0 overflow-hidden opacity-0 group-hover:w-5 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            {/* Secondary: Schedule a Book Pickup */}
            <a
              href="#schedule"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-navy bg-accent-yellow rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-8px_rgba(255,179,0,0.5)] active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-yellow/50 w-full sm:w-auto shadow-lg shadow-accent-yellow/30"
            >
              {/* Shine sweep on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden="true" />
              {/* Pulse ring on hover */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping bg-accent-orange/20 pointer-events-none" aria-hidden="true" />
              <svg
                className="w-5 h-5 mr-2.5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-active:scale-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="relative transition-transform duration-300 group-hover:tracking-wider">Schedule a Book Pickup</span>
              {/* Arrow that slides in on hover */}
              <svg
                className="w-0 overflow-hidden opacity-0 group-hover:w-5 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
            isLoaded ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <span className="text-white/70 text-xs font-body tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
