# Spec: Server Package

## Goal

Create `@unloved/server` — a minimal Express server with three route groups: health, tmux session listing, and config persistence.

## What to Create

### Package Setup

**`packages/server/package.json`:**
- `name`: `@unloved/server`
- `type`: `module`
- Dependencies: `express`, `cors`, `zod`
- DevDependencies: `@types/express`, `@types/cors`, `tsup`, `tsx`
- `scripts.dev`: `tsx --watch src/index.ts`
- `scripts.build`: `tsup src/index.ts --format esm --dts`
- Workspace dep: `@unloved/shared: workspace:*`

**`packages/server/tsconfig.json`:** extends `../../tsconfig.base.json`

**`packages/server/tsup.config.ts`:** ESM output, dts generation

### Source Files

**`src/app.ts`:**
- Create Express app
- CORS middleware (allow `http://localhost:5173`)
- JSON body parsing
- Mount routes: `/api/health`, `/api/tmux`, `/api/config`
- Export the app

**`src/index.ts`:**
- Import app from `./app`
- Listen on port 7331
- Log startup message
- Export `createServer()` for programmatic use

**`src/routes/health.ts`:**
- `GET /api/health` → `{ status: 'ok' }`

**`src/routes/tmux.ts`:**
- `GET /api/tmux/sessions`
- Runs `execFile('tmux', ['list-sessions', '-F', '#{session_name}\t#{session_windows}\t#{session_created}\t#{session_attached}'])`
- Parses output into `TmuxSession[]` (from `@unloved/shared`)
- Returns empty array `[]` if tmux is not installed or no sessions exist
- Catches errors gracefully (tmux not installed = empty array, not 500)

**`src/routes/config.ts`:**
- Config file path: `unloved.config.json` in process cwd
- `GET /api/config` → reads file, returns parsed JSON. If file missing, returns `DEFAULT_CONFIG` from shared.
- `PATCH /api/config` → validates body with Zod, merges with existing config, writes file. Returns updated config.
- Zod schema: `{ theme: z.enum(['light', 'dark']).optional() }`

## Key Decisions

- Use `execFile` not `exec` for tmux (security — no shell injection).
- Config file uses `fs.readFile`/`fs.writeFile` with `JSON.stringify(config, null, 2)`.
- CORS origin is `http://localhost:5173` (Vite dev server default).
- Server port: 7331.

## Verification

- `pnpm --filter @unloved/server dev` starts without errors
- `curl http://localhost:7331/api/health` → `{"status":"ok"}`
- `curl http://localhost:7331/api/tmux/sessions` → `[]` or session list
- `curl http://localhost:7331/api/config` → `{"theme":"light"}`
- `curl -X PATCH -H 'Content-Type: application/json' -d '{"theme":"dark"}' http://localhost:7331/api/config` → `{"theme":"dark"}`
- `cat unloved.config.json` → `{"theme":"dark"}`
