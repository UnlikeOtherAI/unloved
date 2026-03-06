import type { ParsedArgs } from '../parse-flags'

const HUMAN_HELP = `
unloved — local multi-device AI coding cockpit

Usage:
  unloved                     Auto-sync from GitHub, build, start server, open browser
  unloved start [session]     Start with optional session and flags
  unloved restart [session]   Run the session's restart command locally
  unloved url [session] <url> Set the preview URL for a session
  unloved meta [session] [key=val...]
  unloved help [--llm]
  unloved version

Flags:
  --no-sync    Skip pulling latest from GitHub (use bundled assets)
  --no-open    Skip opening the browser
  --port <n>   Server port (default: 6200)
  --url <url>  Set preview URL for the session
  --restart <cmd>  Set restart command for the session

Running \`unloved\` with no arguments syncs the latest code from GitHub,
installs dependencies, builds, then starts the server and opens your browser.
If sync fails, it falls back to the bundled assets from the installed package.

Session name is auto-detected from your current tmux session when omitted.
`.trim()

const LLM_HELP = `
UNLOVED SESSION PROTOCOL

You are running inside a tmux session managed by unloved, a local multi-device
AI coding cockpit. The user is monitoring your work from a web dashboard on
another device (phone, tablet, or second screen). The dashboard shows your
session status, a preview of the running app, and controls to restart your
dev server.

AVAILABLE COMMANDS

All commands auto-detect the session name from your current tmux session.
Run them directly in your shell — no HTTP calls needed.

  unloved restart
    Re-run the session's configured restart command (e.g. restart dev server).
    Use this after making changes that require a server/build restart.

  unloved url <url>
    Update the preview URL shown in the dashboard.
    Example: unloved url http://localhost:3000
    The dashboard will load this URL in an iframe for the user to see.

  unloved meta
    Print current session metadata as JSON.
    Shows: previewUrl, restartCommand, projectDir, cliTool, createdAt.

  unloved meta <key>=<value> [key=value...]
    Set session metadata fields.
    Examples:
      unloved meta previewUrl=http://localhost:3000
      unloved meta restartCommand="pnpm dev"
      unloved meta cliTool="claude-code"

WORKFLOW

1. After making code changes that need a dev server restart:
   $ unloved restart

2. After starting a dev server on a new port:
   $ unloved url http://localhost:<port>

3. To let the user know which tool you are:
   $ unloved meta cliTool="claude-code"

NOTES

- The session name is derived from your TMUX environment. Do not hardcode it.
- The restart command runs locally in your session's shell. It is whatever was
  configured when the session was created (via --restart flag or meta command).
- The preview URL is displayed in an iframe on the dashboard. Make sure the
  dev server binds to 0.0.0.0 (not just localhost) if the dashboard is on
  another device.
- These commands write to ~/.unloved/sessions/<session>/meta.json. The web
  dashboard polls this metadata to update the UI.
`.trim()

export function helpCommand(args: ParsedArgs): void {
  if (args.flags.llm) {
    console.log(LLM_HELP)
  } else {
    console.log(HUMAN_HELP)
  }
}
