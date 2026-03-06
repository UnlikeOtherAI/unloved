import { createConnection } from 'node:net'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startServer } from '@unloved/server'
import type { ParsedArgs } from '../parse-flags'
import { ensureHome, writeSessionMeta } from '../home'
import { printBanner } from '../banner'
import { detectTmuxSession } from '../detect-session'
import { syncRepo } from '../sync'
import { openBrowser } from '../open-browser'

function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ port }, () => {
      socket.destroy()
      resolve(true)
    })
    socket.on('error', () => {
      resolve(false)
    })
  })
}

export async function startCommand(args: ParsedArgs): Promise<void> {
  const port = args.flags.port ? Number(args.flags.port) : 6200
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    console.error('Error: --port must be a number between 1 and 65535')
    process.exit(1)
  }
  const sessionName = args.positional[0] ?? (await detectTmuxSession()) ?? undefined

  if (await isPortInUse(port)) {
    console.log(`unloved is already running at http://localhost:${port}`)
    if (!args.flags['no-open']) {
      openBrowser(`http://localhost:${port}`)
    }
    process.exit(0)
  }

  const homeDir = await ensureHome()

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const bundledDir = resolve(__dirname, '..', 'public')

  let staticDir = bundledDir
  if (!args.flags['no-sync']) {
    const syncedDir = syncRepo(homeDir)
    if (syncedDir) {
      staticDir = syncedDir
    }
  }

  startServer({ homeDir, staticDir, port })

  printBanner(port)

  if (!args.flags['no-open']) {
    openBrowser(`http://localhost:${port}`)
  }

  if (sessionName) {
    const meta: Record<string, string> = {
      createdAt: new Date().toISOString(),
    }
    if (args.flags.url && typeof args.flags.url === 'string') meta.previewUrl = args.flags.url
    if (args.flags.restart && typeof args.flags.restart === 'string')
      meta.restartCommand = args.flags.restart
    meta.projectDir = process.cwd()

    await writeSessionMeta(homeDir, sessionName, meta)
    console.log(`  Session: ${sessionName}`)
  }
}
