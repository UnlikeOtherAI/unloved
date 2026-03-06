import { useRef } from 'react'
import { Menu, RotateCw, Hammer, X } from 'lucide-react'
import { useSessionStore } from '../../stores/session'
import { useLayoutStore } from '../../stores/layout'

export default function Header() {
  const activeSessionName = useSessionStore((s) => s.activeSessionName)
  const sessionMetas = useSessionStore((s) => s.sessionMetas)
  const triggerRestart = useSessionStore((s) => s.triggerRestart)
  const clearActiveSession = useSessionStore((s) => s.clearActiveSession)
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const meta = activeSessionName ? sessionMetas[activeSessionName] : null
  const previewUrl = meta?.previewUrl

  const handleRefresh = () => {
    // Find the preview iframe in the DOM and reload it
    const iframe = document.querySelector('iframe[title="Preview"]') as HTMLIFrameElement | null
    if (!iframe) return
    const current = iframe.src
    iframe.src = 'about:blank'
    requestAnimationFrame(() => {
      iframe.src = current
    })
  }

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-3 border-b border-divider px-4 dark:border-divider-dark">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sidebar text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {activeSessionName ? (
        <>
          <span className="shrink-0 font-mono text-sm font-medium text-text-primary dark:text-text-dark">
            {activeSessionName}
          </span>

          {previewUrl && (
            <div className="flex h-9 w-[var(--console-width)] max-w-[420px] shrink-0 items-center gap-2 rounded-input border border-divider bg-sidebar px-3 dark:border-divider-dark dark:bg-bg-dark">
              <span className="flex-1 truncate font-mono text-xs text-text-secondary" data-testid="header-url">
                {previewUrl}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
                aria-label="Refresh preview"
              >
                <RotateCw size={13} />
              </button>
            </div>
          )}

          <div className="flex-1" />

          {meta?.restartCommand && (
            <button
              type="button"
              onClick={() => triggerRestart(activeSessionName)}
              className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-button bg-accent px-3 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
              aria-label="Rebuild"
            >
              <Hammer size={14} />
              Rebuild
            </button>
          )}

          <button
            type="button"
            onClick={clearActiveSession}
            className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-sidebar px-2.5 text-xs text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
            aria-label="Disconnect"
          >
            <X size={14} />
            Disconnect
          </button>
        </>
      ) : (
        <span className="text-sm text-text-secondary">Select a session</span>
      )}
    </header>
  )
}
