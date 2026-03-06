import { create } from 'zustand'
import type { FileEntry } from '@renderer/types/file'
import { ParaCategory } from '@renderer/types/para'

interface ClassifiedFile extends FileEntry {
  category: ParaCategory
}

interface FileStore {
  files: ClassifiedFile[]
  rootPath: string | null

  setRootPath: (path: string) => void
  setFiles: (files: FileEntry[], classifications: Map<string, ParaCategory>) => void
  classifyFile: (filePath: string, category: ParaCategory) => void
  classifyFiles: (filePaths: string[], category: ParaCategory) => void
  addFile: (file: FileEntry) => void
  removeFile: (filePath: string) => void
  updateFile: (file: FileEntry) => void
  getFilesByCategory: (category: ParaCategory) => ClassifiedFile[]
  getCategoryCounts: () => Record<ParaCategory, number>
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  rootPath: null,

  setRootPath: (path) => set({ rootPath: path }),

  setFiles: (files, classifications) => {
    const classified = files.map((file) => ({
      ...file,
      category: classifications.get(file.filePath) ?? ParaCategory.INBOX
    }))
    set({ files: classified })
  },

  classifyFile: (filePath, category) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.filePath === filePath ? { ...f, category } : f
      )
    }))
  },

  classifyFiles: (filePaths, category) => {
    const pathSet = new Set(filePaths)
    set((state) => ({
      files: state.files.map((f) =>
        pathSet.has(f.filePath) ? { ...f, category } : f
      )
    }))
  },

  addFile: (file) => {
    set((state) => ({
      files: [...state.files, { ...file, category: ParaCategory.INBOX }]
    }))
  },

  removeFile: (filePath) => {
    set((state) => ({
      files: state.files.filter((f) => f.filePath !== filePath)
    }))
  },

  updateFile: (file) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.filePath === file.filePath ? { ...f, ...file } : f
      )
    }))
  },

  getFilesByCategory: (category) => {
    return get().files.filter((f) => f.category === category)
  },

  getCategoryCounts: () => {
    const counts = {} as Record<ParaCategory, number>
    for (const cat of Object.values(ParaCategory)) {
      counts[cat] = 0
    }
    for (const file of get().files) {
      counts[file.category]++
    }
    return counts
  }
}))
