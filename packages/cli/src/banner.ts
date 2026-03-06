import { networkInterfaces } from 'node:os'

function getLocalIP(): string | null {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return null
}

export function printBanner(port: number): void {
  const localIP = getLocalIP()

  console.log()
  console.log('  unloved is running')
  console.log()
  console.log(`  Local:   http://localhost:${port}`)
  if (localIP) {
    console.log(`  Network: http://${localIP}:${port}`)
  }
  console.log()
}
