import { fileURLToPath } from 'node:url'
import type { Server } from 'node:http'
import app from './app'

const DEFAULT_PORT = 6200

export const createServer = (port = DEFAULT_PORT): Server => {
  const server = app.listen(port, () => {
    console.log(`@unloved/server listening on http://localhost:${port}`)
  })

  return server
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer()
}
