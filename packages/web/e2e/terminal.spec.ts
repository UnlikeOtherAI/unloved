import { test, expect } from './fixtures'

test('terminal panel appears when session is active', async ({ page, tmuxSession }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()

  // Terminal container should be present (xterm renders into a div with class xterm)
  await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })
})

test('terminal container has xterm DOM elements', async ({ page, tmuxSession }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()

  await expect(page.locator('.xterm-screen')).toBeVisible({ timeout: 10_000 })
  await expect(page.locator('.xterm-viewport')).toBeAttached({ timeout: 5_000 })
})

test('typing echo hello produces output', async ({ page, tmuxSession }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()
  await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })

  // Small delay for WebSocket to connect
  await page.waitForTimeout(1000)

  // Type into the terminal (xterm captures keyboard events)
  await page.locator('.xterm-helper-textarea').pressSequentially('echo hello\n', { delay: 50 })

  // Wait for output to appear in the terminal
  await expect(page.locator('.xterm-rows')).toContainText('hello', { timeout: 10_000 })
})

test('terminal reconnects on page refresh (replay buffer)', async ({ page, tmuxSession }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()
  await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })
  await page.waitForTimeout(1000)

  // Type something
  await page.locator('.xterm-helper-textarea').pressSequentially('echo replay-test\n', { delay: 50 })
  await expect(page.locator('.xterm-rows')).toContainText('replay-test', { timeout: 10_000 })

  // Refresh and re-select session
  await page.reload()
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })
  await sidebar.getByText(tmuxSession).click()
  await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })

  // Replay buffer should show previous output
  await expect(page.locator('.xterm-rows')).toContainText('replay-test', { timeout: 10_000 })
})
