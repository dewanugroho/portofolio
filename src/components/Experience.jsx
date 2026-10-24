import data from '../data/portfolio.json'

export default function Experience() {
  const { experience } = data

  return (
    <section id="experience" className="py-16 px-6 border-b border-rule" aria-labelledby="experience-heading">
      <div className="max-w-content mx-auto space-y-6">
        <h2 id="experience-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          Pengalaman
        </h2>
        <dl className="space-y-8">
          {experience.map((exp) => (
            <div key={`${exp.period}-${exp.role}`} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <dt className="font-mono text-xs text-muted sm:text-right">{exp.period}</dt>
              <dd className="space-y-2">
                <p className="text-sm text-ink" style={{ fontWeight: 600 }}>
                  {exp.role}
                </p>
                <p className="text-sm text-muted">{exp.organization}</p>
                <p className="text-sm text-muted leading-relaxed">{exp.description}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
