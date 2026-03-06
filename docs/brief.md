# unloved

Local multi-device **AI coding cockpit** for CLI-based LLMs.

---

## What Is This

`unloved` is a local development server + CLI tool that wraps existing AI coding CLIs (Claude Code, Codex, Gemini CLI, OpenCode) and exposes them through a web-based terminal UI with a live preview pane — accessible from any device on the local network.

The core insight: AI coding sessions are long-running processes, but the UIs we interact with them through are fragile. Browser tabs close. Laptops sleep. Phones are more convenient for typing prompts from the couch. `unloved` decouples the AI session from the device you're using to interact with it.

---

## The Problem

Current AI coding CLIs are locked to a single terminal window on a single machine. You can't:

- View your app preview and the AI chat side by side without splitting your screen
- Continue a conversation from your phone while away from your desk
- Have a dedicated preview monitor on a tablet while coding on your laptop
- Reload your browser without losing the session

---

## The Solution

Run `unloved` in any project directory. It spawns your chosen AI CLI in a server-side pseudoterminal, then serves a web UI that any device on the network can connect to. The PTY session persists regardless of what happens to any connected browser.

```
cd my-project
unloved
```

Every connected device gets:

- A terminal view showing the AI conversation
- A preview iframe/webview showing your running app
- A rebuild button to trigger builds
- Independent layout control (each device chooses its own view)

---

## Multi-Device Vision

The defining feature. Multiple devices connect to the same session simultaneously, each choosing its own role:

| Device  | Typical Role     | Why                                     |
| ------- | ---------------- | --------------------------------------- |
| MacBook | Split view       | Code console + preview side by side     |
| iPad    | Preview monitor  | Full-screen app preview, always visible |
| iPhone  | Prompt keyboard  | Type prompts from anywhere in the room  |

Devices are independent. They don't sync layouts or navigation. Each one is just a window into the same underlying session.

---

## Key Principles

**Session persistence.** The PTY process lives on the server. Closing a browser, reloading a page, or disconnecting a device changes nothing about the running session. Reconnecting replays the terminal buffer.

**UI is disposable.** All critical state (the AI conversation, the terminal buffer, the config) lives server-side. The browser is a view layer, nothing more.

**CLI agnostic.** Works with any CLI that runs in a terminal. Auto-detects installed CLIs and lets you pick from a dropdown.

**Zero config start.** Running `unloved` with no arguments works. Config file is optional for customizing preview URL, default CLI, and build commands.

**Local only.** Runs on your machine, on your network. Optional pairing code for LAN security.

---

## What It Is Not

- Not a cloud service
- Not a replacement for the AI CLIs themselves
- Not an IDE or editor
- Not a CI/CD tool
- Not a collaboration tool (single user, multiple devices)

---

## Development Phases

### Phase 1 — Foundation

CLI launcher, server with PTY session management, web UI with terminal + preview iframe. One device, one session, working end to end.

### Phase 2 — Multi-Device

Multi-device connections, responsive layouts (phone/tablet/desktop), rebuild command integration, device-aware layout modes.

### Phase 3 — Polish

Device panel, pairing/security, mobile app (Expo), advanced UX refinements.

---

## Related Docs

| Document                                        | Contents                              |
| ----------------------------------------------- | ------------------------------------- |
| [tech-stack.md](tech-stack.md)                   | Technology choices + Tailwind setup   |
| [architecture.md](architecture.md)               | Monorepo structure + dependency graph |
| [architecture-cli.md](architecture-cli.md)       | CLI package internals                 |
| [architecture-server.md](architecture-server.md) | Server/API package internals          |
| [architecture-web.md](architecture-web.md)       | Web frontend internals               |
| [ui.md](ui.md)                                   | Pixel-level UI design spec           |
