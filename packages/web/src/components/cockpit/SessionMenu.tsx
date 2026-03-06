import { useState, useRef, useEffect } from 'react'
import { Settings, Unplug, Trash2, Smartphone, Tablet, Monitor, Maximize, RotateCw, Hammer, Globe } from 'lucide-react'
import { useSessionStore } from '../../stores/session'
import { useLayoutStore, type PreviewViewport } from '../../stores/layout'

const viewports: { value: PreviewViewport; icon: typeof Monitor; label: string; rotate?: boolean }[] = [
  { value: 'mobile-portrait', icon: Smartphone, label: 'Mobile portrait' },
  { value: 'mobile-landscape', icon: Smartphone, label: 'Mobile landscape', rotate: true },
  { value: 'tablet-portrait', icon: Tablet, label: 'Tablet portrait' },
  { value: 'tablet-landscape', icon: Tablet, label: 'Tablet landscape', rotate: true },
  { value: 'desktop', icon: Monitor, label: 'Desktop' },
  { value: 'default', icon: Maximize, label: 'Full width' },
]

export default function SessionMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const activeSessionName = useSessionStore((s) => s.activeSessionName)
  const sessionMetas = useSessionStore((s) => s.sessionMetas)
  const clearActiveSession = useSessionStore((s) => s.clearActiveSession)
  const killSession = useSessionStore((s) => s.killSession)
  const triggerRestart = useSessionStore((s) => s.triggerRestart)
  const fetchMeta = useSessionStore((s) => s.fetchMeta)
  const viewMode = useLayoutStore((s) => s.viewMode)
  const previewViewport = useLayoutStore((s) => s.previewViewport)
  const setPreviewViewport = useLayoutStore((s) => s.setPreviewViewport)

  const meta = activeSessionName ? sessionMetas[activeSessionName] : null
  const showPreview = viewMode !== 'terminal'
  const previewUrl = meta?.previewUrl

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const itemClass = 'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-sidebar-hover dark:text-text-dark dark:hover:bg-divider-dark'
  const activeItemClass = 'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-sm text-accent transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark'
  const dividerClass = 'h-px bg-divider dark:bg-divider-dark'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sidebar text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
        aria-label="Session settings"
      >
        <Settings size={16} />
      </button>

      <div
        className={[
          'absolute right-0 top-full z-50 mt-1 w-52 origin-top-right overflow-hidden rounded-lg border border-divider bg-sidebar shadow-lg transition-all duration-150 dark:border-divider-dark dark:bg-bg-dark',
          open
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        ].join(' ')}
      >
        {/* Mobile-only: change preview URL */}
        {showPreview && (
          <div className="md:hidden">
            <button
              type="button"
              onClick={async () => {
                if (activeSessionName) {
                  await fetch(`/api/sessions/${encodeURIComponent(activeSessionName)}/meta`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ previewUrl: '' }),
                  })
                  await fetchMeta(activeSessionName)
                }
                setOpen(false)
              }}
              className={itemClass}
            >
              <Globe size={14} />
              Change preview URL
            </button>
            <div className={dividerClass} />
          </div>
        )}

        {/* Mobile-only: viewport options */}
        {showPreview && (
          <div className="md:hidden">
            {viewports.map(({ value, icon: Icon, label, rotate }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setPreviewViewport(value)
                  setOpen(false)
                }}
                className={previewViewport === value ? activeItemClass : itemClass}
              >
                <Icon size={14} style={rotate ? { transform: 'rotate(90deg)' } : undefined} />
                {label}
              </button>
            ))}
            <div className={dividerClass} />
          </div>
        )}

        {/* Mobile-only: refresh preview */}
        {showPreview && previewUrl && (
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => {
                const iframe = document.querySelector('iframe[title="Preview"]') as HTMLIFrameElement | null
                if (iframe) {
                  const current = iframe.src
                  iframe.src = 'about:blank'
                  requestAnimationFrame(() => { iframe.src = current })
                }
                setOpen(false)
              }}
              className={itemClass}
            >
              <RotateCw size={14} />
              Refresh preview
            </button>
            <div className={dividerClass} />
          </div>
        )}

        {/* Mobile-only: rebuild */}
        {meta?.restartCommand && (
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => {
                if (activeSessionName) triggerRestart(activeSessionName)
                setOpen(false)
              }}
              className={itemClass}
            >
              <Hammer size={14} />
              Rebuild
            </button>
            <div className={dividerClass} />
          </div>
        )}

        {/* Always visible */}
        <button
          type="button"
          onClick={() => {
            clearActiveSession()
            setOpen(false)
          }}
          className={itemClass}
        >
          <Unplug size={14} />
          Disconnect
        </button>
        <button
          type="button"
          onClick={() => {
            if (activeSessionName) killSession(activeSessionName)
            setOpen(false)
          }}
          className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
        >
          <Trash2 size={14} />
          Kill tmux session
        </button>
      </div>
    </div>
  )
}
