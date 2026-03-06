import { createServer as createHttpServer, type Server } from 'node:http'
import { createApp, type AppOptions } from './app'
import { createWsHandler } from './terminal/ws-handler'

export { createApp, type AppOptions } from './app'

const DEFAULT_PORT = 6200

export interface StartServerOptions extends AppOptions {
  port?: number
}

export function startServer(options: StartServerOptions): Server {
  const { port = DEFAULT_PORT, ...appOptions } = options
  const app = createApp(appOptions)

  const server = createHttpServer(app)
  createWsHandler(server)

  server.listen(port, '0.0.0.0', () => {
    console.log(`@unloved/server listening on http://localhost:${port}`)
  })

  return server
}
