import { useState, useRef, useEffect } from 'react'
import data from '../data/portfolio.json'

export default function Certifications() {
  const { certifications } = data
  const [openImage, setOpenImage] = useState(null)
  const triggerRef = useRef(null)

  const hasCerts = certifications && certifications.length > 0

  const closeModal = () => {
    setOpenImage(null)
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    if (openImage) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKey)
        document.body.style.overflow = ''
      }
    }
  }, [openImage])

  return (
    <section id="certifications" className="py-16 px-6 border-b border-rule" aria-labelledby="certifications-heading">
      <div className="max-w-content mx-auto space-y-4">
        <h2 id="certifications-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          Sertifikasi
        </h2>
        {hasCerts &&
          certifications.map((cert, index) => (
            <div key={index}>
              <button
                type="button"
                ref={index === 0 ? triggerRef : null}
                onClick={() => setOpenImage(cert.image)}
                className="w-full flex items-center justify-between text-left text-sm transition-colors hover:text-accent"
              >
                <span className="text-muted">{cert.title}</span>
                <span className="font-mono text-xs text-muted">/ {cert.issuer}</span>
                <span className="font-mono text-xs text-muted">Lihat ↗</span>
              </button>
            </div>
          ))}

        {openImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau sertifikat"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Tutup pratinjau"
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
