import { useDroppable } from '@dnd-kit/core'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { KanbanColumnHeader } from './KanbanColumnHeader'
import { FileCard } from './FileCard'
import { FileContextMenu } from '@renderer/components/file/FileContextMenu'
import { CATEGORY_DROP_HIGHLIGHT } from '@renderer/lib/constants'
import { cn } from '@renderer/lib/utils'
import type { ColumnConfig } from '@renderer/types/para'
import type { ParaCategory } from '@renderer/types/para'

interface ClassifiedFile {
  filePath: string
  fileName: string
  extension: string
  sizeBytes: number
  modifiedAt: string
  isDirectory: boolean
  category: ParaCategory
}

interface KanbanColumnProps {
  column: ColumnConfig
  files: ClassifiedFile[]
}

export function KanbanColumn({ column, files }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: { category: column.id }
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-xl border border-border bg-muted/30 transition-all min-w-[240px]',
        isOver && `ring-2 ${CATEGORY_DROP_HIGHLIGHT[column.id]}`
      )}
    >
      <KanbanColumnHeader column={column} count={files.length} />

      <ScrollArea className="flex-1 px-2 pb-2">
        <div className="flex flex-col gap-2">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">{column.description}</p>
              <p className="mt-1 text-xs">Drop files here</p>
            </div>
          ) : (
            files.map((file) => (
              <FileContextMenu
                key={file.filePath}
                filePath={file.filePath}
                currentCategory={file.category}
              >
                <div>
                  <FileCard
                    filePath={file.filePath}
                    fileName={file.fileName}
                    extension={file.extension}
                    sizeBytes={file.sizeBytes}
                    modifiedAt={file.modifiedAt}
                    isDirectory={file.isDirectory}
                    category={file.category}
                  />
                </div>
              </FileContextMenu>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
