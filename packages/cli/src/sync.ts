import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

export function syncRepo(homeDir: string): string | null {
  const repoDir = resolve(homeDir, 'repo')
  const webDist = resolve(repoDir, 'packages', 'web', 'dist')

  try {
    if (!existsSync(repoDir)) {
      console.log('  Cloning unloved repo...')
      execFileSync('git', ['clone', 'https://github.com/UnlikeOtherAI/unloved.git', repoDir], {
        stdio: 'inherit',
      })
    } else {
      console.log('  Pulling latest...')
      execFileSync('git', ['pull', 'origin', 'main'], {
        cwd: repoDir,
        stdio: 'inherit',
      })
    }

    console.log('  Installing dependencies...')
    execFileSync('pnpm', ['install', '--frozen-lockfile'], {
      cwd: repoDir,
      stdio: 'inherit',
    })

    console.log('  Building...')
    execFileSync('pnpm', ['build'], {
      cwd: repoDir,
      stdio: 'inherit',
    })

    if (existsSync(webDist)) {
      return webDist
    }

    console.warn('  Warning: build succeeded but web dist not found, using bundled assets')
    return null
  } catch {
    console.warn('  Warning: sync failed, falling back to bundled assets')
    return null
  }
}
