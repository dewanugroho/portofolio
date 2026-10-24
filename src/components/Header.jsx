import data from '../data/portfolio.json'

const navItems = [
  { label: 'Proyek', href: '#projects' },
  { label: 'Keahlian', href: '#skills' },
  { label: 'Pengalaman', href: '#experience' },
  { label: 'Sertifikasi', href: '#certifications' },
  { label: 'Kontak', href: '#contact' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-rule">
      <div className="max-w-content mx-auto flex items-center justify-between gap-4 px-6 h-14">
        <a href="#main-content" className="font-semibold text-lg text-ink shrink-0">
          {data.site.name}
        </a>
        <nav aria-label="Navigasi utama" className="min-w-0 overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-6 whitespace-nowrap">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
