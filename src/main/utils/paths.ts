import { app } from 'electron'
import path from 'path'

export function getDbPath(): string {
  return path.join(app.getPath('userData'), 'parasort.db')
}

export function getDataDir(): string {
  return app.getPath('userData')
}
