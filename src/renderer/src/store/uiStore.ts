import { create } from 'zustand'

interface UIStore {
  selectedFiles: Set<string>
  dragActiveId: string | null
  searchQuery: string

  selectFile: (filePath: string) => void
  deselectFile: (filePath: string) => void
  toggleFileSelection: (filePath: string) => void
  selectFiles: (filePaths: string[]) => void
  clearSelection: () => void
  isSelected: (filePath: string) => boolean
  setDragActiveId: (id: string | null) => void
  setSearchQuery: (query: string) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  selectedFiles: new Set<string>(),
  dragActiveId: null,
  searchQuery: '',

  selectFile: (filePath) =>
    set((state) => ({
      selectedFiles: new Set(state.selectedFiles).add(filePath)
    })),

  deselectFile: (filePath) =>
    set((state) => {
      const next = new Set(state.selectedFiles)
      next.delete(filePath)
      return { selectedFiles: next }
    }),

  toggleFileSelection: (filePath) => {
    const current = get().selectedFiles
    if (current.has(filePath)) {
      const next = new Set(current)
      next.delete(filePath)
      set({ selectedFiles: next })
    } else {
      set({ selectedFiles: new Set(current).add(filePath) })
    }
  },

  selectFiles: (filePaths) =>
    set({ selectedFiles: new Set(filePaths) }),

  clearSelection: () => set({ selectedFiles: new Set() }),

  isSelected: (filePath) => get().selectedFiles.has(filePath),

  setDragActiveId: (id) => set({ dragActiveId: id }),

  setSearchQuery: (query) => set({ searchQuery: query })
}))
