import { GithubIcon, LinkedinIcon } from './icons.jsx'
import data from '../data/portfolio.json'

export default function Contact() {
  const { site } = data
  const hasGithub = Boolean(site.github)
  const hasLinkedin = Boolean(site.linkedin)
  const hasEmail = Boolean(site.email)

  return (
    <section id="contact" className="py-16 px-6 border-b border-rule" aria-labelledby="contact-heading">
      <div className="max-w-content mx-auto space-y-6">
        <h2 id="contact-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          Kontak
        </h2>
        <p className="text-sm text-muted">
          Tersedia untuk diskusi singkat.
        </p>
        <div className="flex items-center gap-4">
          {hasEmail && (
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
    </section>
  )
}
