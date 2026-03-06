import { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import { watch, type FSWatcher } from 'chokidar'
import path from 'path'
import { getFileMetadata } from '../utils/fileMetadata'

let watcher: FSWatcher | null = null

export function registerWatcherHandlers(): void {
  ipcMain.handle('watcher:start', (_event, rootPath: string) => {
    stopWatcher()

    watcher = watch(rootPath, {
      ignoreInitial: true,
      depth: 0,
      ignored: /(^|[/\\])\./
    })

    const sendToRenderer = (channel: string, data: unknown) => {
      const windows = BrowserWindow.getAllWindows()
      for (const win of windows) {
        win.webContents.send(channel, data)
      }
    }

    let debounceTimer: NodeJS.Timeout | null = null
    const pendingEvents: { type: string; filePath: string }[] = []

    const flushEvents = () => {
      for (const event of pendingEvents) {
        try {
          if (event.type === 'add' || event.type === 'change') {
            const meta = getFileMetadata(event.filePath)
            sendToRenderer(
              event.type === 'add' ? 'fs:file-added' : 'fs:file-changed',
              meta
            )
          } else if (event.type === 'unlink') {
            sendToRenderer('fs:file-removed', { filePath: event.filePath })
          }
        } catch {
          // File may no longer exist
        }
      }
      pendingEvents.length = 0
    }

    const queueEvent = (type: string, filePath: string) => {
      // Skip hidden files
      if (path.basename(filePath).startsWith('.')) return

      pendingEvents.push({ type, filePath })
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(flushEvents, 300)
    }

    watcher.on('add', (filePath) => queueEvent('add', filePath))
    watcher.on('change', (filePath) => queueEvent('change', filePath))
    watcher.on('unlink', (filePath) => queueEvent('unlink', filePath))
    watcher.on('addDir', (filePath) => queueEvent('add', filePath))
    watcher.on('unlinkDir', (filePath) => queueEvent('unlink', filePath))
  })

  ipcMain.handle('watcher:stop', () => {
    stopWatcher()
  })
}

function stopWatcher(): void {
  if (watcher) {
    watcher.close()
    watcher = null
  }
}

export function cleanupWatcher(): void {
  stopWatcher()
}
