# unloved — CLI Architecture

`packages/cli` — the user-facing entry point.

---

## 1. Purpose

The CLI is the only thing the user directly invokes. It:

1. Parses arguments
2. Resolves project context
3. Boots the server
4. Prints connection info
5. Opens the browser

---

## 2. Folder Structure

```
packages/cli/
├── src/
│   ├── index.ts            # Entry point (commander setup)
│   ├── resolve-project.ts  # Find project root + config
│   ├── detect-clis.ts      # Detect installed LLM CLIs
│   ├── banner.ts           # Startup banner + QR code
│   └── open-browser.ts     # Open default browser
├── bin/
│   └── unloved             # Shebang wrapper → dist/index.js
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## 3. Entry Point — `src/index.ts`

```ts
#!/usr/bin/env node

import { program } from 'commander'
import { resolveProject } from './resolve-project.js'
import { detectClis } from './detect-clis.js'
import { createServer } from '@unloved/server'
import { printBanner } from './banner.js'
import { openBrowser } from './open-browser.js'

program
  .name('unloved')
  .description('AI coding cockpit')
  .option('-p, --port <port>', 'server port', '7331')
  .option('-c, --config <path>', 'config file path')
  .option('--preview <url>', 'preview URL override')
  .option('--cli <name>', 'default CLI to spawn')
  .action(async (opts) => {
    const project = await resolveProject(opts.config)
    const clis = await detectClis()
    const server = await createServer({
      port: Number(opts.port),
      project,
      clis,
      previewUrl: opts.preview,
      defaultCli: opts.cli,
    })
    printBanner(server)
    openBrowser(server.url)
  })

program.parse()
```

---

## 4. Project Resolution — `src/resolve-project.ts`

**Logic:**

1. If `--config` provided, use that path
2. Otherwise, check cwd for `unloved.config.json`
3. Walk up directories until found
4. If none found, use defaults

**Returns:**

```ts
interface ProjectContext {
  root: string              // absolute path to project root
  config: Config            // parsed + validated config
  configPath: string | null // path to config file (null if defaults)
}
```

Config is validated with Zod schema from `@unloved/shared`.

---

## 5. CLI Detection — `src/detect-clis.ts`

Checks for known LLM CLIs using `execFile('which', [name])`.

**Known CLIs:**

```ts
const KNOWN_CLIS = ['claude', 'codex', 'gemini', 'opencode'] as const
```

**Returns:**

```ts
interface DetectedCli {
  name: string
  path: string  // absolute path from `which`
}
```

Only CLIs that resolve successfully are included.

---

## 6. Banner — `src/banner.ts`

Prints on startup:

```
  unloved v0.1.0

  Server:    http://localhost:7331
  Network:   http://192.168.1.42:7331
  Preview:   http://localhost:3000

  CLIs:      claude, codex

  Press Ctrl+C to stop
```

Network address auto-detected from OS interfaces for LAN access.

---

## 7. Build Config — `tsup.config.ts`

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  clean: true,
  dts: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
})
```

---

## 8. Package Manifest — `package.json`

```json
{
  "name": "unloved",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "unloved": "./dist/index.js"
  },
  "dependencies": {
    "@unloved/server": "workspace:*",
    "@unloved/shared": "workspace:*",
    "commander": "^13",
    "chalk": "^5",
    "open": "^10"
  }
}
```

---

## 9. Error Handling

- If no CLIs detected: warn but continue (user can install later)
- If config invalid: print validation errors and exit with code 1
- If port in use: print error with suggestion to use `--port`
- Server crash: propagate error, clean up PTY processes
