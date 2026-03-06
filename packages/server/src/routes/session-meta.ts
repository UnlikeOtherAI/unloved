import { execFile } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { Router, type Router as ExpressRouter } from 'express'
import type { SessionMeta } from '@unloved/shared'
import { z } from 'zod'

const execFileAsync = promisify(execFile)

const sessionMetaRouter: ExpressRouter = Router()

const metaSchema = z.object({
  previewUrl: z.string().optional(),
  restartCommand: z.string().optional(),
  projectDir: z.string().optional(),
  cliTool: z.string().optional(),
  createdAt: z.string().optional(),
})

const nameSchema = z.string().min(1).regex(/^[\w.-]+$/)

function getMetaPath(homeDir: string, name: string): string {
  return resolve(homeDir, 'sessions', name, 'meta.json')
}

async function readMeta(homeDir: string, name: string): Promise<SessionMeta> {
  try {
    const content = await readFile(getMetaPath(homeDir, name), 'utf-8')
    return JSON.parse(content) as SessionMeta
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException
    if (fileError.code === 'ENOENT') {
      return {}
    }
    throw error
  }
}

async function writeMeta(homeDir: string, name: string, meta: SessionMeta): Promise<void> {
  const metaPath = getMetaPath(homeDir, name)
  await mkdir(resolve(homeDir, 'sessions', name), { recursive: true })
  await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf-8')
}

sessionMetaRouter.get('/:name/meta', async (request, response) => {
  const parsed = nameSchema.safeParse(request.params.name)
  if (!parsed.success) {
    response.status(400).json({ error: 'Invalid session name' })
    return
  }

  try {
    const meta = await readMeta(request.app.locals.homeDir, parsed.data)
    response.json(meta)
  } catch {
    response.status(500).json({ error: 'Failed to read session metadata' })
  }
})

sessionMetaRouter.put('/:name/meta', async (request, response) => {
  const parsedName = nameSchema.safeParse(request.params.name)
  if (!parsedName.success) {
    response.status(400).json({ error: 'Invalid session name' })
    return
  }

  const parsedBody = metaSchema.safeParse(request.body)
  if (!parsedBody.success) {
    response.status(400).json({ error: 'Invalid metadata payload' })
    return
  }

  try {
    const homeDir = request.app.locals.homeDir
    const existing = await readMeta(homeDir, parsedName.data)
    const merged = { ...existing, ...parsedBody.data }
    await writeMeta(homeDir, parsedName.data, merged)
    response.json(merged)
  } catch {
    response.status(500).json({ error: 'Failed to write session metadata' })
  }
})

sessionMetaRouter.post('/:name/restart', async (request, response) => {
  const parsedName = nameSchema.safeParse(request.params.name)
  if (!parsedName.success) {
    response.status(400).json({ error: 'Invalid session name' })
    return
  }

  try {
    await execFileAsync('tmux', [
      'send-keys',
      '-t',
      parsedName.data,
      'unloved restart',
      'Enter',
    ])
    response.json({ sent: true })
  } catch (error) {
    const tmuxError = error as NodeJS.ErrnoException
    if (tmuxError.code === 'ENOENT') {
      response.status(400).json({ error: 'tmux is not installed' })
      return
    }
    response.status(500).json({ error: 'Failed to send restart command' })
  }
})

export default sessionMetaRouter
