import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { Router, type Router as ExpressRouter } from 'express'
import type { TmuxSession } from '@unloved/shared'

const execFileAsync = promisify(execFile)

const tmuxRouter: ExpressRouter = Router()

tmuxRouter.get('/sessions', async (_request, response) => {
  try {
    const { stdout } = await execFileAsync('tmux', [
      'list-sessions',
      '-F',
      '#{session_name}\t#{session_windows}\t#{session_created}\t#{session_attached}',
    ])

    const sessions: TmuxSession[] = stdout
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [name, windowsRaw, created, attachedRaw] = line.split('\t')

        return {
          name,
          windows: Number.parseInt(windowsRaw, 10),
          created,
          attached: attachedRaw === '1',
        }
      })

    response.json(sessions)
  } catch (error) {
    const tmuxError = error as NodeJS.ErrnoException & { status?: number }

    if (tmuxError.code === 'ENOENT' || tmuxError.status === 1) {
      response.json([])
      return
    }

    response.status(500).json({ error: 'Failed to list tmux sessions' })
  }
})

tmuxRouter.post('/sessions', async (request, response) => {
  const { name } = request.body as { name?: string }

  if (!name || !name.trim()) {
    response.status(400).json({ error: 'Session name is required' })
    return
  }

  try {
    await execFileAsync('tmux', ['new-session', '-d', '-s', name.trim()])
    response.json({ name: name.trim(), created: true })
  } catch (error) {
    const tmuxError = error as NodeJS.ErrnoException
    if (tmuxError.code === 'ENOENT') {
      response.status(400).json({ error: 'tmux is not installed' })
      return
    }
    response.status(500).json({ error: 'Failed to create tmux session' })
  }
})

tmuxRouter.delete('/sessions/:name', async (request, response) => {
  const { name } = request.params

  if (!name || !name.trim()) {
    response.status(400).json({ error: 'Session name is required' })
    return
  }

  try {
    await execFileAsync('tmux', ['kill-session', '-t', name.trim()])
    response.json({ name: name.trim(), killed: true })
  } catch (error) {
    const tmuxError = error as NodeJS.ErrnoException
    if (tmuxError.code === 'ENOENT') {
      response.status(400).json({ error: 'tmux is not installed' })
      return
    }
    response.status(500).json({ error: 'Failed to kill tmux session' })
  }
})

export default tmuxRouter
