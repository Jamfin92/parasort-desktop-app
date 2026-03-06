import { ParaCategory } from './para'

export interface FileEntry {
  filePath: string
  fileName: string
  extension: string
  sizeBytes: number
  modifiedAt: string
  isDirectory: boolean
}

export interface FileClassification {
  filePath: string
  rootPath: string
  category: ParaCategory
  classifiedAt: string
  originalPath: string | null
}

export interface MoveRequest {
  sourcePath: string
  category: ParaCategory
}

export interface MoveResult {
  sourcePath: string
  destinationPath: string
  success: boolean
  error?: string
}

export interface AppSettings {
  lastRootPath: string | null
  sortMode: 'virtual' | 'physical'
  scanRecursive: boolean
  theme: 'light' | 'dark' | 'system'
}
