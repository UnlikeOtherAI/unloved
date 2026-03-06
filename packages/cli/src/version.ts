import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export async function getVersion(): Promise<string> {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const pkgPath = resolve(__dirname, '..', 'package.json')
    const content = await readFile(pkgPath, 'utf-8')
    const pkg = JSON.parse(content) as { version: string }
    return pkg.version
  } catch {
    return '0.0.0'
  }
}
