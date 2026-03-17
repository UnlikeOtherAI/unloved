#!/usr/bin/env node
// Fix node-pty spawn-helper permissions (prebuilt binaries may lack +x)
const { readdirSync, chmodSync, statSync } = require('fs')
const { join } = require('path')

function walk(dir, name, results = []) {
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full, name, results)
      else if (entry.name === name) results.push(full)
    }
  } catch { /* skip inaccessible dirs */ }
  return results
}

const root = join(__dirname, '..', 'node_modules')
for (const file of walk(root, 'spawn-helper')) {
  if (!file.includes('node-pty')) continue
  try {
    const stat = statSync(file)
    if (!(stat.mode & 0o111)) {
      chmodSync(file, 0o755)
      console.log(`Fixed permissions: ${file}`)
    }
  } catch { /* ignore */ }
}
