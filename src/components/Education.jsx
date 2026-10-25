import data from '../data/content.js'

export default function Education() {
  const { education, ui } = data
  const hasEntries = education && education.length > 0

  return (
    <section
      id="education"
      className="py-16 px-6 border-b border-rule"
      aria-labelledby="education-heading"
    >
      <div className="max-w-content mx-auto space-y-6">
        <h2
          id="education-heading"
          className="font-mono text-xs uppercase tracking-wider text-muted"
        >
          {ui.sections.education}
        </h2>
        {hasEntries && (
          <dl className="space-y-8">
            {education.map((edu) => (
              <div
                key={`${edu.period}-${edu.degree}`}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                <dt className="font-mono text-xs text-muted sm:text-right">{edu.period}</dt>
                <dd className="space-y-2">
                  <p className="text-sm text-ink" style={{ fontWeight: 600 }}>
                    {edu.degree}
                  </p>
                  <p className="text-sm text-muted">{edu.institution}</p>
                  {Boolean(edu.detail) && (
                    <p className="text-sm text-muted leading-relaxed">{edu.detail}</p>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
