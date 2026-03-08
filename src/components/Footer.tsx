const LINKS = [
  {
    heading: 'Pages',
    items: [
      { label: 'Impact', href: '#impact' },
      { label: 'Medical Why', href: '#medical-why' },
      { label: 'About', href: '#about' },
      { label: 'Acknowledgements', href: '#acknowledgements' },
    ],
  },
  {
    heading: 'Get Involved',
    items: [
      { label: 'Donate Books', href: '#donate' },
      { label: 'Schedule Pickup', href: '#schedule' },
      { label: 'Volunteer', href: '#volunteer' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy border-t border-white/[0.06]">
      <div className="w-full" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}>
        {/* Main footer grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr]"
          style={{ gap: 'clamp(2.5rem, 5vw, 4rem)', padding: 'clamp(4rem, 8vw, 6rem) 0' }}
        >
          {/* Brand column */}
          <div>
            <a href="/" className="font-display text-white leading-none select-none" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
              Healing Pages
            </a>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs" style={{ marginTop: '1.25rem' }}>
              Prescribing literacy to children in Pittsburgh's hospitals and schools. Every book opens a door.
            </p>
            <div className="flex items-center gap-1" style={{ marginTop: '1.5rem' }}>
              <span className="inline-block w-8 h-[2px] bg-accent-yellow rounded-full" />
              <span className="inline-block w-2 h-[2px] bg-accent-yellow/50 rounded-full" />
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30" style={{ marginBottom: '1.25rem' }}>
                {col.heading}
              </h4>
              <ul className="flex flex-col" style={{ gap: '0.875rem' }}>
                {col.items.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/55 transition-colors duration-200 hover:text-white cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between" style={{ padding: '1.5rem 0', gap: '1rem' }}>
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} Healing Pages. Pittsburgh, PA.
          </p>
          <p className="text-white/25 text-xs">
            Made with care for kids who need it most.
          </p>
        </div>
      </div>
    </footer>
  );
}
