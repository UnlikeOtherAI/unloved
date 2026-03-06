import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Router, type Router as ExpressRouter } from 'express'
import { DEFAULT_CONFIG, type AppConfig } from '@unloved/shared'
import { z } from 'zod'

const configRouter: ExpressRouter = Router()
const configPath = resolve(process.env.UNLOVED_ROOT ?? process.cwd(), 'unloved.config.json')

const patchSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
})

const readConfig = async (): Promise<AppConfig> => {
  try {
    const content = await readFile(configPath, 'utf-8')
    return { ...DEFAULT_CONFIG, ...(JSON.parse(content) as Partial<AppConfig>) }
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException

    if (fileError.code === 'ENOENT') {
      return DEFAULT_CONFIG
    }

    throw error
  }
}

configRouter.get('/', async (_request, response) => {
  try {
    const config = await readConfig()
    response.json(config)
  } catch {
    response.status(500).json({ error: 'Failed to read config' })
  }
})

configRouter.patch('/', async (request, response) => {
  const parsedBody = patchSchema.safeParse(request.body)

  if (!parsedBody.success) {
    response.status(400).json({ error: 'Invalid config payload' })
    return
  }

  try {
    const config = await readConfig()
    const updatedConfig = { ...config, ...parsedBody.data }
    await writeFile(configPath, `${JSON.stringify(updatedConfig, null, 2)}\n`, 'utf-8')

    response.json(updatedConfig)
  } catch {
    response.status(500).json({ error: 'Failed to write config' })
  }
})

export default configRouter
