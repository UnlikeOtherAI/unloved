import cors from 'cors'
import express, { type Express } from 'express'
import configRouter from './routes/config'
import healthRouter from './routes/health'
import tmuxRouter from './routes/tmux'

const app: Express = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/tmux', tmuxRouter)
app.use('/api/config', configRouter)

export default app
