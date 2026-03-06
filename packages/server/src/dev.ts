import { resolve } from 'node:path'
import { startServer } from './index'

const homeDir = process.env.UNLOVED_HOME ?? resolve(process.env.HOME ?? '', '.unloved')
startServer({ homeDir })
