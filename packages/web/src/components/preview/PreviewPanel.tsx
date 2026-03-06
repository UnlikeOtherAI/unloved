import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useSessionStore } from '../../stores/session'
import { useLayoutStore, VIEWPORT_SIZES } from '../../stores/layout'

interface Props {
  sessionName: string
  url?: string
}

export default function PreviewPanel({ sessionName, url }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const fetchMeta = useSessionStore((s) => s.fetchMeta)
  const previewViewport = useLayoutStore((s) => s.previewViewport)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      await fetch(`/api/sessions/${encodeURIComponent(sessionName)}/meta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previewUrl: trimmed }),
      })
      await fetchMeta(sessionName)
      setInput('')
    } finally {
      setLoading(false)
    }
  }

  if (!url) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-sidebar dark:bg-bg-dark">
        <Globe size={32} className="text-text-secondary/40" />
        <p className="text-sm text-text-secondary">No preview URL set</p>
        <p className="text-xs text-text-secondary/60">
          Run <code className="rounded bg-divider px-1.5 py-0.5 font-mono dark:bg-divider-dark">unloved {sessionName} url &lt;url&gt;</code> to set one
        </p>
        <form onSubmit={handleSubmit} className="flex w-72 gap-2">
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://localhost:3000"
            className="flex-1 rounded-lg border border-divider bg-bg px-3 py-1.5 text-sm text-text outline-none focus:border-accent dark:border-divider-dark dark:bg-bg-dark dark:text-text-dark"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white transition-opacity disabled:opacity-50"
          >
            Set
          </button>
        </form>
      </div>
    )
  }

  if (previewViewport === 'default') {
    return <iframe src={url} title="Preview" className="h-full w-full border-0" />
  }

  const size = VIEWPORT_SIZES[previewViewport]
  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto bg-sidebar dark:bg-bg-dark">
      <iframe
        src={url}
        title="Preview"
        className="shrink-0 border border-divider dark:border-divider-dark"
        style={{ width: size.w, height: size.h }}
      />
    </div>
  )
}
