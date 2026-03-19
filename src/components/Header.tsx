import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Impact', href: '#impact' },
  { label: 'Medical Why', href: '#medical-why' },
  { label: 'About', href: '#about' },
  { label: 'Acknowledgements', href: '#acknowledgements' },
];

// Section IDs in scroll order — used by the IntersectionObserver
const SECTION_IDS = ['acknowledgements', 'donate', 'partners', 'about', 'medical-why', 'impact'];

// Map section IDs to their nav href
function sectionToHref(id: string): string {
  // partners and donate don't have their own nav links, roll up to about
  if (id === 'partners' || id === 'donate') return '#about';
  return `#${id}`;
}

function smoothScrollTo(href: string) {
  if (href === '/') {
    // Disable snap, scroll to top, re-enable snap
    document.documentElement.style.scrollSnapType = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const restore = () => {
      document.documentElement.style.scrollSnapType = '';
      window.removeEventListener('scrollend', restore);
    };
    window.addEventListener('scrollend', restore, { once: true });
    // Fallback in case scrollend doesn't fire
    setTimeout(() => { document.documentElement.style.scrollSnapType = ''; }, 1200);
    return;
  }

  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (!el) return;

  // Temporarily disable scroll-snap so smooth scrolling works
  document.documentElement.style.scrollSnapType = 'none';
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const restore = () => {
    document.documentElement.style.scrollSnapType = '';
    window.removeEventListener('scrollend', restore);
  };
  window.addEventListener('scrollend', restore, { once: true });
  // Fallback timeout
  setTimeout(() => { document.documentElement.style.scrollSnapType = ''; }, 1200);
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('/');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      // If near top, it's Home
      if (window.scrollY < window.innerHeight * 0.5) {
        setActive('/');
        return;
      }

      // Find the first section whose top is above the middle of the viewport
      const mid = window.innerHeight * 0.5;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom > 0) {
          setActive(sectionToHref(id));
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'bg-navy/70' : 'bg-navy/40'
      }`}
    >
      {/* Warm gradient bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-yellow/30 to-transparent" />

      <div style={{ paddingLeft: 'clamp(2rem, 5vw, 5rem)', paddingRight: 'clamp(2rem, 5vw, 5rem)' }}>
        <div className="relative flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo — left */}
          <a href="/" onClick={(e) => { e.preventDefault(); smoothScrollTo('/'); }} className="relative z-10 group font-display text-white text-3xl leading-none select-none transition-opacity duration-200 hover:opacity-80 cursor-pointer">
            Healing Pages
            {/* Hand-drawn underline accent */}
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2 text-accent-yellow/60"
              viewBox="0 0 120 8"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 5.5C20 2.5 40 6 60 3.5C80 1 100 5.5 118 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-opacity duration-200"
              />
            </svg>
          </a>

          {/* Nav links — true center */}
          <nav className="hidden md:flex items-center gap-8 absolute inset-0 justify-center pointer-events-none">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); smoothScrollTo(link.href); }}
                className={`pointer-events-auto relative text-sm transition-colors duration-200 py-1 cursor-pointer ${
                  active === link.href
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                } group`}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] rounded-full bg-accent-yellow transition-all duration-300 ease-out ${
                    active === link.href
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* CTA — right */}
          <a
            href="#donate"
            onClick={(e) => { e.preventDefault(); smoothScrollTo('#donate'); }}
            className="relative z-10 hidden md:inline-flex items-center text-sm text-white/90 border border-white/30 transition-colors duration-200 hover:bg-white hover:text-navy hover:border-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            style={{ padding: '0.75rem 2rem' }}
          >
            Donate Books
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden ml-auto relative w-10 h-10 flex items-center justify-center text-white"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                  mobileOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-6 pb-6 pt-2 bg-navy/95 backdrop-blur-xl border-t border-white/[0.06] flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); setMobileOpen(false); smoothScrollTo(link.href); }}
              className={`px-4 py-3 text-sm rounded-lg transition-colors duration-200 cursor-pointer ${
                active === link.href
                  ? 'text-white bg-accent-yellow/10'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {active === link.href && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-yellow mr-2 -translate-y-px" />
              )}
              {link.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={(e) => { e.preventDefault(); setMobileOpen(false); smoothScrollTo('#donate'); }}
            className="mt-2 text-sm text-center text-white/90 border border-white/30 transition-colors duration-200 hover:bg-white hover:text-navy hover:border-white"
            style={{ padding: '0.75rem 2rem' }}
          >
            Donate Books
          </a>
        </nav>
      </div>
    </header>
  );
}
