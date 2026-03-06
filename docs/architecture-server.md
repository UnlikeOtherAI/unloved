# unloved — Server (API) Architecture

`packages/server` — Express HTTP + WebSocket + PTY backend.

---

## 1. Purpose

The server is the brain of unloved. It:

- Manages PTY sessions (spawn, buffer, lifecycle)
- Routes WebSocket messages between devices and PTY
- Serves REST endpoints (build, config, devices)
- Watches config file for changes
- Serves the web UI static assets in production

---

## 2. Folder Structure

```
packages/server/
├── src/
│   ├── index.ts                # createServer() — main export
│   ├── app.ts                  # Express app setup
│   ├── websocket.ts            # WebSocket server + message routing
│   ├── session/
│   │   ├── session-manager.ts  # Session lifecycle (create, destroy, get)
│   │   ├── terminal.ts         # PTY wrapper (spawn, write, resize)
│   │   └── buffer.ts           # Ring buffer for terminal output
│   ├── devices/
│   │   ├── device-manager.ts   # Track connected devices
│   │   └── types.ts            # Device types
│   ├── config/
│   │   ├── config-loader.ts    # Load + validate config
│   │   └── config-watcher.ts   # Chokidar file watcher
│   ├── build/
│   │   └── build-runner.ts     # Execute rebuild commands
│   ├── routes/
│   │   ├── build.ts            # POST /api/rebuild
│   │   ├── config.ts           # GET /api/config
│   │   ├── devices.ts          # GET /api/devices
│   │   ├── session.ts          # GET /api/session
│   │   └── health.ts           # GET /api/health
│   └── utils/
│       ├── cli-detect.ts       # Re-export or used by CLI package
│       └── network.ts          # LAN IP detection
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## 3. Server Entry — `src/index.ts`

```ts
export interface ServerOptions {
  port: number
  project: ProjectContext
  clis: DetectedCli[]
  previewUrl?: string
  defaultCli?: string
}

export async function createServer(opts: ServerOptions): Promise<ServerInstance> {
  const app = createApp(opts)
  const server = http.createServer(app)
  const wss = createWebSocketServer(server, opts)

  server.listen(opts.port, '0.0.0.0')

  return { url: `http://localhost:${opts.port}`, server, wss }
}
```

---

## 4. Session Manager — `src/session/session-manager.ts`

Manages one session per project.

```ts
interface Session {
  id: string
  cli: string
  terminal: Terminal
  buffer: RingBuffer
  devices: Set<string>
  createdAt: Date
}
```

**Operations:**

| Method             | Description                          |
| ------------------ | ------------------------------------ |
| `createSession()`  | Spawn PTY, start buffering           |
| `getSession()`     | Get existing session                 |
| `destroySession()` | Kill PTY, clear buffer               |
| `switchCli()`      | Destroy + recreate with new CLI      |

**Rule:** Only one active session per server instance.

---

## 5. Terminal — `src/session/terminal.ts`

Wraps `node-pty`.

```ts
class Terminal {
  private pty: IPty

  constructor(cli: string, cwd: string) {
    this.pty = spawn(cli, [], {
      name: 'xterm-256color',
      cols: 120,
      rows: 40,
      cwd,
      env: process.env,
    })
  }

  write(data: string): void   // stdin
  onData(cb: (data: string) => void): void  // stdout
  resize(cols: number, rows: number): void
  kill(): void
}
```

---

## 6. Ring Buffer — `src/session/buffer.ts`

Stores terminal output for replay on reconnect.

```ts
class RingBuffer {
  private lines: string[] = []
  private maxLines = 2000

