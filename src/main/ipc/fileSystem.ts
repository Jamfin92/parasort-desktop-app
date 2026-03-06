import { ipcMain, shell } from 'electron'
import fs from 'fs'
import path from 'path'
import { scanDirectory } from '../utils/fileMetadata'

const PARA_DIRS = ['Projects', 'Areas', 'Resources', 'Archive']

export function registerFileSystemHandlers(): void {
  ipcMain.handle(
    'fs:scan-directory',
    (_event, rootPath: string, recursive: boolean) => {
      return scanDirectory(rootPath, recursive)
    }
  )

  ipcMain.handle(
    'fs:move-files',
    (
      _event,
      files: { sourcePath: string; category: string }[],
      rootPath: string
    ) => {
      const results: {
        sourcePath: string
        destinationPath: string
        success: boolean
        error?: string
      }[] = []

      // Create PARA directories if they don't exist
      for (const dir of PARA_DIRS) {
        const dirPath = path.join(rootPath, dir)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }
      }

      for (const file of files) {
        const categoryDir = getCategoryDirName(file.category)
        if (!categoryDir) {
          results.push({
            sourcePath: file.sourcePath,
            destinationPath: file.sourcePath,
            success: false,
            error: `Invalid category: ${file.category}`
          })
          continue
        }

        const destDir = path.join(rootPath, categoryDir)
        const destPath = path.join(destDir, path.basename(file.sourcePath))

        try {
          if (fs.existsSync(destPath)) {
            results.push({
              sourcePath: file.sourcePath,
              destinationPath: destPath,
              success: false,
              error: 'File already exists at destination'
            })
            continue
          }

          fs.renameSync(file.sourcePath, destPath)
          results.push({
            sourcePath: file.sourcePath,
            destinationPath: destPath,
            success: true
          })
        } catch (err) {
          // If rename fails (cross-device), try copy + delete
          try {
            fs.copyFileSync(file.sourcePath, destPath)
            fs.unlinkSync(file.sourcePath)
            results.push({
              sourcePath: file.sourcePath,
              destinationPath: destPath,
              success: true
            })
          } catch (copyErr) {
            results.push({
              sourcePath: file.sourcePath,
              destinationPath: destPath,
              success: false,
              error: String(copyErr)
            })
          }
        }
      }

      return results
    }
  )

  ipcMain.handle('fs:open-file', async (_event, filePath: string) => {
    await shell.openPath(filePath)
  })

  ipcMain.handle('fs:show-in-explorer', (_event, filePath: string) => {
    shell.showItemInFolder(filePath)
  })
}

function getCategoryDirName(category: string): string | null {
  switch (category) {
    case 'projects':
      return 'Projects'
    case 'areas':
      return 'Areas'
    case 'resources':
      return 'Resources'
    case 'archive':
      return 'Archive'
    default:
      return null
  }
}
