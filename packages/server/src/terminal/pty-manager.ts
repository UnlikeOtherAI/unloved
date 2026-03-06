import { execFileSync } from 'node:child_process'
import type { IPty } from 'node-pty'
import { spawn } from 'node-pty'
import type { WebSocket } from 'ws'
import { RingBuffer } from './ring-buffer'

// Resolve full path to tmux once — node-pty's posix_spawnp may have a limited PATH
let tmuxBin = 'tmux'
try {
  tmuxBin = execFileSync('which', ['tmux'], { encoding: 'utf-8' }).trim()
} catch {
  // Fall through, use bare name
}

interface PtyEntry {
  pty: IPty
  buffer: RingBuffer
  clients: Set<WebSocket>
  graceTimer: ReturnType<typeof setTimeout> | null
}

const entries = new Map<string, PtyEntry>()
const GRACE_MS = 60_000

function sendJson(ws: WebSocket, msg: object): void {
  ws.send(JSON.stringify(msg))
}

export function attach(sessionName: string, ws: WebSocket): void {
  let entry = entries.get(sessionName)

  if (!entry) {
    let pty: IPty
    try {
      pty = spawn(tmuxBin, ['attach-session', '-t', sessionName], {
        name: 'xterm-256color',
        cols: 120,
        rows: 30,
        cwd: process.env.HOME ?? '/',
        env: { ...process.env } as Record<string, string>,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to spawn pty'
      console.error(`[pty] spawn failed for ${sessionName}:`, msg)
      sendJson(ws, { type: 'error', message: msg })
      ws.close()
      return
    }

    const buffer = new RingBuffer()
    const clients = new Set<WebSocket>()

    pty.onData((data) => {
      buffer.push(data)
      for (const c of clients) {
        if (c.readyState === 1) c.send(data)
      }
    })

    pty.onExit(() => {
      for (const c of clients) {
        sendJson(c, { type: 'error', message: 'tmux session ended' })
        c.close()
      }
      entries.delete(sessionName)
    })

    entry = { pty, buffer, clients, graceTimer: null }
    entries.set(sessionName, entry)
  }

  if (entry.graceTimer) {
    clearTimeout(entry.graceTimer)
    entry.graceTimer = null
  }

  // Send replay buffer to late-joining client
  const replay = entry.buffer.getAll()
  if (replay.length > 0) {
    sendJson(ws, { type: 'replay', data: replay.toString('utf-8') })
  }

  entry.clients.add(ws)
}

export function detach(sessionName: string, ws: WebSocket): void {
  const entry = entries.get(sessionName)
  if (!entry) return

  entry.clients.delete(ws)

  if (entry.clients.size === 0) {
    entry.graceTimer = setTimeout(() => {
      entry.pty.kill()
      entries.delete(sessionName)
    }, GRACE_MS)
  }
}

export function write(sessionName: string, data: string): void {
  entries.get(sessionName)?.pty.write(data)
}

export function resize(sessionName: string, cols: number, rows: number): void {
  entries.get(sessionName)?.pty.resize(cols, rows)
}
