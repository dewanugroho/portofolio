import { useState, useRef, useEffect, useCallback } from 'react'
import data from '../data/content.js'

export default function Certifications() {
  const { certifications, ui } = data
  const [openImage, setOpenImage] = useState(null)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  const hasCerts = certifications && certifications.length > 0

  const closeModal = useCallback(() => {
    setOpenImage(null)
  }, [])

  const openCert = (image, trigger) => {
    triggerRef.current = trigger
    setOpenImage(image)
  }

  // Saat modal terbuka: pindahkan fokus ke tombol tutup, kunci scroll,
  // trap fokus di dalam dialog, dan tutup dengan Escape.
  useEffect(() => {
    if (!openImage) return

    closeButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        closeModal()
        return
      }
      if (e.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return
      const focusables = dialog.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      // Kembalikan fokus ke pemicu pembuka.
      triggerRef.current?.focus()
    }
  }, [openImage, closeModal])

  return (
    <section
      id="certifications"
      className="py-16 px-6 border-b border-rule"
      aria-labelledby="certifications-heading"
    >
      <div className="max-w-content mx-auto space-y-4">
        <h2
          id="certifications-heading"
          className="font-mono text-xs uppercase tracking-wider text-muted"
        >
          {ui.sections.certifications}
        </h2>
        {hasCerts &&
          certifications.map((cert, index) => (
            <div key={cert.image || index}>
              <button
                type="button"
                onClick={(e) => openCert(cert.image, e.currentTarget)}
                className="w-full flex items-center justify-between text-left text-sm transition-colors hover:text-accent"
              >
                <span className="text-muted">{cert.title}</span>
                <span className="font-mono text-xs text-muted">/ {cert.issuer}</span>
                <span className="font-mono text-xs text-muted">{ui.certifications.view} ↗</span>
              </button>
            </div>
          ))}

        {openImage && (
          <div
            ref={dialogRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={ui.certifications.modalLabel}
          >
            <button
              type="button"
              ref={closeButtonRef}
              onClick={closeModal}
              aria-label={ui.certifications.close}
              className="absolute top-4 right-4 text-muted hover:text-ink transition-colors"
            >
              ✕
            </button>
            <img
              src={openImage}
              alt="Pratinjau sertifikat"
              className="max-h-[85vh] max-w-full object-contain"
              style={{ borderRadius: '6px' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
