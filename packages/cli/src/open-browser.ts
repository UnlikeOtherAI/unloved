import { execFile } from 'node:child_process'

export function openBrowser(url: string): void {
  const cmd =
    process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start'
    : 'xdg-open'

  const args = process.platform === 'win32' ? ['', url] : [url]

  const child = execFile(cmd, args, { stdio: 'ignore' })
  child.unref()
}
