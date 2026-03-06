import { useRef } from 'react'
import { useTerminal } from './useTerminal'

interface Props {
  sessionName: string
}

export default function TerminalPanel({ sessionName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  useTerminal(sessionName, containerRef)

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col bg-terminal-bg p-3">
      <div
        ref={containerRef}
        className="min-h-0 flex-1"
      />
    </div>
  )
}
