import { useState, useEffect, useRef } from 'react'
import { RotateCw } from 'lucide-react'
import { useSessionStore } from '../../stores/session'

const HISTORY_KEY = 'unloved:url-history'
const MAX_HISTORY = 20

function readHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function pushHistory(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return
  const list = readHistory().filter((u) => u !== trimmed)
  list.unshift(trimmed)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)))
}

function faviconUrl(url: string): string | null {
  try {
    const origin = new URL(url).origin
    return `${origin}/favicon.ico`
  } catch {
    return null
  }
}

function Favicon({ url, className }: { url: string; className?: string }) {
  const src = faviconUrl(url)
  const [ok, setOk] = useState(true)

  useEffect(() => { setOk(true) }, [src])

  if (!src || !ok) return null

  return (
    <img
      src={src}
      alt=""
      width={14}
      height={14}
      className={className ?? 'shrink-0'}
      onError={() => setOk(false)}
    />
  )
}

interface Props {
  previewUrl: string
  activeSessionName: string
}

export default function UrlBar({ previewUrl, activeSessionName }: Props) {
  const fetchMeta = useSessionStore((s) => s.fetchMeta)

  const [input, setInput] = useState(previewUrl)
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setInput(previewUrl) }, [previewUrl])

  const filtered = history.filter((u) => {
    if (!input.trim()) return true
    return u.toLowerCase().includes(input.toLowerCase())
  })

  const handleFocus = () => {
    setHistory(readHistory())
    setOpen(true)
  }

  const handleBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      if (!wrapperRef.current?.contains(document.activeElement)) {
        setOpen(false)
      }
    }, 150)
  }

  const submit = async (url: string) => {
    const trimmed = url.trim()
    if (!trimmed || trimmed === previewUrl) {
      setOpen(false)
      return
    }
    pushHistory(trimmed)
    await fetch(`/api/sessions/${encodeURIComponent(activeSessionName)}/meta`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ previewUrl: trimmed }),
    })
    await fetchMeta(activeSessionName)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
      void submit(input)
    }
    if (e.key === 'Escape') {
      setOpen(false)
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  const handleRefresh = () => {
    const iframe = document.querySelector('iframe[title="Preview"]') as HTMLIFrameElement | null
    if (!iframe) return
    const current = iframe.src
    iframe.src = 'about:blank'
    requestAnimationFrame(() => { iframe.src = current })
  }

  const selectUrl = (url: string) => {
    setInput(url)
    void submit(url)
  }

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <div className="flex h-9 w-64 items-center gap-2 rounded-input border border-divider bg-sidebar px-3 dark:border-divider-dark dark:bg-bg-dark">
        {previewUrl && <Favicon url={previewUrl} className="shrink-0 rounded-sm" />}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Preview URL"
          className="flex-1 truncate bg-transparent font-mono text-xs text-text-secondary outline-none dark:text-text-dark"
          data-testid="header-url"
        />
        {previewUrl && (
          <button
            type="button"
            onClick={handleRefresh}
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
            aria-label="Refresh preview"
          >
            <RotateCw size={13} />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-divider/60 bg-white/95 shadow-float backdrop-blur-sm dark:border-divider-dark/60 dark:bg-card-dark/95">
          {filtered.map((url) => (
            <button
              key={url}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectUrl(url)}
              className={[
                'flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs transition-colors',
                url === previewUrl
                  ? 'text-accent dark:text-accent-dark'
                  : 'text-text-secondary hover:bg-sidebar-hover/60 dark:hover:bg-divider-dark/40',
              ].join(' ')}
            >
              <Favicon url={url} className="shrink-0 rounded-sm" />
              <span className="truncate">{url}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
