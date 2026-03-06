# unloved — Monorepo Architecture

Folder structure, package boundaries, and dependency graph.

---

## 1. Top-Level Structure

```
unloved/
├── packages/
│   ├── cli/                # CLI entry point
│   ├── server/             # Backend (Express + WS + PTY)
│   ├── web/                # Frontend (React + Vite)
│   └── shared/             # Shared types & protocol
├── docs/                   # Project documentation
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── package.json
├── .gitignore
└── LICENSE
```

---

## 2. Package Dependency Graph

```
@unloved/cli
    ├── @unloved/server
    └── @unloved/shared

@unloved/server
    └── @unloved/shared

@unloved/web
    └── @unloved/shared

@unloved/shared
    └── (no internal deps)
```

**Rule:** `shared` is a leaf. `cli` is the root. No circular dependencies.

---

## 3. Workspace Config

**`pnpm-workspace.yaml`:**

```yaml
packages:
  - "packages/*"
```

**Package naming:**

| Directory  | Package Name       |
| ---------- | ------------------ |
| `cli`      | `unloved`          |
| `server`   | `@unloved/server`  |
| `web`      | `@unloved/web`     |
| `shared`   | `@unloved/shared`  |

The `cli` package is the only one published to npm (as `unloved`). The rest are internal.

---

## 4. TypeScript Config

**`tsconfig.base.json`** (root):

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

Each package extends this with its own `tsconfig.json`.

---

## 5. Build Order

Enforced by pnpm workspace protocol and `tsup`:

```
1. @unloved/shared    (pure types, first)
2. @unloved/server    (depends on shared)
3. @unloved/web       (depends on shared, outputs static)
4. unloved (cli)      (depends on server, bundles everything)
```

---

## 6. Dev Workflow

**Root `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "clean": "pnpm -r clean"
  }
}
```

During development:

- `packages/web` runs Vite dev server (hot reload)
- `packages/server` runs with `tsx --watch` (restart on change)
- `packages/cli` is not needed in dev — the server runs directly

---

## 7. Static Asset Serving

In production:

1. `packages/web` builds to `packages/web/dist/`
2. `packages/server` serves these static files via Express
3. `packages/cli` bundles server (which includes the web asset path reference)

The server resolves the web dist path at runtime:

```ts
app.use(express.static(resolve(__dirname, '../../web/dist')))
```

---

## 8. Environment Boundaries

| Boundary        | What crosses it         | Protocol        |
| --------------- | ----------------------- | --------------- |
| CLI → Server    | Function call (in-proc) | TypeScript API  |
| Server → PTY    | stdin/stdout            | Raw bytes       |
| Server → Client | Messages                | WebSocket JSON  |
| Client → Server | Messages                | WebSocket JSON  |
| Client → Server | Build trigger           | HTTP POST       |

---

## 9. Config File Location

The server looks for config in this order:

1. Path from `--config` CLI flag
2. `unloved.config.json` in current directory
3. Walk up parent directories until found
4. Fall back to defaults

---

## 10. Git Ignore Patterns

```
node_modules/
dist/
*.tsbuildinfo
.env
```

Each package has its own `dist/` output. No build artifacts committed.
