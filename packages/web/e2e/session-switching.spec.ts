import { test, expect } from './fixtures'
import { execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const API = 'http://localhost:6250'

test('switching sessions updates header, terminal, and preview', async ({ page, tmuxSession }) => {
  // Create a second session
  const second = `test-${randomBytes(4).toString('hex')}`
  execFileSync('tmux', ['new-session', '-d', '-s', second, '-x', '120', '-y', '30'])

  // Set different metadata
  await fetch(`${API}/api/sessions/${tmuxSession}/meta`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ previewUrl: 'http://localhost:6250/api/health' }),
  })

  try {
    await page.goto('/')
    const sidebar = page.locator('aside')
    await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })
    await expect(sidebar.getByText(second)).toBeVisible({ timeout: 10_000 })

    // Select first session (has preview URL)
    await sidebar.getByText(tmuxSession).click()
    const header = page.locator('header')
    await expect(header.getByText(tmuxSession)).toBeVisible()
    await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('iframe[title="Preview"]')).toBeVisible({ timeout: 10_000 })

    // Switch to second session (no preview URL)
    await sidebar.getByText(second).click()
    await expect(header.getByText(second)).toBeVisible()
    await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })

    // No preview for second session
    await page.waitForTimeout(500)
    await expect(page.locator('iframe[title="Preview"]')).toHaveCount(0)
  } finally {
    try {
      execFileSync('tmux', ['kill-session', '-t', second], { stdio: 'ignore' })
    } catch {
      // ok
    }
    const metaDir = join(
      process.env.UNLOVED_HOME ?? join(homedir(), '.unloved'),
      'sessions',
      second,
    )
    try {
      rmSync(metaDir, { recursive: true, force: true })
    } catch {
      // ok
    }
  }
})

test('disconnect from active session returns to welcome state', async ({
  page,
  tmuxSession,
}) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()
  await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })

  // Click disconnect
  await page.getByLabel('Disconnect').click()

  // Should be back to welcome state — no terminal, welcome card visible
  await expect(page.locator('.xterm')).toHaveCount(0, { timeout: 5_000 })
  await expect(page.getByRole('heading', { name: 'unloved' })).toBeVisible()
})
