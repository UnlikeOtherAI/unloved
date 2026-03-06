import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export async function detectTmuxSession(): Promise<string | null> {
  if (!process.env.TMUX) return null

  try {
    const { stdout } = await execFileAsync('tmux', ['display-message', '-p', '#{session_name}'])
    const name = stdout.trim()
    return name || null
  } catch {
    return null
  }
}
