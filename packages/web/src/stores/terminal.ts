import { create } from 'zustand'

type MessageHandler = (data: string | ArrayBuffer) => void

export interface TerminalStore {
  connected: boolean
  connectedSession: string | null
  onMessage: MessageHandler | null

  connect: (sessionName: string) => void
  disconnect: () => void
  send: (data: string | ArrayBuffer) => void
  resize: (cols: number, rows: number) => void
  setOnMessage: (handler: MessageHandler | null) => void
}

let ws: WebSocket | null = null

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  connected: false,
  connectedSession: null,
  onMessage: null,

  connect: (sessionName) => {
    // Disconnect existing
    if (ws) {
      ws.close()
      ws = null
    }

    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${proto}//${location.host}/ws/terminal/${encodeURIComponent(sessionName)}`
    const socket = new WebSocket(url)
    ws = socket

    socket.binaryType = 'arraybuffer'

    socket.onopen = () => {
      set({ connected: true, connectedSession: sessionName })
    }

    socket.onmessage = (ev) => {
      const handler = get().onMessage
      if (!handler) return

      if (ev.data instanceof ArrayBuffer) {
        handler(ev.data)
      } else {
        // Text frame — could be JSON control or terminal data
        try {
          const msg = JSON.parse(ev.data)
          if (msg.type === 'replay') {
            handler(msg.data as string)
          } else if (msg.type === 'error') {
            console.error('[ws]', msg.message)
          }
        } catch {
          handler(ev.data as string)
        }
      }
    }

    socket.onclose = () => {
      set({ connected: false, connectedSession: null })
      ws = null
    }

    socket.onerror = () => {
      socket.close()
    }
  },

  disconnect: () => {
    if (ws) {
      ws.close()
      ws = null
    }
    set({ connected: false, connectedSession: null })
  },

  send: (data) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(data)
    }
  },

  resize: (cols, rows) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'resize', cols, rows }))
    }
  },

  setOnMessage: (handler) => {
    set({ onMessage: handler })
  },
}))
