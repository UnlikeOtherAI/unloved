import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { SessionMeta } from '@unloved/shared'

const SESSION_NAME_RE = /^[\w.-]+$/

export function getHomeDir(): string {
  return resolve(process.env.UNLOVED_HOME ?? resolve(process.env.HOME ?? '', '.unloved'))
}

export async function ensureHome(): Promise<string> {
  const homeDir = getHomeDir()
  await mkdir(resolve(homeDir, 'sessions'), { recursive: true })
  return homeDir
}

function validateSessionName(session: string): void {
  if (!SESSION_NAME_RE.test(session)) {
    console.error(`Error: Invalid session name "${session}". Use only letters, numbers, dots, hyphens, and underscores.`)
    process.exit(1)
  }
}

export function getMetaPath(homeDir: string, session: string): string {
  validateSessionName(session)
  return resolve(homeDir, 'sessions', session, 'meta.json')
}

export async function readSessionMeta(homeDir: string, session: string): Promise<SessionMeta> {
  try {
    const content = await readFile(getMetaPath(homeDir, session), 'utf-8')
    return JSON.parse(content) as SessionMeta
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException
    if (fileError.code === 'ENOENT') return {}
    throw error
  }
}

export async function writeSessionMeta(
  homeDir: string,
  session: string,
  meta: SessionMeta,
): Promise<void> {
  const dir = resolve(homeDir, 'sessions', session)
  await mkdir(dir, { recursive: true })
  await writeFile(resolve(dir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf-8')
}
