# unloved — Web Architecture

`packages/web` — React + Vite frontend.

---

## 1. Purpose

The web package is the browser-based UI that:

- Renders the terminal via xterm.js
- Displays the preview iframe
- Manages device-local layout state
- Communicates with the server over WebSocket

---

## 2. Folder Structure

```
packages/web/
├── src/
│   ├── main.tsx                    # React entry point
│   ├── App.tsx                     # Root layout + routing
│   ├── index.css                   # Tailwind + design tokens
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Left navigation sidebar
│   │   │   ├── SidebarItem.tsx     # Individual nav item
│   │   │   ├── Header.tsx          # Top header bar
│   │   │   ├── BurgerMenu.tsx      # Hamburger dropdown menu
│   │   │   └── ResizableLayout.tsx # Split panel container
│   │   │
│   │   ├── terminal/
│   │   │   ├── TerminalPanel.tsx   # Terminal container + xterm
│   │   │   ├── TerminalInput.tsx   # Message input bar
│   │   │   └── useTerminal.ts      # xterm.js lifecycle hook
│   │   │
│   │   ├── preview/
│   │   │   ├── PreviewPanel.tsx    # Preview iframe container
│   │   │   ├── PreviewToolbar.tsx  # Back/forward/refresh/URL
│   │   │   └── usePreview.ts       # Navigation state hook
│   │   │
│   │   ├── devices/
│   │   │   └── DevicePanel.tsx     # Connected devices list
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx          # Button variants
│   │       ├── Input.tsx           # Styled input
│   │       ├── IconButton.tsx      # Icon-only button
│   │       └── ModeToggle.tsx      # Chat/WorkArea toggle (mobile)
│   │
│   ├── stores/
│   │   ├── connection.ts           # WebSocket connection state
│   │   ├── terminal.ts             # Terminal buffer + session
│   │   ├── layout.ts               # Layout mode + panel sizes
│   │   ├── config.ts               # Server config mirror
│   │   ├── devices.ts              # Connected devices list
│   │   └── build.ts                # Build status
│   │
│   ├── hooks/
│   │   ├── useWebSocket.ts         # WebSocket connect/reconnect
│   │   ├── useDeviceType.ts        # Detect phone/tablet/desktop
│   │   └── useLocalStorage.ts      # Persistent layout prefs
│   │
│   ├── lib/
│   │   ├── ws-client.ts            # WebSocket client wrapper
│   │   └── protocol.ts             # Re-exports from @unloved/shared
│   │
│   └── types/
│       └── index.ts                # Web-specific types
│
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tailwind.config.ts              # (v4: may be CSS-only)
├── package.json
└── tsconfig.json
```

---

## 3. Component Tree

```
<App>
  ├── <Sidebar />                   (hidden on mobile)
  └── <main>
        ├── <Header />
        │     ├── <BurgerMenu />
        │     ├── <URLBar />
        │     └── <RebuildButton />
        │
        └── <ResizableLayout>
              ├── <TerminalPanel />
              │     ├── <Terminal />   (xterm.js)
              │     └── <TerminalInput />
              │
              └── <PreviewPanel />
                    ├── <PreviewToolbar />
                    └── <iframe />
              </ResizableLayout>
  </main>
```

**Mobile:** Replaces `ResizableLayout` with `ModeToggle` + conditional render.

---

## 4. State Management — Zustand

### `stores/connection.ts`

```ts
interface ConnectionStore {
  status: 'connecting' | 'connected' | 'disconnected'
  socket: WebSocket | null
  connect: (url: string) => void
  disconnect: () => void
  send: (msg: ClientMessage) => void
}
```

### `stores/terminal.ts`

```ts
interface TerminalStore {
  sessionId: string | null
  cli: string | null
  // xterm.Terminal instance managed via ref, not store
}
```

### `stores/layout.ts`

```ts
interface LayoutStore {
  mode: 'split' | 'chat' | 'work_area' | 'mirror'
  consoleWidth: number
  sidebarOpen: boolean
  setMode: (mode: LayoutMode) => void
  setConsoleWidth: (width: number) => void
  toggleSidebar: () => void
}
```

Layout state persists to `localStorage` per device.

### `stores/build.ts`

```ts
interface BuildStore {
  status: 'idle' | 'building' | 'success' | 'failed'
  error: string | null
}
```

