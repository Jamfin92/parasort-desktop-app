import fs from 'fs'
import path from 'path'

export interface FileEntryData {
  filePath: string
  fileName: string
  extension: string
  sizeBytes: number
  modifiedAt: string
  isDirectory: boolean
}

export function getFileMetadata(filePath: string): FileEntryData {
  const stats = fs.statSync(filePath)
  const ext = path.extname(filePath).slice(1).toLowerCase()

  return {
    filePath,
    fileName: path.basename(filePath),
    extension: ext,
    sizeBytes: stats.isDirectory() ? 0 : stats.size,
    modifiedAt: stats.mtime.toISOString(),
    isDirectory: stats.isDirectory()
  }
}

export function scanDirectory(rootPath: string, recursive: boolean): FileEntryData[] {
  const results: FileEntryData[] = []

  function scan(dirPath: string) {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      // Skip hidden files and system directories
      if (entry.name.startsWith('.')) continue

      const fullPath = path.join(dirPath, entry.name)
      try {
        results.push(getFileMetadata(fullPath))
        if (recursive && entry.isDirectory()) {
          scan(fullPath)
        }
      } catch {
        // Skip files we can't access
      }
    }
  }

  scan(rootPath)
  return results
}
