import { ipcMain } from 'electron'
import * as queries from '../db/queries'

export function registerDatabaseHandlers(): void {
  ipcMain.handle(
    'db:get-classifications',
    (_event, rootPath: string) => {
      return queries.getClassifications(rootPath)
    }
  )

  ipcMain.handle(
    'db:set-classification',
    (_event, filePath: string, rootPath: string, category: string) => {
      queries.setClassification(filePath, rootPath, category)
    }
  )

  ipcMain.handle(
    'db:bulk-set-classifications',
    (_event, entries: { filePath: string; category: string }[], rootPath: string) => {
      queries.bulkSetClassifications(entries, rootPath)
    }
  )

  ipcMain.handle(
    'db:delete-classification',
    (_event, filePath: string, rootPath: string) => {
      queries.deleteClassification(filePath, rootPath)
    }
  )

  ipcMain.handle('db:get-settings', () => {
    return queries.getSettings()
  })

  ipcMain.handle(
    'db:set-setting',
    (_event, key: string, value: string) => {
      queries.setSetting(key, value)
    }
  )
}
