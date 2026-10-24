import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons.jsx'
import data from '../data/portfolio.json'

export default function Hero() {
  const { site } = data
  const hasCv = Boolean(site.cv)
  const hasGithub = Boolean(site.github)
  const hasLinkedin = Boolean(site.linkedin)
  const hasEmail = Boolean(site.email)

  const primaryAction = hasCv
    ? { label: 'Unduh CV', href: site.cv, icon: null }
    : { label: 'Email saya', href: `mailto:${site.email}`, icon: hasEmail ? <Mail size={16} /> : null }

  return (
    <section className="py-16 px-6 border-b border-rule">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h1
              className="font-semibold text-ink"
              style={{
                fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {site.name}
            </h1>
            <p className="text-muted text-lg leading-relaxed">{site.role}</p>
            <p className="text-muted text-base leading-relaxed">{site.summary}</p>
            {Boolean(site.status) && <p className="text-ink text-sm">{site.status}</p>}

            <div className="flex items-center gap-6 pt-2">
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  className="inline-flex items-center gap-2 bg-accent text-surface font-medium text-sm px-6 py-3 transition-colors hover:bg-accent-strong"
                  style={{ borderRadius: '6px' }}
                >
                  {primaryAction.icon}
                  {primaryAction.label}
                </a>
              )}
              {hasEmail && !hasCv && (
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Email
                </a>
              )}
              {hasGithub && (
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-ink transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon size={16} />
                </a>
              )}
              {hasLinkedin && (
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-ink transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="flex md:flex-col md:items-end">
            <img
              src="/foto_formal.jpg"
              alt="Foto Dewa Bintang Nugroho"
              width={112}
              height={112}
              className="object-cover transition-transform"
              style={{ borderRadius: '6px' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
