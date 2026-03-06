export interface ParsedArgs {
  command: string
  positional: string[]
  flags: Record<string, string | true>
}

export function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2)
  const command = args[0] ?? 'start'
  const positional: string[] = []
  const flags: Record<string, string | true> = {}

  let i = 1
  while (i < args.length) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i += 2
      } else {
        flags[key] = true
        i += 1
      }
    } else {
      positional.push(arg)
      i += 1
    }
  }

  return { command, positional, flags }
}
