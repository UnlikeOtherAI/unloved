import type { Server as HttpServer, IncomingMessage } from 'node:http'
import { WebSocketServer, type WebSocket } from 'ws'
import type { WsResizeMessage } from '@unloved/shared'
import * as pty from './pty-manager'

export function createWsHandler(server: HttpServer): void {
  const wss = new WebSocketServer({ noServer: true })

  server.on('upgrade', (req: IncomingMessage, socket, head) => {
    const match = req.url?.match(/^\/ws\/terminal\/([^/?]+)/)
    if (!match) {
      socket.destroy()
      return
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req, match[1])
    })
  })

  wss.on('connection', (ws: WebSocket, _req: IncomingMessage, sessionName: string) => {
    pty.attach(sessionName, ws)

    ws.on('message', (raw, isBinary) => {
      if (isBinary) {
        // Binary frame: raw terminal input
        pty.write(sessionName, raw.toString())
        return
      }

      // Text frame: JSON control message
      try {
        const msg = JSON.parse(raw.toString()) as WsResizeMessage
        if (msg.type === 'resize' && msg.cols > 0 && msg.rows > 0) {
          pty.resize(sessionName, msg.cols, msg.rows)
        }
      } catch {
        // Treat unparseable text as terminal input
        pty.write(sessionName, raw.toString())
      }
    })

    ws.on('close', () => {
      pty.detach(sessionName, ws)
    })
  })
}
