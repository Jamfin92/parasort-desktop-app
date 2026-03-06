import type { FileEntry, FileClassification, MoveRequest, MoveResult, AppSettings } from './file'
import type { ParaCategory } from './para'

export interface ParaSortAPI {
  openDirectoryDialog: () => Promise<string | null>
  scanDirectory: (rootPath: string, recursive: boolean) => Promise<FileEntry[]>
  moveFiles: (files: MoveRequest[], rootPath: string) => Promise<MoveResult[]>
  openFile: (filePath: string) => Promise<void>
  showInExplorer: (filePath: string) => Promise<void>

  getClassifications: (rootPath: string) => Promise<FileClassification[]>
  setClassification: (
    filePath: string,
    rootPath: string,
    category: ParaCategory
  ) => Promise<void>
  bulkSetClassifications: (
    entries: { filePath: string; category: ParaCategory }[],
    rootPath: string
  ) => Promise<void>
  deleteClassification: (filePath: string, rootPath: string) => Promise<void>
  getSettings: () => Promise<AppSettings>
  setSetting: (key: string, value: string) => Promise<void>

  startWatcher: (rootPath: string) => Promise<void>
  stopWatcher: () => Promise<void>
  onFileAdded: (callback: (entry: FileEntry) => void) => () => void
  onFileRemoved: (callback: (filePath: string) => void) => () => void
  onFileChanged: (callback: (entry: FileEntry) => void) => () => void

  getVersion: () => Promise<string>
}

declare global {
  interface Window {
    api: ParaSortAPI
  }
}
