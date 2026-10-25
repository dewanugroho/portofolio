import data from '../data/content.js'

// Item dengan verified:false tampil hanya setelah dikonfirmasi pemilik portofolio.
function verifiedItems(group) {
  const pending = (group.itemsUnverified || []).filter((i) => i.verified).map((i) => i.name)
  return [...(group.items || []), ...pending]
}

export default function Skills() {
  const { skills } = data

  return (
    <section
      id="skills"
      className="py-16 px-6 border-b border-rule"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-content mx-auto space-y-6">
        <h2 id="skills-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          {data.ui.sections.skills}
        </h2>
        <dl className="space-y-4">
          {skills.map((group) => (
            <div key={group.group} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <dt className="font-mono text-xs text-muted sm:text-right">{group.group}</dt>
              <dd className="text-ink text-sm sm:text-right sm:border-l sm:border-rule sm:pl-4">
                {(() => {
                  const items = verifiedItems(group)
                  return items.length > 0 ? items.join(', ') : null
                })()}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
