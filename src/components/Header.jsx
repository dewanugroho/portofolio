import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import data from '../data/content.js'

const THEME_KEY = 'theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* localStorage tidak tersedia */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Header() {
  const navItems = data.ui.nav
  const [theme, setTheme] = useState(getInitialTheme)
  const isDark = theme === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* abaikan */
    }
  }, [theme, isDark])

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-rule">
      <div className="max-w-content mx-auto flex items-center justify-between gap-4 px-6 h-14">
        <a href="#main-content" className="font-semibold text-lg text-ink shrink-0">
          {data.site.name}
        </a>
        <div className="flex items-center gap-2 min-w-0">
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
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="shrink-0 p-2 text-muted hover:text-ink transition-colors"
            aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            title={isDark ? 'Mode terang' : 'Mode gelap'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}
