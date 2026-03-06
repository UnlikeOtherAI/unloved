# unloved — Tech Stack

Complete technology decisions and implementation details.

---

## 1. Monorepo Structure

**Package manager:** pnpm (workspaces)

```
unloved/
├── packages/
│   ├── cli/          # CLI entry point + launcher
│   ├── server/       # Express + WebSocket + PTY backend
│   ├── web/          # React + Vite frontend
│   └── shared/       # Shared types, constants, protocol definitions
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

All packages are TypeScript. Shared types prevent protocol drift between server and clients.

---

## 2. CLI — `packages/cli`

**Runtime:** Node.js (>=20)

**Language:** TypeScript, compiled with `tsup` to a single CJS/ESM bundle.

**Dependencies:**

| Package     | Purpose                         |
| ----------- | ------------------------------- |
| `commander` | CLI argument parsing            |
| `chalk`     | Terminal coloring               |
| `open`      | Opens browser after server boot |

**Entry point:** `bin/unloved`

**Responsibilities:**

1. Parse CLI flags (`--port`, `--config`, `--preview`, `--cli`)
2. Resolve project root (walk up to find `unloved.config.json` or use cwd)
3. Boot the server (import from `@unloved/server`)
4. Print connection info (URL, QR code for mobile)
5. Open browser

**Build:**

```sh
tsup src/index.ts --format esm --dts
```

**Published as:** `unloved` on npm, with `bin` field pointing to compiled output.

---

## 3. Server — `packages/server`

**Runtime:** Node.js (>=20)

**Language:** TypeScript

**Dependencies:**

| Package      | Purpose                              |
| ------------ | ------------------------------------ |
| `express`    | HTTP server (REST endpoints)         |
| `ws`         | WebSocket server (device comms)      |
| `node-pty`   | Pseudoterminal for LLM CLIs         |
| `chokidar`   | Config file watching                 |
| `nanoid`     | Session/device ID generation         |
| `zod`        | Config validation                    |

**Responsibilities:**

- Manage PTY sessions (spawn, buffer, broadcast)
- WebSocket message routing
- REST API for build triggers, config, device list
- Config file watching + hot reload
- CLI detection (`which` lookups)

**Build:** `tsup` — outputs ESM, consumed by CLI package.

---

## 4. Web — `packages/web`

**Framework:** React 19 + Vite

**Language:** TypeScript

**Dependencies:**

| Package           | Purpose                    |
| ----------------- | -------------------------- |
| `@xterm/xterm`    | Terminal rendering         |
| `@xterm/addon-fit`| Auto-resize terminal       |
| `@xterm/addon-webgl` | GPU-accelerated render |
| `zustand`         | State management           |
| `tailwindcss` v4  | Styling                    |
| `lucide-react`    | Icons                      |
| `react-resizable-panels` | Resizable split layout |

**Fonts:**

- `Inter` — UI text (loaded via `@fontsource/inter`)
- `JetBrains Mono` — terminal (loaded via `@fontsource/jetbrains-mono`)

**Dev server:** Vite dev server during development. In production, built static assets served by the unloved server via Express.

---

## 5. Shared — `packages/shared`

Pure TypeScript — no runtime dependencies.

**Contains:**

- WebSocket message type definitions (discriminated union)
- Config schema (Zod)
- Device type enums
- Layout mode enums
- Session types
- Build event types

Example:

```ts
// packages/shared/src/protocol.ts
export type ServerMessage =
  | { type: 'TERMINAL_OUTPUT'; data: string }
  | { type: 'BUFFER_REPLAY'; lines: string[] }
  | { type: 'BUILD_STARTED' }
  | { type: 'BUILD_COMPLETE' }
  | { type: 'BUILD_FAILED'; error: string }
  | { type: 'CONFIG_UPDATED'; config: Config }
  | { type: 'DEVICE_CONNECTED'; device: DeviceInfo }
  | { type: 'DEVICE_DISCONNECTED'; deviceId: string }

export type ClientMessage =
  | { type: 'TERMINAL_INPUT'; data: string }
  | { type: 'REGISTER_DEVICE'; deviceType: DeviceType }
  | { type: 'TRIGGER_REBUILD' }
