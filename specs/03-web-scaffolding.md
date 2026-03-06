# Spec: Web Package Scaffolding

## Goal

Create `@unloved/web` — React 19 + Vite + Tailwind v4 app with all design tokens configured. No components yet, just the shell that renders.

## What to Create

### Package Setup

**`packages/web/package.json`:**
- `name`: `@unloved/web`
- `type`: `module`
- Dependencies: `react`, `react-dom`, `zustand`, `lucide-react`
- DevDependencies: `@types/react`, `@types/react-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `typescript`
- Font packages: `@fontsource/inter`
- `scripts.dev`: `vite`
- `scripts.build`: `vite build`
- Workspace dep: `@unloved/shared: workspace:*`

**`packages/web/tsconfig.json`:**
- Extends `../../tsconfig.base.json`
- Add `"jsx": "react-jsx"`, `"noEmit": true`
- Include `src`

**`packages/web/vite.config.ts`:**
- React plugin
- Tailwind v4 plugin (`@tailwindcss/vite`)
- Server proxy: `/api` → `http://localhost:7331`
- Dev server port: 5173

**`packages/web/index.html`:**
- Standard Vite HTML shell
- `<div id="root">`
- `<script type="module" src="/src/main.tsx">`
- Title: "unloved"

### Tailwind & Styles

**`packages/web/src/index.css`:**

Full Tailwind v4 config with all design tokens from `docs/ui.md` and `docs/tech-stack.md`:

```css
@import "tailwindcss";
@import "@fontsource/inter/latin.css";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
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
  --color-accent-ring: rgba(91,107,255,0.2);
  --color-text-primary: #0F172A;
  --color-text-secondary: #6B7280;
  --color-text-dark: #E5E7EB;
  --color-terminal-bg: #0D1117;
  --color-terminal-text: #E6EDF3;
  --color-preview-toolbar: #F8FAFC;

  --radius-card: 20px;
  --radius-button: 12px;
  --radius-input: 14px;
  --radius-modal: 24px;
  --radius-sidebar: 10px;
  --radius-preview: 8px;
  --radius-console-input: 16px;

  --shadow-card: 0 8px 24px rgba(0,0,0,0.08);
  --shadow-hover: 0 12px 32px rgba(0,0,0,0.12);
  --shadow-float: 0 10px 40px rgba(0,0,0,0.12);
  --shadow-subtle: 0 2px 8px rgba(0,0,0,0.05);

  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --sidebar-width: 260px;
  --header-height: 64px;
  --console-width: 420px;
  --preview-min-width: 600px;

  /* Gradient colors for empty states */
  --color-gradient-top: #E7EAF3;
  --color-gradient-mid: #5A7CFF;
  --color-gradient-pink: #FF4DA3;
  --color-gradient-red: #FF4D4D;
}
```

### Entry Point

**`packages/web/src/main.tsx`:**
```tsx
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(<App />)
```

**`packages/web/src/App.tsx`:**
- Placeholder: render a `<div>` with "unloved" text centered, using design tokens
- This will be replaced in the welcome screen task

## Verification

- `pnpm install` succeeds
- `pnpm --filter @unloved/web dev` starts Vite dev server
- Browser at `http://localhost:5173` shows the placeholder
- Tailwind classes work (visible styling from design tokens)
- `/api/health` proxy works through Vite → server
