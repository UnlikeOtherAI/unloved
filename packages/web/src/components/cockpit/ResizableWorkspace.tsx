import { useCallback, useSyncExternalStore } from 'react'
import { Group, Panel, Separator, type Layout } from 'react-resizable-panels'
import { useSessionStore } from '../../stores/session'
import { useLayoutStore } from '../../stores/layout'
import TerminalPanel from '../terminal/TerminalPanel'
import PreviewPanel from '../preview/PreviewPanel'

const COOKIE_V = 'unloved_split_v'
const COOKIE_H = 'unloved_split_h'

function readSplit(key: string, fallback: number[]): number[] {
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
  if (!match) return fallback
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]))
    if (Array.isArray(parsed) && parsed.every((n: unknown) => typeof n === 'number')) return parsed
  } catch { /* ignore */ }
  return fallback
}

function writeSplit(key: string, layout: Layout) {
  const sizes = Object.values(layout)
  document.cookie = `${key}=${encodeURIComponent(JSON.stringify(sizes))};path=/;max-age=31536000;SameSite=Lax`
}

function HorizontalPill() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-1 rounded-full bg-text-secondary/30" />
    </div>
  )
}

function VerticalPill() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-1 w-8 rounded-full bg-text-secondary/30" />
    </div>
  )
}

const mdQuery = typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)') : null
function subscribeToMd(cb: () => void) {
  mdQuery?.addEventListener('change', cb)
  return () => mdQuery?.removeEventListener('change', cb)
}
function getIsMd() { return mdQuery?.matches ?? true }

interface Props {
  sessionName: string
}

export default function ResizableWorkspace({ sessionName }: Props) {
  const sessionMetas = useSessionStore((s) => s.sessionMetas)
  const rawViewMode = useLayoutStore((s) => s.viewMode)
  const isMd = useSyncExternalStore(subscribeToMd, getIsMd)
  const viewMode = !isMd && (rawViewMode === 'both' || rawViewMode === 'side-by-side') ? 'terminal' : rawViewMode
  const meta = sessionMetas[sessionName]
  const previewUrl = meta?.previewUrl

  const onVerticalChanged = useCallback((layout: Layout) => {
    writeSplit(COOKIE_V, layout)
  }, [])

  const onHorizontalChanged = useCallback((layout: Layout) => {
    writeSplit(COOKIE_H, layout)
  }, [])

  if (viewMode === 'preview') {
    return (
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <PreviewPanel sessionName={sessionName} url={previewUrl} />
      </div>
    )
  }

  if (viewMode === 'terminal') {
    return (
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <TerminalPanel sessionName={sessionName} />
      </div>
    )
  }

  if (viewMode === 'side-by-side') {
    const hSizes = readSplit(COOKIE_H, [50, 50])
    return (
      <Group orientation="horizontal" className="min-h-0 flex-1" onLayoutChanged={onHorizontalChanged}>
        <Panel defaultSize={`${hSizes[0]}%`} minSize="20%">
          <TerminalPanel sessionName={sessionName} />
        </Panel>
        <Separator className="w-1.5 bg-divider transition-colors hover:bg-accent dark:bg-divider-dark dark:hover:bg-accent-dark">
          <HorizontalPill />
        </Separator>
        <Panel defaultSize={`${hSizes[1]}%`} minSize="20%">
          <PreviewPanel sessionName={sessionName} url={previewUrl} />
        </Panel>
      </Group>
    )
  }

  const vSizes = readSplit(COOKIE_V, [60, 40])
  return (
    <Group orientation="vertical" className="min-h-0 flex-1" onLayoutChanged={onVerticalChanged}>
      <Panel defaultSize={`${vSizes[0]}%`} minSize="20%">
        <TerminalPanel sessionName={sessionName} />
      </Panel>
      <Separator className="h-1.5 bg-divider transition-colors hover:bg-accent dark:bg-divider-dark dark:hover:bg-accent-dark">
        <VerticalPill />
      </Separator>
      <Panel defaultSize={`${vSizes[1]}%`} minSize="15%">
        <PreviewPanel sessionName={sessionName} url={previewUrl} />
      </Panel>
    </Group>
  )
}