```

---

## 6. Tailwind Implementation

### Setup (v4)

Tailwind v4 uses CSS-first configuration. No `tailwind.config.ts` file needed.

**Main CSS file** (`packages/web/src/index.css`):

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-bg: #F6F7F9;
  --color-bg-dark: #0B0F19;
  --color-sidebar: #F3F4F6;
  --color-sidebar-hover: #E9EBF0;
  --color-sidebar-active: #FFFFFF;
  --color-card: #FFFFFF;
  --color-card-dark: #111827;
  --color-divider: #E6E8EC;
  --color-divider-dark: #1F2937;
  --color-accent: #5B6BFF;
  --color-accent-hover: #4C59E8;
  --color-accent-dark: #6D7DFF;
  --color-text-primary: #0F172A;
  --color-text-secondary: #6B7280;
  --color-text-dark: #E5E7EB;
  --color-terminal-bg: #0D1117;
  --color-terminal-text: #E6EDF3;
  --color-preview-toolbar: #F8FAFC;

  /* Border Radius */
  --radius-card: 20px;
  --radius-button: 12px;
  --radius-input: 14px;
  --radius-modal: 24px;
  --radius-sidebar: 10px;
  --radius-preview: 8px;
  --radius-console-input: 16px;

  /* Shadows */
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 12px 32px rgba(0, 0, 0, 0.12);
  --shadow-float: 0 10px 40px rgba(0, 0, 0, 0.12);
  --shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.05);

  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing (layout-specific) */
  --sidebar-width: 260px;
  --header-height: 64px;
  --console-width: 420px;
  --preview-min-width: 600px;
}
```

### Usage Examples

```tsx
// Sidebar
<aside className="w-[--sidebar-width] bg-sidebar border-r border-divider p-4">

// Header
<header className="h-[--header-height] px-6 flex items-center">

// Card
<div className="bg-card rounded-card shadow-card">

// Primary button
<button className="h-9 px-3.5 rounded-button bg-accent text-white
                    hover:bg-accent-hover transition-colors duration-150">

// Input field
<input className="h-10 rounded-input border border-divider px-3.5 text-base
                   focus:border-accent focus:ring-3 focus:ring-accent/20" />

// Terminal container
<div className="bg-terminal-bg text-terminal-text rounded-button p-4 font-mono text-[13px]">

// Console input
<div className="h-14 rounded-console-input shadow-card p-4 text-sm">
```

### Dark Mode

Use Tailwind's `dark:` variant with class strategy:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

```tsx
<div className="bg-bg dark:bg-bg-dark">
<div className="bg-card dark:bg-card-dark">
<p className="text-text-primary dark:text-text-dark">
<div className="border-divider dark:border-divider-dark">
```

### Responsive Breakpoints

| Breakpoint | Target  | Width   |
| ---------- | ------- | ------- |
| default    | Phone   | < 768px |
| `md`       | Tablet  | >= 768px |
| `lg`       | Desktop | >= 1024px |

Phone layout hides sidebar and uses toggle:

```tsx
<aside className="hidden lg:block w-[--sidebar-width]">
```

---

## 7. Build & Dev

### Development

```sh
pnpm dev          # runs all packages concurrently
pnpm dev:server   # server only
pnpm dev:web      # vite dev server only
```

### Production Build

```sh
pnpm build        # builds all packages
```

Build order (enforced by pnpm workspace dependencies):

1. `@unloved/shared`
2. `@unloved/server`
3. `@unloved/web`
4. `@unloved/cli`

### Testing

| Package | Runner  |
| ------- | ------- |
| server  | vitest  |
| web     | vitest  |
| shared  | vitest  |
| cli     | vitest  |

---

## 8. Node.js Specifics

### PTY Spawning

`node-pty` is a native module. Requires:

- Python 3 + build tools for compilation
- On macOS: Xcode Command Line Tools

### Process Model

Single Node.js process runs:

- Express HTTP server
- WebSocket server (shares HTTP server via `upgrade`)
- PTY child processes (one per session)
- Config file watcher

No clustering needed — target is local development use.

### Security Considerations

- Build commands executed via `execFile` (not `exec`) to prevent shell injection
- Config file validated with Zod before applying
- WebSocket connections optionally authenticated via pairing code
- Server binds to `0.0.0.0` by default for LAN access, configurable to `127.0.0.1`
