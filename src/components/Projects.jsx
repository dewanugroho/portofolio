import { ExternalLink } from 'lucide-react'
import data from '../data/content.js'

function Screenshot({ project }) {
  const { screenshot, screenshotAlt, screenshotWidth, screenshotHeight, title } = project

  if (!screenshot) return null

  // Placeholder konten yang belum diisi — ditampilkan apa adanya agar mudah ditemukan.
  if (screenshot.startsWith('[ISI:')) {
    return (
      <p className="mt-4 text-sm text-muted border border-dashed border-rule rounded-token px-4 py-3">
        {screenshot}
      </p>
    )
  }

  return (
    <img
      src={screenshot}
      alt={screenshotAlt || `Tampilan ${title}`}
      loading="lazy"
      width={screenshotWidth || 1200}
      height={screenshotHeight || 1000}
      className="mt-4 w-full h-auto border border-rule"
      style={{ borderRadius: '6px' }}
    />
  )
}

export default function Projects() {
  const { projects, ui } = data

  return (
    <section id="projects" className="py-16 px-6 border-b border-rule" aria-labelledby="projects-heading">
      <div className="max-w-content mx-auto space-y-12">
        <h2 id="projects-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          {ui.sections.projects}
        </h2>

        {projects.map((project, index) => {
          const isFirst = index === 0
          const hasDemo = Boolean(project.demo)
          const hasResults = project.results && project.results.length > 0

          return (
            <article key={project.id} className="flex items-start gap-4">
              <span className="font-mono text-sm text-muted mt-1">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 space-y-3">
                <h3
                  className={`text-ink ${isFirst ? 'text-2xl' : 'text-xl'}`}
                  style={{ fontWeight: 600 }}
                >
                  {project.title}
                </h3>

                <p className="text-muted text-sm leading-relaxed">{project.context}</p>

                {project.role && (
                  <p className="text-sm text-ink">
                    <span className="font-mono text-xs text-muted uppercase tracking-wider mr-2">
                      {ui.projects.roleLabel}
                    </span>
                    {project.role}
                  </p>
                )}

                {project.tech && project.tech.length > 0 && (
                  <p className="font-mono text-xs text-muted">{project.tech.join(' · ')}</p>
                )}

                {hasResults && (
                  <div className="space-y-1 pt-1">
                    <p className="font-mono text-xs text-muted uppercase tracking-wider">
                      {ui.projects.resultsLabel}
                    </p>
                    <ul className="space-y-1">
                      {project.results.map((result, i) => (
                        <li key={i} className="text-sm text-muted flex gap-2">
                          <span aria-hidden="true" className="text-accent">→</span>
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-1">
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
                    >
                      {ui.projects.code} <ExternalLink size={14} />
                    </a>
                  )}
                  {hasDemo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
                    >
                      {ui.projects.demo} <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <Screenshot project={project} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
