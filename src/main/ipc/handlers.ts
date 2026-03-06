import { ipcMain, app } from 'electron'
import { registerDialogHandlers } from './dialog'
import { registerFileSystemHandlers } from './fileSystem'
import { registerDatabaseHandlers } from './database'
import { registerWatcherHandlers } from './watcher'

export function registerAllHandlers(): void {
  registerDialogHandlers()
  registerFileSystemHandlers()
  registerDatabaseHandlers()
  registerWatcherHandlers()

  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })
}
