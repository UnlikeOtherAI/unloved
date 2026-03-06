import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { ParsedArgs } from '../parse-flags'
import { getHomeDir, readSessionMeta } from '../home'
import { detectTmuxSession } from '../detect-session'

const execFileAsync = promisify(execFile)

export async function restartCommand(args: ParsedArgs): Promise<void> {
  const sessionName = args.positional[0] ?? (await detectTmuxSession())

  if (!sessionName) {
    console.error('Error: No session name provided and not in a tmux session')
    process.exit(1)
  }

  const homeDir = getHomeDir()
  const meta = await readSessionMeta(homeDir, sessionName)

  if (!meta.restartCommand) {
    console.error(`Error: No restart command configured for session "${sessionName}"`)
    console.error('Set one with: unloved meta restartCommand="your command"')
    process.exit(1)
  }

  console.log(`Restarting: ${meta.restartCommand}`)

  try {
    const { stdout, stderr } = await execFileAsync('sh', ['-c', meta.restartCommand], {
      cwd: meta.projectDir ?? process.cwd(),
      env: process.env,
    })
    if (stdout) process.stdout.write(stdout)
    if (stderr) process.stderr.write(stderr)
  } catch (error) {
    const execError = error as NodeJS.ErrnoException & { stdout?: string; stderr?: string }
    if (execError.stdout) process.stdout.write(execError.stdout)
    if (execError.stderr) process.stderr.write(execError.stderr)
    process.exit(1)
  }
}
