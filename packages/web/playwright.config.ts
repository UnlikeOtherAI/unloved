import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: 'node ../../packages/cli/dist/index.js start --port 6250',
    port: 6250,
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
  use: {
    baseURL: 'http://localhost:6250',
  },
})
