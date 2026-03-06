import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Dialog
  openDirectoryDialog: (): Promise<string | null> =>
    ipcRenderer.invoke('dialog:open-directory'),

  // File System
  scanDirectory: (rootPath: string, recursive: boolean) =>
    ipcRenderer.invoke('fs:scan-directory', rootPath, recursive),

  moveFiles: (files: { sourcePath: string; category: string }[], rootPath: string) =>
    ipcRenderer.invoke('fs:move-files', files, rootPath),

  openFile: (filePath: string) =>
    ipcRenderer.invoke('fs:open-file', filePath),

  showInExplorer: (filePath: string) =>
    ipcRenderer.invoke('fs:show-in-explorer', filePath),

  // Database
  getClassifications: (rootPath: string) =>
    ipcRenderer.invoke('db:get-classifications', rootPath),

  setClassification: (filePath: string, rootPath: string, category: string) =>
    ipcRenderer.invoke('db:set-classification', filePath, rootPath, category),

  bulkSetClassifications: (
    entries: { filePath: string; category: string }[],
    rootPath: string
  ) => ipcRenderer.invoke('db:bulk-set-classifications', entries, rootPath),

  deleteClassification: (filePath: string, rootPath: string) =>
    ipcRenderer.invoke('db:delete-classification', filePath, rootPath),

  getSettings: () => ipcRenderer.invoke('db:get-settings'),

  setSetting: (key: string, value: string) =>
    ipcRenderer.invoke('db:set-setting', key, value),

  // Watcher
  startWatcher: (rootPath: string) =>
    ipcRenderer.invoke('watcher:start', rootPath),

  stopWatcher: () => ipcRenderer.invoke('watcher:stop'),

  onFileAdded: (callback: (entry: unknown) => void) => {
    const handler = (_event: unknown, entry: unknown) => callback(entry)
    ipcRenderer.on('fs:file-added', handler)
    return () => ipcRenderer.removeListener('fs:file-added', handler)
  },

  onFileRemoved: (callback: (data: { filePath: string }) => void) => {
    const handler = (_event: unknown, data: { filePath: string }) => callback(data)
    ipcRenderer.on('fs:file-removed', handler)
    return () => ipcRenderer.removeListener('fs:file-removed', handler)
  },

  onFileChanged: (callback: (entry: unknown) => void) => {
    const handler = (_event: unknown, entry: unknown) => callback(entry)
    ipcRenderer.on('fs:file-changed', handler)
    return () => ipcRenderer.removeListener('fs:file-changed', handler)
  },

  // App
  getVersion: () => ipcRenderer.invoke('app:get-version')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.api = api
}
