import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent
} from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { FileCard } from './FileCard'
import { useFileStore } from '@renderer/store/fileStore'
import { useUIStore } from '@renderer/store/uiStore'
import { ParaCategory, PARA_COLUMNS } from '@renderer/types/para'
import { useState } from 'react'

interface DraggedFile {
  filePath: string
  fileName: string
  extension: string
  sizeBytes: number
  modifiedAt: string
  isDirectory: boolean
  category: ParaCategory
}

export function KanbanBoard() {
  const files = useFileStore((s) => s.files)
  const classifyFile = useFileStore((s) => s.classifyFile)
  const searchQuery = useUIStore((s) => s.searchQuery)
  const [activeFile, setActiveFile] = useState<DraggedFile | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const filteredFiles = searchQuery
    ? files.filter((f) =>
        f.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files

  const filesByCategory = PARA_COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = filteredFiles.filter((f) => f.category === col.id)
      return acc
    },
    {} as Record<ParaCategory, typeof filteredFiles>
  )

  const handleDragStart = (event: DragStartEvent) => {
    const file = files.find((f) => f.filePath === event.active.id)
    if (file) {
      setActiveFile(file)
      useUIStore.getState().setDragActiveId(String(event.active.id))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveFile(null)
    useUIStore.getState().setDragActiveId(null)

    const { active, over } = event
    if (!over) return

    const filePath = String(active.id)
    const targetCategory = over.id as ParaCategory

    if (Object.values(ParaCategory).includes(targetCategory)) {
      classifyFile(filePath, targetCategory)

      // Persist to backend if available
      if (window.api) {
        const rootPath = useFileStore.getState().rootPath
        if (rootPath) {
          window.api.setClassification(filePath, rootPath, targetCategory)
        }
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid flex-1 grid-cols-5 gap-3 overflow-x-auto p-3">
        {PARA_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            files={filesByCategory[column.id]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeFile && (
          <div className="w-[240px] opacity-90">
            <FileCard
              filePath={activeFile.filePath}
              fileName={activeFile.fileName}
              extension={activeFile.extension}
              sizeBytes={activeFile.sizeBytes}
              modifiedAt={activeFile.modifiedAt}
              isDirectory={activeFile.isDirectory}
              category={activeFile.category}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
