# Spec: Welcome Screen

## Goal

Build the welcome/landing screen — the first thing users see when loading the app. Composes the UI components and stores into a complete screen.

## What to Create

All in `packages/web/src/components/welcome/`.

### `GradientBackground.tsx`

Full viewport background with three blurred gradient blobs for the empty-state aesthetic.

Implementation: absolute-positioned `<div>` elements with large border-radius, blur filter, and gradient colors from tokens:
- Top blob: `bg-gradient-top`, positioned top-center, ~400px, blur 120px
- Middle blob: `bg-gradient-mid`, positioned center, ~500px, blur 120px, opacity ~0.3
- Bottom blob: gradient from `gradient-pink` to `gradient-red`, positioned bottom-right, ~350px, blur 120px, opacity ~0.4

Container: `fixed inset-0 -z-10 overflow-hidden`

Dark mode: reduce blob opacity further, shift top blob to a darker shade.

### `TmuxOptions.tsx`

Props: none (reads from session store).

Layout: horizontal row with:
1. Checkbox: "Use tmux" — bound to `useTmux` in session store
2. Input: session name — bound to `sessionName`, disabled when `useTmux` is false, placeholder "Session name..."

When `useTmux` unchecked, input is visually dimmed and disabled.

### `SessionSelector.tsx`

Props: none (reads from session store).

On mount: call `fetchSessions()`.

Render:
- If `existingSessions.length > 0`: render `<Select>` with sessions as options, placeholder "Select existing session"
- If `existingSessions.length === 0`: render subtle text "No tmux sessions found" in `text-text-secondary`

### `WelcomeCard.tsx`

The main card in the center of the screen. Contains all welcome screen controls.

Layout (vertical, centered):
1. **Logo placeholder:** 48x48 black square with `rounded-button`
2. **Title:** "unloved" in heading size (28px, weight 600)
3. **Subtitle:** "Local AI coding cockpit" in `text-text-secondary`
4. **Spacer** (24px)
5. **"Start a new session"** button — primary variant, full width
6. **Divider** — horizontal line with "or" text centered
7. **TmuxOptions** component
8. **SessionSelector** component

Card styling: `bg-card dark:bg-card-dark rounded-card shadow-card p-8 w-full max-w-md`

### `WelcomeScreen.tsx`

Top-level screen component.

Layout:
- `GradientBackground` (behind everything)
- `ThemeToggle` (fixed top-right, already positioned by its own styles)
- `WelcomeCard` centered in viewport: `min-h-screen flex items-center justify-center p-4`

## What to Update

### `packages/web/src/App.tsx`

Replace placeholder with:
1. On mount: call `hydrate()` from theme store, call `fetchSessions()` from session store
2. Render `<WelcomeScreen />`

## Key Decisions

- Gradient blobs use CSS blur + opacity, not SVG or canvas.
- Card is max-width 448px (`max-w-md`), centered both horizontally and vertically.
- Logo is a placeholder black square — will be replaced with actual logo later.
- "Start a new session" button is non-functional for now (no onClick handler).
- SessionSelector only shows tmux sessions; it doesn't create sessions.
- The "or" divider is a visual separator between primary action and tmux options.

## Verification

1. `pnpm dev` starts both server (7331) and web (5173)
2. Browser at `http://localhost:5173` shows the welcome screen
3. Gradient background renders with colored blobs
4. Card is centered with logo, title, button
5. "Use tmux" checkbox enables/disables session name input
6. Session selector shows tmux sessions (or "No tmux sessions found")
7. Dark/light toggle in top-right works
8. After toggle: `cat unloved.config.json` reflects the chosen theme
9. Page reload preserves theme choice
