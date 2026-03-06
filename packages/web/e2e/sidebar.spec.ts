import { test, expect } from './fixtures'
import { execFileSync } from 'node:child_process'

test('layout renders with sidebar visible', async ({ page }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar).toBeVisible()
})

test('sidebar shows existing tmux sessions', async ({ page, tmuxSession }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })
})

test('creating a new session adds it to sidebar', async ({ page }) => {
  const name = `e2e-create-${Date.now()}`
  await page.goto('/')

  // Click new session button in sidebar
  const sidebar = page.locator('aside')
  await sidebar.getByText('New session').click()
  await sidebar.getByPlaceholder('Session name').fill(name)
  await sidebar.getByRole('button', { name: 'Create' }).click()

  // Session should appear in sidebar
  await expect(page.locator('aside').getByText(name)).toBeVisible({ timeout: 10_000 })

  // Cleanup
  try {
    execFileSync('tmux', ['kill-session', '-t', name], { stdio: 'ignore' })
  } catch {
    // Already dead
  }
})

test('clicking a session highlights it and shows name in header', async ({ page, tmuxSession }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()

  // Header should show session name
  const header = page.locator('header')
  await expect(header.getByText(tmuxSession)).toBeVisible()
})

test('clicking a different session switches focus', async ({ page, tmuxSession }) => {
  // Create a second session
  const second = `test-second-${Date.now()}`
  execFileSync('tmux', ['new-session', '-d', '-s', second, '-x', '120', '-y', '30'])

  try {
    await page.goto('/')
    const sidebar = page.locator('aside')
    await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })
    await expect(sidebar.getByText(second)).toBeVisible({ timeout: 10_000 })

    // Click first session
    await sidebar.getByText(tmuxSession).click()
    const header = page.locator('header')
    await expect(header.getByText(tmuxSession)).toBeVisible()

    // Click second session
    await sidebar.getByText(second).click()
    await expect(header.getByText(second)).toBeVisible()
  } finally {
    try {
      execFileSync('tmux', ['kill-session', '-t', second], { stdio: 'ignore' })
    } catch {
      // ok
    }
  }
})
