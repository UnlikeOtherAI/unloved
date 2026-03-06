import type { ParsedArgs } from '../parse-flags'
import { getHomeDir, readSessionMeta, writeSessionMeta } from '../home'
import { detectTmuxSession } from '../detect-session'

export async function urlCommand(args: ParsedArgs): Promise<void> {
  let sessionName: string | undefined | null
  let url: string | undefined

  if (args.positional.length === 2) {
    sessionName = args.positional[0]
    url = args.positional[1]
  } else if (args.positional.length === 1) {
    url = args.positional[0]
    sessionName = await detectTmuxSession()
  }

  if (!sessionName) {
    console.error('Error: No session name provided and not in a tmux session')
    process.exit(1)
  }

  if (!url) {
    console.error('Usage: unloved url [session] <url>')
    process.exit(1)
  }

  const homeDir = getHomeDir()
  const meta = await readSessionMeta(homeDir, sessionName)
  meta.previewUrl = url
  await writeSessionMeta(homeDir, sessionName, meta)

  console.log(`Preview URL set to ${url} for session "${sessionName}"`)
}
