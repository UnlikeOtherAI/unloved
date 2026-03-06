# unloved

Local multi-device AI coding cockpit. See `docs/brief.md` for full context.

## Standards

All coding standards, architecture rules, and agent guidelines: `@./AGENTS.md`

## Tech Stack

- **Monorepo:** pnpm workspaces, TypeScript (ES2022, strict, bundler resolution)
- **Server:** Express, Node.js >=20
- **Web:** React 19, Vite, Tailwind v4, Zustand, lucide-react
- **Shared:** Pure types, no runtime deps
- **Build:** tsup (server/shared), Vite (web)

## Key Commands

```sh
pnpm dev          # run all packages in parallel
pnpm build        # build all packages
steroids llm      # steroids CLI reference
```

## Specs

Implementation specs live in `specs/`. Each steroids task references its spec file.

## Ports

- Server: 7331
- Web dev: 5173
