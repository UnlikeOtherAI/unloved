import { useState, useRef, useEffect } from 'react'
import { Settings, Unplug, Trash2 } from 'lucide-react'
import { useSessionStore } from '../../stores/session'

export default function SessionMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const activeSessionName = useSessionStore((s) => s.activeSessionName)
  const clearActiveSession = useSessionStore((s) => s.clearActiveSession)
  const killSession = useSessionStore((s) => s.killSession)

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
        <button
          type="button"
          onClick={() => {
            clearActiveSession()
            setOpen(false)
          }}
          className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
        >
          <Unplug size={14} />
          Disconnect
        </button>
        <button
          type="button"
          onClick={() => {
            if (activeSessionName) {
              killSession(activeSessionName)
            }
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
