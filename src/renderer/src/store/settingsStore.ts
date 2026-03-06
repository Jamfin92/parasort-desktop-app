import { create } from 'zustand'

interface SettingsStore {
  sortMode: 'virtual' | 'physical'
  scanRecursive: boolean
  theme: 'light' | 'dark' | 'system'

  setSortMode: (mode: 'virtual' | 'physical') => void
  setScanRecursive: (recursive: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  sortMode: 'virtual',
  scanRecursive: false,
  theme: 'system',

  setSortMode: (mode) => set({ sortMode: mode }),
  setScanRecursive: (recursive) => set({ scanRecursive: recursive }),
  setTheme: (theme) => set({ theme })
}))
