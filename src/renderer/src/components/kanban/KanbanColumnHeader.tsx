import {
  Inbox,
  FolderKanban,
  Layers,
  BookOpen,
  Archive
} from 'lucide-react'
import { Badge } from '@renderer/components/ui/badge'
import { CATEGORY_HEADER_COLORS } from '@renderer/lib/constants'
import { cn } from '@renderer/lib/utils'
import { ParaCategory, type ColumnConfig } from '@renderer/types/para'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Inbox,
  FolderKanban,
  Layers,
  BookOpen,
  Archive
}

interface KanbanColumnHeaderProps {
  column: ColumnConfig
  count: number
}

export function KanbanColumnHeader({ column, count }: KanbanColumnHeaderProps) {
  const Icon = ICON_MAP[column.icon] ?? Inbox

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded',
          CATEGORY_HEADER_COLORS[column.id],
          'text-white'
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-sm font-semibold">{column.label}</span>
      <Badge variant="secondary" className="ml-auto text-xs">
        {count}
      </Badge>
    </div>
  )
}
