import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { FileIcon } from '@renderer/components/file/FileIcon'
import { Badge } from '@renderer/components/ui/badge'
import { useUIStore } from '@renderer/store/uiStore'
import { CATEGORY_ACCENT_COLORS, formatFileSize, formatRelativeDate } from '@renderer/lib/constants'
import { cn } from '@renderer/lib/utils'
import type { ParaCategory } from '@renderer/types/para'

interface FileCardProps {
  filePath: string
  fileName: string
  extension: string
  sizeBytes: number
  modifiedAt: string
  isDirectory: boolean
  category: ParaCategory
}

export function FileCard({
  filePath,
  fileName,
  extension,
  sizeBytes,
  modifiedAt,
  isDirectory,
  category
}: FileCardProps) {
  const { isSelected, toggleFileSelection } = useUIStore()
  const selected = isSelected(filePath)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: filePath,
    data: { filePath, fileName, category }
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'flex items-center gap-3 rounded-lg border-l-3 bg-card p-3 shadow-sm transition-all',
        'hover:shadow-md cursor-grab active:cursor-grabbing',
        CATEGORY_ACCENT_COLORS[category],
        selected && 'ring-2 ring-ring',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={() => toggleFileSelection(filePath)}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />

      <FileIcon extension={extension} isDirectory={isDirectory} className="h-4 w-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{fileName}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(sizeBytes)}</span>
          <span>&middot;</span>
          <span>{formatRelativeDate(modifiedAt)}</span>
        </div>
      </div>

      {extension && !isDirectory && (
        <Badge variant="secondary" className="shrink-0 text-xs">
          .{extension}
        </Badge>
      )}
    </div>
  )
}
