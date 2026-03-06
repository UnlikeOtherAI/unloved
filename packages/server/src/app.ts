import { resolve } from 'node:path'
import cors from 'cors'
import express, { type Express } from 'express'
import configRouter from './routes/config'
import healthRouter from './routes/health'
import sessionMetaRouter from './routes/session-meta'
import tmuxRouter from './routes/tmux'

export interface AppOptions {
  homeDir: string
  staticDir?: string
}

export function createApp(options: AppOptions): Express {
  const app = express()

  app.locals.homeDir = options.homeDir

  app.use(
    cors({
      origin: (_origin, callback) => callback(null, true),
    }),
  )
  app.use(express.json())

  app.use('/api/health', healthRouter)
  app.use('/api/tmux', tmuxRouter)
  app.use('/api/config', configRouter)
  app.use('/api/sessions', sessionMetaRouter)

  if (options.staticDir) {
    app.use(express.static(options.staticDir))
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(resolve(options.staticDir!, 'index.html'))
    })
  }

  return app
}
