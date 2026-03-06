import { test as base, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const API = 'http://localhost:6250'

interface TestFixtures {
  tmuxSession: string
  sessionMeta: (name: string, meta: Record<string, string>) => Promise<void>
}

export const test = base.extend<TestFixtures>({
  tmuxSession: async ({}, use) => {
    const name = `test-${randomBytes(4).toString('hex')}`
    execFileSync('tmux', ['new-session', '-d', '-s', name, '-x', '120', '-y', '30'])

    await use(name)

    // Teardown
    try {
      execFileSync('tmux', ['kill-session', '-t', name], { stdio: 'ignore' })
    } catch {
      // Already dead
    }
    const metaDir = join(
      process.env.UNLOVED_HOME ?? join(homedir(), '.unloved'),
      'sessions',
      name,
    )
    try {
      rmSync(metaDir, { recursive: true, force: true })
    } catch {
      // No meta dir
    }
  },

  sessionMeta: async ({}, use) => {
    await use(async (name, meta) => {
      await fetch(`${API}/api/sessions/${encodeURIComponent(name)}/meta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta),
      })
    })
  },
})

export { expect }
