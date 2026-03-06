import { useEffect } from 'react'
import { useFileStore } from '@renderer/store/fileStore'
import type { FileEntry } from '@renderer/types/file'

export function useFileWatcher() {
  useEffect(() => {
    if (!window.api) return

    const cleanupAdded = window.api.onFileAdded((entry) => {
      useFileStore.getState().addFile(entry as FileEntry)
    })

    const cleanupRemoved = window.api.onFileRemoved((data) => {
      useFileStore.getState().removeFile(data.filePath)
    })

    const cleanupChanged = window.api.onFileChanged((entry) => {
      useFileStore.getState().updateFile(entry as FileEntry)
    })

    return () => {
      cleanupAdded()
      cleanupRemoved()
      cleanupChanged()
    }
  }, [])
}
