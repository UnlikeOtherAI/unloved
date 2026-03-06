import type { ParsedArgs } from '../parse-flags'
import { getHomeDir, readSessionMeta, writeSessionMeta } from '../home'
import { detectTmuxSession } from '../detect-session'

const VALID_META_KEYS = new Set(['previewUrl', 'restartCommand', 'projectDir', 'cliTool', 'createdAt'])

export async function metaCommand(args: ParsedArgs): Promise<void> {
  const assignments: string[] = []
  let sessionName: string | undefined | null

  for (const arg of args.positional) {
    if (arg.includes('=')) {
      assignments.push(arg)
    } else if (!sessionName) {
      sessionName = arg
    }
  }

  if (!sessionName) {
    sessionName = await detectTmuxSession()
  }

  if (!sessionName) {
    console.error('Error: No session name provided and not in a tmux session')
    process.exit(1)
  }

  const homeDir = getHomeDir()
  const meta = await readSessionMeta(homeDir, sessionName)

  if (assignments.length === 0) {
    console.log(JSON.stringify(meta, null, 2))
    return
  }

  for (const assignment of assignments) {
    const eqIndex = assignment.indexOf('=')
    const key = assignment.slice(0, eqIndex)
    const value = assignment.slice(eqIndex + 1)
    if (!VALID_META_KEYS.has(key)) {
      console.error(`Unknown meta key: ${key}`)
      console.error(`Valid keys: ${[...VALID_META_KEYS].join(', ')}`)
      process.exit(1)
    }
    ;(meta as Record<string, string>)[key] = value
  }

  await writeSessionMeta(homeDir, sessionName, meta)
  console.log(JSON.stringify(meta, null, 2))
}
