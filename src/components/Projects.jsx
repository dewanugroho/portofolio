import { ExternalLink } from 'lucide-react'
import data from '../data/portfolio.json'

export default function Projects() {
  const { projects } = data

  return (
    <section id="projects" className="py-16 px-6 border-b border-rule" aria-labelledby="projects-heading">
      <div className="max-w-content mx-auto space-y-12">
        <h2 id="projects-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          Proyek
        </h2>
        {projects.map((project, index) => {
          const isFirst = index === 0
          const hasDemo = Boolean(project.demo)
          const hasScreenshot = Boolean(project.screenshot)
          const hasHighlights = project.highlights && project.highlights.length > 0

          return (
            <div key={project.id}>
              <div className="flex items-start gap-4">
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
                  <p className="text-muted text-sm leading-relaxed">{project.summary}</p>

                  {project.tech && project.tech.length > 0 && (
                    <p className="font-mono text-xs text-muted">
                      {project.tech.join(' · ')}
                    </p>
                  )}

                  <div className="flex items-center gap-6 pt-1">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
                      >
                        Kode <ExternalLink size={14} />
                      </a>
                    )}
                    {hasDemo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
                      >
                        Demo <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  {hasHighlights && (
                    <ul className="list-none pl-0 space-y-2 pt-2">
                      {project.highlights.map((hl, i) => (
                        <li key={i} className="text-sm text-muted">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}

                  {hasScreenshot && (
                    <img
                      src={project.screenshot}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                      className="mt-4 max-w-full border border-rule"
                      style={{ borderRadius: '6px' }}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
