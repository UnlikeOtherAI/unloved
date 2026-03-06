# unloved

Local multi-device AI coding cockpit for CLI-based LLMs.

`unloved` wraps AI coding CLIs (Claude Code, Codex, Gemini CLI, OpenCode) and exposes them through a web-based terminal UI with a live preview pane — accessible from any device on your local network.

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10 (`npm install -g pnpm`)
- **tmux** (optional — for session management)

## Quick Start

```sh
git clone git@github.com:UnlikeOtherAI/unloved.git
cd unloved
make install
make dev
```

This starts both the server (http://localhost:7331) and the web UI (http://localhost:5173).

## Project Structure

```
unloved/
├── packages/
│   ├── shared/       # Cross-package types (no runtime deps)
│   ├── server/       # Express backend — config, tmux, health APIs
│   └── web/          # React 19 + Vite + Tailwind v4 frontend
├── docs/             # Architecture and design documentation
├── specs/            # Implementation specs (referenced by steroids tasks)
├── AGENTS.md         # Coding standards for LLM agents
└── Makefile
```

## Make Targets

```
make help           Show all available targets
make install        Install all dependencies
make dev            Start server + web in parallel
make server         Start only the server (port 7331)
make web            Start only the web dev server (port 5173)
make build          Build all packages
make typecheck      Run TypeScript type checking
make clean          Remove build artifacts and node_modules
make reset          Clean + reinstall from scratch
```

## Development

### Ports

| Service | Port | URL |
|---------|------|-----|
| Server  | 7331 | http://localhost:7331 |
| Web     | 5173 | http://localhost:5173 |

The Vite dev server proxies `/api` requests to the server, so you only need to open http://localhost:5173.

### Package Dependencies

```
@unloved/shared  ← pure types, no runtime deps
@unloved/server  ← depends on shared
@unloved/web     ← depends on shared
```

Build order is enforced by pnpm workspace protocol: shared first, then server and web.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check — returns `{ status: 'ok' }` |
| GET | `/api/tmux/sessions` | List tmux sessions (empty array if tmux unavailable) |
| GET | `/api/config` | Read app config (theme, etc.) |
| PATCH | `/api/config` | Update app config — persists to `unloved.config.json` |

### Design Tokens

All design tokens (colors, radii, shadows, typography) are defined in `packages/web/src/index.css` using Tailwind v4's CSS-first `@theme` block. See `docs/ui.md` for the full spec.

Dark mode uses the class strategy:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

### Adding a New Component

1. Create the file in the appropriate directory under `packages/web/src/components/`
2. Use design tokens from the `@theme` block — never hardcode colors or radii
3. Support dark mode via `dark:` variant classes
4. Keep files under 500 lines

## Task Management

This project uses [steroids-cli](https://github.com/steroids-cli/steroids) for automated task orchestration.

```sh
steroids tasks --status all    # View all tasks
steroids tasks audit <id>      # View task details and history
steroids sections graph        # View section dependency graph
```

## Documentation

| Document | Contents |
|----------|----------|
| [docs/brief.md](docs/brief.md) | Project vision and goals |
| [docs/architecture.md](docs/architecture.md) | Monorepo structure |
| [docs/ui.md](docs/ui.md) | Pixel-level UI design spec |
| [docs/tech-stack.md](docs/tech-stack.md) | Technology decisions |
| [AGENTS.md](AGENTS.md) | Coding standards for agents |
