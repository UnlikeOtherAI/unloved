import { Group, Panel, Separator } from 'react-resizable-panels'
import { useSessionStore } from '../../stores/session'
import { useLayoutStore } from '../../stores/layout'
import TerminalPanel from '../terminal/TerminalPanel'
import PreviewPanel from '../preview/PreviewPanel'

interface Props {
  sessionName: string
}

export default function ResizableWorkspace({ sessionName }: Props) {
  const sessionMetas = useSessionStore((s) => s.sessionMetas)
  const previewVisible = useLayoutStore((s) => s.previewVisible)
  const meta = sessionMetas[sessionName]
  const previewUrl = meta?.previewUrl

  const showPreview = previewVisible && !!previewUrl

  if (!showPreview) {
    return (
      <div className="min-h-0 flex-1 overflow-hidden">
        <TerminalPanel sessionName={sessionName} />
      </div>
    )
  }

  return (
    <Group orientation="vertical" className="min-h-0 flex-1">
      <Panel defaultSize="60%" minSize="20%">
        <TerminalPanel sessionName={sessionName} />
      </Panel>
      <Separator className="h-1.5 bg-divider transition-colors hover:bg-accent dark:bg-divider-dark dark:hover:bg-accent-dark" />
      <Panel defaultSize="40%" minSize="15%">
        <PreviewPanel url={previewUrl} />
      </Panel>
    </Group>
  )
}
