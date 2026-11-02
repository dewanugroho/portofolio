import { useEffect, useRef, useState } from 'react'
import demo from '../data/demo.json'
import data from '../data/content.js'

const numberFormat = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: demo.currency,
  maximumFractionDigits: 0,
})

function formatPrice(value) {
  return numberFormat.format(value)
}

function TrendChart() {
  const { ui } = data
  const max = Math.max(...demo.trend)
  const min = Math.min(...demo.trend)
  const range = max - min || 1
  const points = demo.trend
    .map((value, index) => {
      const x = (index / Math.max(demo.trend.length - 1, 1)) * 100
      const y = 94 - ((value - min) / range) * 84
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <h4 id="pos-demo-trend-label" className="text-sm font-medium text-ink">
          {ui.posDemo.trendLabel}
        </h4>
        <p className="text-xs text-muted">{ui.posDemo.trendNote}</p>
      </div>
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-labelledby="pos-demo-trend-label"
        className="h-32 w-full border border-rule bg-paper p-2"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="94" x2="100" y2="94" stroke="currentColor" className="text-rule" />
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="text-accent"
        />
      </svg>
      <ul className="sr-only">
        {demo.trend.map((value, index) => (
          <li key={`${value}-${index}`}>{formatPrice(value)}</li>
        ))}
      </ul>
    </div>
  )
}

export default function PosDemo() {
  const { ui } = data
  const copy = ui.posDemo
  const [cart, setCart] = useState({})
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const paymentTriggerRef = useRef(null)
  const dialogRef = useRef(null)
  const confirmButtonRef = useRef(null)
  const doneButtonRef = useRef(null)

  const addItem = (id) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }))
  }

  const removeItem = (id) => {
    setCart((current) => {
      const next = { ...current }
      if (!next[id] || next[id] === 1) {
        delete next[id]
      } else {
        next[id] -= 1
      }
      return next
    })
  }

  const cartItems = demo.menu.filter((item) => cart[item.id])
  const total = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0)

  const closePayment = () => {
    setIsPaymentOpen(false)
    setPaymentComplete(false)
  }

  useEffect(() => {
    if (!isPaymentOpen) {
      paymentTriggerRef.current?.focus()
      return undefined
    }

    confirmButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closePayment()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = dialogRef.current?.querySelectorAll('button') || []
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isPaymentOpen])

  useEffect(() => {
    if (isPaymentOpen && paymentComplete) doneButtonRef.current?.focus()
  }, [isPaymentOpen, paymentComplete])

  return (
    <div className="mt-6 border border-rule bg-surface p-4 sm:p-6" aria-labelledby="pos-demo-title">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rule pb-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h4 id="pos-demo-title" className="text-lg font-semibold text-ink">
              {copy.title}
            </h4>
            <span className="font-mono text-[10px] tracking-wider text-accent">{copy.badge}</span>
          </div>
          <p className="text-xs text-muted">{copy.note}</p>
        </div>
        <TrendChart />
      </div>

      <div className="grid gap-6 pt-5 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <h5 className="font-mono text-xs uppercase tracking-wider text-muted">
            {copy.menuLabel}
          </h5>
          <ul className="grid gap-2 sm:grid-cols-2">
            {demo.menu.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border border-rule p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-ink">{item.name}</p>
                  <p className="mt-1 text-xs text-muted">{formatPrice(item.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(item.id)}
                  className="min-h-10 shrink-0 border border-rule px-3 text-xs text-muted transition-colors hover:border-ink hover:text-ink"
                  aria-label={`${copy.addItem} ${item.name}`}
                >
                  {copy.addItem}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h5 className="font-mono text-xs uppercase tracking-wider text-muted">
            {copy.cartLabel}
          </h5>
          {cartItems.length === 0 ? (
            <p className="border border-dashed border-rule p-4 text-sm text-muted">{copy.empty}</p>
          ) : (
            <ul className="space-y-2">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 text-ink">{item.name}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="min-h-8 min-w-8 border border-rule text-muted hover:border-ink hover:text-ink"
                      aria-label={`${copy.removeItem} ${item.name}`}
                    >
                      −
                    </button>
                    <span aria-label={`${cart[item.id]}`}>{cart[item.id]}</span>
                    <button
                      type="button"
                      onClick={() => addItem(item.id)}
                      className="min-h-8 min-w-8 border border-rule text-muted hover:border-ink hover:text-ink"
                      aria-label={`${copy.addItem} ${item.name}`}
                    >
                      +
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between border-t border-rule pt-3 text-sm font-medium text-ink">
            <span>{copy.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="button"
            ref={paymentTriggerRef}
            onClick={() => {
              setPaymentComplete(false)
              setIsPaymentOpen(true)
            }}
            disabled={total === 0}
            className="min-h-11 w-full bg-accent px-4 py-3 text-sm font-medium text-surface transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copy.pay}
          </button>
        </div>
      </div>

      {isPaymentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePayment()
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pos-payment-title"
            className="w-full max-w-md border border-rule bg-surface p-5 shadow-xl"
          >
            {paymentComplete ? (
              <div className="space-y-5">
                <p id="pos-payment-title" className="text-lg font-semibold text-ink">
                  {copy.success}
                </p>
                <button
                  type="button"
                  ref={doneButtonRef}
                  onClick={closePayment}
                  className="min-h-11 w-full bg-accent px-4 py-3 text-sm font-medium text-surface hover:bg-accent-strong"
                >
                  {copy.done}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <h5 id="pos-payment-title" className="text-lg font-semibold text-ink">
                    {copy.payTitle}
                  </h5>
                  <p className="text-sm text-muted">{copy.payNote}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closePayment}
                    className="min-h-11 flex-1 border border-rule px-4 py-3 text-sm text-muted hover:border-ink hover:text-ink"
                  >
                    {copy.cancel}
                  </button>
                  <button
                    type="button"
                    ref={confirmButtonRef}
                    onClick={() => setPaymentComplete(true)}
                    className="min-h-11 flex-1 bg-accent px-4 py-3 text-sm font-medium text-surface hover:bg-accent-strong"
                  >
                    {copy.confirmPay}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
