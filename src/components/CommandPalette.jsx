import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import data from '../data/content.js'

export default function CommandPalette({ onToggleTheme }) {
  const { site, ui } = data
  const palette = ui.palette
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [feedback, setFeedback] = useState('')
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const wasOpenRef = useRef(false)

  const close = useCallback(() => setOpen(false), [])

  const openPalette = useCallback(() => {
    setQuery('')
    setActiveIndex(0)
    setOpen(true)
  }, [])

  const showFeedback = useCallback((message) => {
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 1800)
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      showFeedback(palette.copied)
    } catch {
      showFeedback(palette.copyFailed)
    }
  }, [palette.copied, palette.copyFailed, showFeedback, site.email])

  const commands = useMemo(() => {
    const navigationCommands = ui.nav.map((item) => ({
      id: `nav-${item.href}`,
      label: item.label,
    }))

    return [
      ...navigationCommands,
      ...(site.email
        ? [
            {
              id: 'copy-email',
              label: palette.copyEmail,
            },
          ]
        : []),
      {
        id: 'toggle-theme',
        label: palette.toggleTheme,
      },
      ...(site.github
        ? [
            {
              id: 'open-github',
              label: palette.openGithub,
            },
          ]
        : []),
    ]
  }, [palette, site.email, site.github, ui.nav])

  const filteredCommands = useMemo(
    () =>
      commands.filter((command) =>
        command.label.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID'))
      ),
    [commands, query]
  )

  const runCommand = useCallback(
    (command) => {
      if (command.id.startsWith('nav-')) {
        close()
        document.querySelector(command.id.slice(4))?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        })
        return
      }

      if (command.id === 'copy-email') {
        copyEmail()
        return
      }

      if (command.id === 'toggle-theme') {
        onToggleTheme()
        close()
        return
      }

      if (command.id === 'open-github') {
        close()
        window.open(site.github, '_blank', 'noopener,noreferrer')
      }
    },
    [close, copyEmail, onToggleTheme, site.github]
  )

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openPalette()
      }
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [openPalette])

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) triggerRef.current?.focus()
      wasOpenRef.current = false
      return undefined
    }

    wasOpenRef.current = true
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key === 'ArrowDown' && filteredCommands.length > 0) {
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % filteredCommands.length)
      }

      if (event.key === 'ArrowUp' && filteredCommands.length > 0) {
        event.preventDefault()
        setActiveIndex((index) => (index - 1 + filteredCommands.length) % filteredCommands.length)
      }

      if (event.key === 'Enter' && filteredCommands[activeIndex]) {
        event.preventDefault()
        runCommand(filteredCommands[activeIndex])
      }

      if (event.key !== 'Tab') return
      const focusables = dialogRef.current?.querySelectorAll('input, button') || []
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
  }, [activeIndex, close, filteredCommands, open, runCommand])

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={openPalette}
        className="inline-flex items-center gap-2 shrink-0 px-2 py-1 text-xs text-muted border border-rule hover:text-ink hover:border-ink transition-colors"
        aria-label={palette.hint}
        aria-keyshortcuts="Control+K Meta+K"
      >
        <span aria-hidden="true">Ctrl K</span>
        <span className="sr-only">{palette.hint}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 p-4 pt-[15vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={palette.label}
            className="w-full max-w-lg overflow-hidden border border-rule bg-surface shadow-xl"
          >
            <div className="border-b border-rule p-3">
              <label htmlFor="command-palette-search" className="sr-only">
                {palette.placeholder}
              </label>
              <input
                id="command-palette-search"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                placeholder={palette.placeholder}
                className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
                aria-controls="command-palette-list"
              />
            </div>
            <div id="command-palette-list" className="max-h-72 overflow-y-auto p-2" role="listbox">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command, index) => (
                  <button
                    type="button"
                    key={command.id}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runCommand(command)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      index === activeIndex ? 'bg-paper text-ink' : 'text-muted hover:bg-paper'
                    }`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    {command.label}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-muted">{palette.empty}</p>
              )}
            </div>
            {feedback && (
              <p className="border-t border-rule px-3 py-2 text-xs text-accent" aria-live="polite">
                {feedback}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