### `stores/config.ts`

```ts
interface ConfigStore {
  previewUrl: string
  availableClis: string[]
  currentCli: string
  rebuildCommand: string
}
```

### `stores/devices.ts`

```ts
interface DevicesStore {
  devices: DeviceInfo[]
}
```

---

## 5. WebSocket Hook — `hooks/useWebSocket.ts`

```ts
function useWebSocket() {
  // On mount: connect to ws://localhost:7331
  // On message: route to appropriate store
  // On close: set status to disconnected, retry with backoff
  // On open: send REGISTER_DEVICE, receive BUFFER_REPLAY
}
```

**Reconnect strategy:** Exponential backoff (1s, 2s, 4s, 8s, max 30s).

**Message routing:**

```ts
switch (msg.type) {
  case 'TERMINAL_OUTPUT':  → write to xterm instance
  case 'BUFFER_REPLAY':   → write all lines to xterm
  case 'BUILD_STARTED':   → buildStore.setBuilding()
  case 'BUILD_COMPLETE':  → buildStore.setSuccess() + reload preview
  case 'BUILD_FAILED':    → buildStore.setFailed(msg.error)
  case 'CONFIG_UPDATED':  → configStore.update(msg.config)
  case 'DEVICE_CONNECTED': → devicesStore.add(msg.device)
  case 'DEVICE_DISCONNECTED': → devicesStore.remove(msg.deviceId)
}
```

---

## 6. Terminal Integration — `components/terminal/useTerminal.ts`

```ts
function useTerminal(containerRef: RefObject<HTMLDivElement>) {
  // Creates xterm.Terminal instance
  // Attaches FitAddon (auto-resize)
  // Attaches WebGL addon (GPU rendering)
  // Sends resize events to server
  // Returns terminal instance for data writing
}
```

**Key behaviors:**

- Terminal instance created once, survives re-renders
- FitAddon recalculates on window resize + panel resize
- Resize events sent to server → PTY resize
- Terminal theme matches design tokens

**xterm theme:**

```ts
const theme = {
  background: '#0D1117',
  foreground: '#E6EDF3',
  cursor: '#E6EDF3',
  cursorAccent: '#0D1117',
  selectionBackground: 'rgba(91, 107, 255, 0.3)',
}
```

---

## 7. Preview Panel — `components/preview/`

**PreviewPanel:** Renders an iframe pointed at the preview URL.

**PreviewToolbar:** Back, forward, refresh buttons + URL display.

**Navigation tracking:** Uses `postMessage` listener from iframe for URL changes (same-origin only). Falls back to displaying the base URL for cross-origin previews.

**Build reload:** On `BUILD_COMPLETE`, the iframe `src` is re-assigned to force reload.

---

## 8. Device Detection — `hooks/useDeviceType.ts`

```ts
function useDeviceType(): 'phone' | 'tablet' | 'desktop' {
  // Uses window.innerWidth:
  //   < 768  → phone
  //   < 1024 → tablet
  //   >= 1024 → desktop
  // Also checks navigator.maxTouchPoints for disambiguation
}
```

Device type determines:

- Whether sidebar renders
- Whether split layout is available
- Whether mode toggle appears

---

## 9. Responsive Layout

### Desktop (>=1024px)

```
Sidebar + Header + [Terminal | Preview]
```

Split layout with resizable divider.

### Tablet (768–1023px)

```
Header + [Terminal | Preview]
```

No sidebar. Split or fullscreen preview.

### Phone (<768px)

```
Header + [Chat OR WorkArea]
```

No sidebar. Toggle between modes.

---

## 10. Vite Config

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:7331',
      '/ws': {
        target: 'ws://localhost:7331',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
```

---

## 11. Package Manifest

```json
{
  "name": "@unloved/web",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "dependencies": {
    "@unloved/shared": "workspace:*",
    "react": "^19",
    "react-dom": "^19",
    "@xterm/xterm": "^5",
    "@xterm/addon-fit": "^0.10",
    "@xterm/addon-webgl": "^0.18",
    "zustand": "^5",
    "lucide-react": "^0.470",
    "react-resizable-panels": "^2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4",
    "vite": "^6",
    "tailwindcss": "^4",
    "@fontsource/inter": "^5",
    "@fontsource/jetbrains-mono": "^5",
    "typescript": "^5"
  }
}
```
