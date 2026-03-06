import { useRef } from 'react'
import { useTerminal } from './useTerminal'

interface Props {
  sessionName: string
}

export default function TerminalPanel({ sessionName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  useTerminal(sessionName, containerRef)

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-terminal-bg"
    />
  )
}
