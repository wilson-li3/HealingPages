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
      <div className="px-6 md:px-16 lg:px-24">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12 md:gap-16 py-16 md:py-20">
          {/* Brand column */}
          <div>
            <a href="/" className="font-display text-white text-4xl md:text-5xl leading-none select-none">
              Healing Pages
            </a>
            <p className="mt-5 text-white/40 text-sm leading-relaxed max-w-xs">
              Prescribing literacy to children in Pittsburgh's hospitals and schools. Every book opens a door.
            </p>
            <div className="mt-6 flex items-center gap-1">
              <span className="inline-block w-8 h-[2px] bg-accent-yellow rounded-full" />
              <span className="inline-block w-2 h-[2px] bg-accent-yellow/50 rounded-full" />
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.items.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
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
        <div className="border-t border-white/[0.06] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
