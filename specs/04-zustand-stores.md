# Spec: Zustand Stores

## Goal

Create two Zustand stores for the welcome screen: theme management and session management.

## What to Create

### `packages/web/src/stores/theme.ts`

```ts
interface ThemeStore {
  mode: ThemeMode        // from @unloved/shared
  setMode: (mode: ThemeMode) => void
  toggle: () => void
  hydrate: () => Promise<void>
}
```

**Behavior:**

- `setMode(mode)`:
  1. Update store state
  2. Add/remove `dark` class on `document.documentElement`
  3. Fire `PATCH /api/config` with `{ theme: mode }` (fire-and-forget, don't await)

- `toggle()`: calls `setMode` with opposite of current mode

- `hydrate()`:
  1. `GET /api/config` from server
  2. Apply the returned theme mode via `setMode`
  3. Called once on app mount

### `packages/web/src/stores/session.ts`

```ts
interface SessionStore {
  useTmux: boolean
  sessionName: string
  existingSessions: TmuxSession[]   // from @unloved/shared
  selectedSession: string | null
  setUseTmux: (v: boolean) => void
  setSessionName: (v: string) => void
  setSelectedSession: (v: string | null) => void
  fetchSessions: () => Promise<void>
}
```

**Behavior:**

- `fetchSessions()`:
  1. `GET /api/tmux/sessions`
  2. Update `existingSessions` with response
  3. Called on mount

- Simple setters for the rest, no side effects

## Key Decisions

- Theme persistence is fire-and-forget — don't block UI on server write.
- `hydrate()` is the only async operation at startup.
- Session store is local state only — no server persistence for session selection.

## Verification

- Stores export correctly and are importable
- `toggle()` adds/removes `dark` class on `<html>`
- `hydrate()` fetches config and applies theme
- `fetchSessions()` populates session list from server
- TypeScript compiles without errors
