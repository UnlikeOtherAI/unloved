import { test, expect } from './fixtures'

test('no preview panel when session has no previewUrl', async ({ page, tmuxSession }) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()
  await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })

  // Preview iframe should not exist
  await expect(page.locator('iframe[title="Preview"]')).toHaveCount(0)
})

test('set previewUrl via API and preview iframe appears', async ({
  page,
  tmuxSession,
  sessionMeta,
}) => {
  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()
  await expect(page.locator('.xterm')).toBeVisible({ timeout: 10_000 })

  // Set preview URL via API
  await sessionMeta(tmuxSession, { previewUrl: 'http://localhost:6250/api/health' })

  // Wait for polling to pick up the new URL
  await expect(page.locator('iframe[title="Preview"]')).toBeVisible({ timeout: 10_000 })
})

test('header shows URL bar when preview is active', async ({
  page,
  tmuxSession,
  sessionMeta,
}) => {
  const previewUrl = 'http://localhost:6250/api/health'
  await sessionMeta(tmuxSession, { previewUrl })

  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })

  await sidebar.getByText(tmuxSession).click()

  // URL bar should appear in the header
  const header = page.locator('header')
  await expect(header.getByTestId('header-url')).toContainText(previewUrl, { timeout: 10_000 })
})

test('refresh button reloads iframe', async ({
  page,
  tmuxSession,
  sessionMeta,
}) => {
  const previewUrl = 'http://localhost:6250/api/health'
  await sessionMeta(tmuxSession, { previewUrl })

  await page.goto('/')
  const sidebar = page.locator('aside')
  await expect(sidebar.getByText(tmuxSession)).toBeVisible({ timeout: 10_000 })
  await sidebar.getByText(tmuxSession).click()

  await expect(page.locator('iframe[title="Preview"]')).toBeVisible({ timeout: 10_000 })

  // Click refresh in header
  await page.getByLabel('Refresh preview').click()

  // Iframe should still be visible after refresh cycle
  await expect(page.locator('iframe[title="Preview"]')).toBeVisible({ timeout: 5_000 })
})
