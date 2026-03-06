import { ipcMain, app } from 'electron'
import fs from 'fs'
import path from 'path'

interface Classification {
  filePath: string
  rootPath: string
  category: string
  classifiedAt: string
  originalPath: string | null
}

interface Settings {
  lastRootPath: string | null
  sortMode: 'virtual' | 'physical'
  scanRecursive: boolean
  theme: 'light' | 'dark' | 'system'
}

interface Database {
  classifications: Classification[]
  settings: Settings
}

const DB_FILE = 'parasort-data.json'

function getDbPath(): string {
  return path.join(app.getPath('userData'), DB_FILE)
}

function readDb(): Database {
  const dbPath = getDbPath()
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch {
    // Corrupted file, start fresh
  }
  return {
    classifications: [],
    settings: {
      lastRootPath: null,
      sortMode: 'virtual',
      scanRecursive: false,
      theme: 'system'
    }
  }
}

function writeDb(db: Database): void {
  const dbPath = getDbPath()
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8')
}

export function registerDatabaseHandlers(): void {
  ipcMain.handle(
    'db:get-classifications',
    (_event, rootPath: string) => {
      const db = readDb()
      return db.classifications.filter((c) => c.rootPath === rootPath)
    }
  )

  ipcMain.handle(
    'db:set-classification',
    (
      _event,
      filePath: string,
      rootPath: string,
      category: string
    ) => {
      const db = readDb()
      const idx = db.classifications.findIndex(
        (c) => c.filePath === filePath && c.rootPath === rootPath
      )

      const entry: Classification = {
        filePath,
        rootPath,
        category,
        classifiedAt: new Date().toISOString(),
        originalPath: null
      }

      if (idx >= 0) {
        db.classifications[idx] = entry
      } else {
        db.classifications.push(entry)
      }

      writeDb(db)
    }
  )

  ipcMain.handle(
    'db:bulk-set-classifications',
    (
      _event,
      entries: { filePath: string; category: string }[],
      rootPath: string
    ) => {
      const db = readDb()

      for (const entry of entries) {
        const idx = db.classifications.findIndex(
          (c) => c.filePath === entry.filePath && c.rootPath === rootPath
        )

        const classification: Classification = {
          filePath: entry.filePath,
          rootPath,
          category: entry.category,
          classifiedAt: new Date().toISOString(),
          originalPath: null
        }

        if (idx >= 0) {
          db.classifications[idx] = classification
        } else {
          db.classifications.push(classification)
        }
      }

      writeDb(db)
    }
  )

  ipcMain.handle(
    'db:delete-classification',
    (_event, filePath: string, rootPath: string) => {
      const db = readDb()
      db.classifications = db.classifications.filter(
        (c) => !(c.filePath === filePath && c.rootPath === rootPath)
      )
      writeDb(db)
    }
  )

  ipcMain.handle('db:get-settings', () => {
    const db = readDb()
    return db.settings
  })

  ipcMain.handle(
    'db:set-setting',
    (_event, key: string, value: string) => {
      const db = readDb()
      ;(db.settings as Record<string, unknown>)[key] = value
      writeDb(db)
    }
  )
}
