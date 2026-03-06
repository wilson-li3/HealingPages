import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Impact', href: '#impact' },
  { label: 'Medical Why', href: '#medical-why' },
  { label: 'About', href: '#about' },
  { label: 'Acknowledgements', href: '#acknowledgements' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/40 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-6 md:mx-12 lg:mx-16">
        <div className="relative flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo — left */}
          <a href="/" className="relative z-10 font-display text-white text-3xl leading-none select-none transition-opacity duration-200 hover:opacity-80">
            Healing Pages
          </a>

          {/* Nav links — true center */}
          <nav className="hidden md:flex items-center gap-8 absolute inset-0 justify-center pointer-events-none">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActive(link.href)}
                className={`pointer-events-auto text-sm transition-colors duration-200 ${
                  active === link.href
                    ? 'text-accent-yellow'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA — right */}
          <a
            href="#donate"
            className="relative z-10 hidden md:inline-flex items-center px-6 py-2.5 text-sm font-medium text-white rounded-full border border-white/20 transition-all duration-200 hover:bg-white/10 hover:border-white/30 active:scale-95"
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
              onClick={() => { setActive(link.href); setMobileOpen(false); }}
              className={`px-4 py-3 text-sm rounded-lg transition-colors duration-200 ${
                active === link.href
                  ? 'text-accent-yellow'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-3 text-sm font-medium text-center text-white rounded-full border border-white/20 transition-all duration-200 hover:bg-white/10 active:scale-95"
          >
            Donate Books
          </a>
        </nav>
      </div>
    </header>
  );
}
