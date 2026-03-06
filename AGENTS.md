# unloved — Agent Guidelines

Standards for all LLM agents (coders, reviewers, coordinators) working on this project.

---

## Code Quality

### File Size

- **Hard limit: 500 lines per source file.** No exceptions for non-generated code.
- If a file approaches 400 lines, split proactively — don't wait for the limit.
- Components, routes, stores, and utilities each belong in their own file.

### Simplicity Over Cleverness

- Write the simplest code that solves the problem.
- No premature abstractions. Three similar lines > one premature helper.
- No feature flags, backwards-compat shims, or "just in case" code.
- If you need a comment to explain the code, the code is too complex. Rename or restructure.

### Root Cause Fixes

- Never patch symptoms. Find the root cause and fix it there.
- No patches on patches. If a fix requires modifying a previous fix, reconsider the original approach.
- When something breaks, ask "why did this happen?" not "how do I suppress this?"

### Error Handling

- Only validate at system boundaries (user input, external APIs, file I/O).
- Trust internal code. Don't add defensive checks for impossible states.
- Let errors propagate naturally — don't catch and re-throw without adding value.

---

## Architecture

### Package Boundaries

```
@unloved/shared  → Pure types, no runtime deps, no side effects
@unloved/server  → Express backend, depends only on shared
@unloved/web     → React frontend, depends only on shared
```

- shared is a leaf package. Never add runtime dependencies to it.
- Server and web never import from each other.
- All cross-package contracts go through shared types.

### File Organization

- One component per file. File name matches the default export.
- Group by feature, not by type (e.g., `components/welcome/` not `components/buttons/`).
- Index files only re-export — no logic.
- Keep related things close: component + its store + its types in the same directory.

### Dependencies

- Minimize external dependencies. Every dep is a maintenance burden.
- Pin exact versions in package.json for internal packages.
- Use workspace protocol (`workspace:*`) for monorepo cross-references.

---

## Implementation Patterns

### TypeScript

- Strict mode always. No `any` unless interfacing with untyped externals.
- Prefer `interface` for object shapes, `type` for unions and intersections.
- No enums — use `as const` objects or string literal unions.
- Export types from shared, import them everywhere else.

### React (web package)

- Functional components only.
- Zustand for state management — one store per domain (theme, session, etc.).
- No prop drilling past 2 levels — use stores or context.
- Keep components under 150 lines. Extract sub-components early.

### Server (server package)

- Route handlers in separate files under `src/routes/`.
- Use `execFile` not `exec` for subprocess spawning (security).
- Validate external input with Zod at the route boundary.
- Return consistent JSON shapes: `{ data }` for success, `{ error }` for failure.

### CSS / Tailwind

- Tailwind v4 with CSS-first config in `index.css`.
- Design tokens defined once in `@theme` block — never hardcode colors/radii.
- Use `dark:` variant with class strategy for dark mode.
- No inline styles. No CSS modules. Tailwind only.

---

## Workflow

### Before Starting a Task

1. Read the task spec (`steroids tasks audit <id>`).
2. Read every file you'll modify before changing it.
3. Understand the existing patterns before introducing new ones.

### During Implementation

- Make the smallest change that satisfies the spec.
- Don't refactor unrelated code, even if it's ugly.
- Don't add docstrings, comments, or type annotations to code you didn't change.
- Run the build after every significant change.

### Before Submitting

- All files under 500 lines.
- No `console.log` left behind (use proper logging or remove).
- No commented-out code.
- No unused imports or variables.
- Build passes cleanly.

---

## Key Files

| File | Purpose |
|---|---|
| `pnpm-workspace.yaml` | Monorepo workspace declaration |
| `tsconfig.base.json` | Shared TypeScript compiler options |
| `packages/shared/src/` | All cross-package types |
| `packages/server/src/app.ts` | Express app setup |
| `packages/web/src/index.css` | All Tailwind v4 design tokens |
| `packages/web/src/App.tsx` | React app root |
| `docs/` | Project documentation (read-only reference) |
| `specs/` | Task specifications for steroids |