  append(data: string): void
  getAll(): string[]
  clear(): void
}
```

When a device connects, the full buffer is sent as `BUFFER_REPLAY`.

---

## 7. WebSocket Server — `src/websocket.ts`

Attaches to the HTTP server via `upgrade` event.

**Connection flow:**

1. Client connects
2. Client sends `REGISTER_DEVICE` with `deviceType`
3. Server assigns `deviceId`, adds to device manager
4. Server sends `BUFFER_REPLAY` (catch-up)
5. Bidirectional messaging begins

**Message routing:**

| Client sends          | Server does                          |
| --------------------- | ------------------------------------ |
| `TERMINAL_INPUT`      | Queue → write to PTY stdin           |
| `REGISTER_DEVICE`     | Add device, broadcast update         |
| `TRIGGER_REBUILD`     | Start build                          |
| `RESIZE_TERMINAL`     | Resize PTY                           |

| Server sends          | When                                 |
| --------------------- | ------------------------------------ |
| `TERMINAL_OUTPUT`     | PTY produces stdout                  |
| `BUFFER_REPLAY`       | Device connects/reconnects           |
| `BUILD_STARTED`       | Build begins                         |
| `BUILD_COMPLETE`      | Build succeeds                       |
| `BUILD_FAILED`        | Build errors                         |
| `CONFIG_UPDATED`      | Config file changed                  |
| `DEVICE_CONNECTED`    | New device joins                     |
| `DEVICE_DISCONNECTED` | Device leaves                        |
| `CLIS_DETECTED`       | CLI list sent on connect             |

---

## 8. Device Manager — `src/devices/device-manager.ts`

```ts
interface ConnectedDevice {
  id: string
  type: DeviceType    // 'phone' | 'tablet' | 'desktop'
  socket: WebSocket
  connectedAt: Date
}
```

**Operations:**

| Method          | Description                    |
| --------------- | ------------------------------ |
| `add()`         | Register new device            |
| `remove()`      | Disconnect cleanup             |
| `list()`        | All connected devices          |
| `broadcast()`   | Send message to all devices    |
| `broadcastExcept()` | Send to all except sender  |

---

## 9. Config Watcher — `src/config/config-watcher.ts`

Uses `chokidar` to watch `unloved.config.json`.

```ts
const watcher = chokidar.watch(configPath, {
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 300 },
})

watcher.on('change', async () => {
  const newConfig = await loadAndValidate(configPath)
  if (newConfig) {
    applyConfig(newConfig)
    devices.broadcast({ type: 'CONFIG_UPDATED', config: newConfig })
  }
})
```

**Critical:** Config reload never restarts the PTY session.

---

## 10. Build Runner — `src/build/build-runner.ts`

```ts
class BuildRunner {
  private running = false

  async run(command: string, cwd: string): Promise<BuildResult> {
    if (this.running) throw new Error('Build already in progress')
    this.running = true

    devices.broadcast({ type: 'BUILD_STARTED' })

    // command is split into executable + args for execFile
    const [executable, ...args] = command.split(' ')
    const result = await execFileAsync(executable, args, { cwd })

    devices.broadcast(
      result.ok
        ? { type: 'BUILD_COMPLETE' }
        : { type: 'BUILD_FAILED', error: result.stderr }
    )

    this.running = false
    return result
  }
}
```

Only one build at a time. Concurrent requests rejected.

---

## 11. REST Routes

All prefixed with `/api`.

| Route              | Method | Description                    |
| ------------------ | ------ | ------------------------------ |
| `/api/health`      | GET    | Server status                  |
| `/api/config`      | GET    | Current config                 |
| `/api/session`     | GET    | Current session info           |
| `/api/devices`     | GET    | Connected devices list         |
| `/api/rebuild`     | POST   | Trigger rebuild                |

REST is secondary to WebSocket — used for simple queries and the rebuild trigger.

---

## 12. Input Queue

Terminal input from multiple devices is serialized via a FIFO queue.

```ts
class InputQueue {
  private queue: string[] = []
  private processing = false

  enqueue(data: string): void {
    this.queue.push(data)
    this.process()
  }

  private async process(): Promise<void> {
    if (this.processing) return
    this.processing = true
    while (this.queue.length > 0) {
      const data = this.queue.shift()!
      terminal.write(data)
    }
    this.processing = false
  }
}
```

Prevents interleaved keystrokes from multiple devices.

---

## 13. Static File Serving

In production mode, the server serves the built web UI:

```ts
if (process.env.NODE_ENV === 'production') {
  const webDist = resolve(__dirname, '../../web/dist')
  app.use(express.static(webDist))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(resolve(webDist, 'index.html'))
    }
  })
}
```

In development, the Vite dev server runs separately and proxies API/WS to the server.

---

## 14. Package Manifest

```json
{
  "name": "@unloved/server",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "@unloved/shared": "workspace:*",
    "express": "^5",
    "ws": "^8",
    "node-pty": "^1",
    "chokidar": "^4",
    "nanoid": "^5",
    "zod": "^3"
  }
}
```
