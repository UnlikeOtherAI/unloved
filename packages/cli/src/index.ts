import { parseArgs } from './parse-flags'
import { getVersion } from './version'
import { startCommand } from './commands/start'
import { restartCommand } from './commands/restart'
import { urlCommand } from './commands/url'
import { metaCommand } from './commands/meta'
import { helpCommand } from './commands/help'

const args = parseArgs(process.argv)

switch (args.command) {
  case 'start':
    await startCommand(args)
    break
  case 'restart':
    await restartCommand(args)
    break
  case 'url':
    await urlCommand(args)
    break
  case 'meta':
    await metaCommand(args)
    break
  case 'version':
    console.log(await getVersion())
    break
  case 'help':
    helpCommand(args)
    break
  default:
    console.error(`Unknown command: ${args.command}`)
    helpCommand({ ...args, flags: {} })
    process.exit(1)
}
