import { useEffect, useRef, type RefObject } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { useTerminalStore } from '../../stores/terminal'

function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function useTerminal(
  sessionName: string,
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const termRef = useRef<Terminal | null>(null)
  const fitRef = useRef<FitAddon | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const term = new Terminal({
      fontFamily: getCssVar('--font-mono') || "'JetBrains Mono', monospace",
      fontSize: 14,
      theme: {
        background: getCssVar('--color-terminal-bg') || '#0D1117',
        foreground: getCssVar('--color-terminal-text') || '#E6EDF3',
        cursor: getCssVar('--color-terminal-text') || '#E6EDF3',
        selectionBackground: 'rgba(91,107,255,0.3)',
      },
      cursorBlink: true,
      allowProposedApi: true,
    })

    const fit = new FitAddon()
    term.loadAddon(fit)
    term.loadAddon(new WebLinksAddon())

    term.open(el)
    fit.fit()
    term.focus()

    el.addEventListener('click', () => term.focus())

    termRef.current = term
    fitRef.current = fit

    // Bridge: store → terminal
    useTerminalStore.getState().setOnMessage((data) => {
      if (typeof data === 'string') {
        term.write(data)
      } else {
        term.write(new Uint8Array(data as ArrayBuffer))
      }
    })

    // Bridge: terminal → store (keystrokes)
    // Filter out DA responses and cursor position reports that xterm.js
    // generates in reply to tmux queries — these leak as garbled text if
    // forwarded back through the pty to other attached tmux clients.
    const TERM_RESPONSE_RE = /\x1b\[[\x3c-\x3f]?[\d;]*[cRn]|\x1bP[^\x1b]*\x1b\\/g
    const dataDisposable = term.onData((data) => {
      const filtered = data.replace(TERM_RESPONSE_RE, '')
      if (filtered) {
        useTerminalStore.getState().send(filtered)
      }
    })

    // Connect WebSocket
    useTerminalStore.getState().connect(sessionName)

    // Resize handling
    const resizeObs = new ResizeObserver(() => {
      fit.fit()
      const { cols, rows } = term
      useTerminalStore.getState().resize(cols, rows)
    })
    resizeObs.observe(el)

    return () => {
      resizeObs.disconnect()
      dataDisposable.dispose()
      useTerminalStore.getState().setOnMessage(null)
      useTerminalStore.getState().disconnect()
      term.dispose()
      termRef.current = null
      fitRef.current = null
    }
  }, [sessionName, containerRef])
}
