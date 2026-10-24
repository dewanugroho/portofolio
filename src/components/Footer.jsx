import data from '../data/content.js'

export default function Footer() {
  const { site } = data

  return (
    <footer className="py-8 px-6 border-t border-rule">
      <div className="max-w-content mx-auto">
        <p className="font-mono text-xs text-muted">
          &copy; 2026 {site.name}
        </p>
        <p className="font-mono text-xs text-muted">
          {data.ui.footer.note}
        </p>
      </div>
    </footer>
  )
}
