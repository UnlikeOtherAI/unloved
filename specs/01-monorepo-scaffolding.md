# Spec: Monorepo Scaffolding

## Goal

Set up the root monorepo configuration and the `@unloved/shared` package with all cross-package types needed for the welcome screen.

## What to Create

### Root Files

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - "packages/*"
```

**`package.json`** (root):
- `name`: `unloved-monorepo` (private)
- `scripts`: `dev` (`pnpm -r --parallel dev`), `build` (`pnpm -r build`)
- `devDependencies`: `typescript` (^5.7)

**`tsconfig.base.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist"
  }
}
```

### `packages/shared`

**`package.json`:**
- `name`: `@unloved/shared`
- `type`: `module`
- `main`: `src/index.ts` (source-level imports during dev)
- No runtime dependencies

**`tsconfig.json`:** extends `../../tsconfig.base.json`

**`src/config.ts`:**
```ts
export type ThemeMode = 'light' | 'dark'

export interface AppConfig {
  theme: ThemeMode
}

export const DEFAULT_CONFIG: AppConfig = {
  theme: 'light',
}
```

**`src/tmux.ts`:**
```ts
export interface TmuxSession {
  name: string
  windows: number
  created: string
  attached: boolean
}
```

**`src/index.ts`:** re-exports everything from `config.ts` and `tmux.ts`.

## Verification

- `pnpm install` succeeds from root
- TypeScript compiles without errors: `pnpm -r exec tsc --noEmit`
- Shared types importable from other packages via `@unloved/shared`
