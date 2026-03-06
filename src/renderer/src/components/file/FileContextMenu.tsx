import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@renderer/components/ui/context-menu'
import { FolderKanban, Layers, BookOpen, Archive, Inbox, ExternalLink, FolderOpen } from 'lucide-react'
import { useFileStore } from '@renderer/store/fileStore'
import { ParaCategory } from '@renderer/types/para'

interface FileContextMenuProps {
  filePath: string
  currentCategory: ParaCategory
  children: React.ReactNode
}

const CATEGORIES = [
  { id: ParaCategory.INBOX, label: 'Inbox', icon: Inbox },
  { id: ParaCategory.PROJECTS, label: 'Projects', icon: FolderKanban },
  { id: ParaCategory.AREAS, label: 'Areas', icon: Layers },
  { id: ParaCategory.RESOURCES, label: 'Resources', icon: BookOpen },
  { id: ParaCategory.ARCHIVE, label: 'Archive', icon: Archive }
]

export function FileContextMenu({
  filePath,
  currentCategory,
  children
}: FileContextMenuProps) {
  const classifyFile = useFileStore((s) => s.classifyFile)
  const rootPath = useFileStore((s) => s.rootPath)

  const handleMoveTo = (category: ParaCategory) => {
    classifyFile(filePath, category)
    if (window.api && rootPath) {
      window.api.setClassification(filePath, rootPath, category)
    }
  }

  const handleOpenFile = () => {
    if (window.api) {
      window.api.openFile(filePath)
    }
  }

  const handleShowInExplorer = () => {
    if (window.api) {
      window.api.showInExplorer(filePath)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuSub>
          <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {CATEGORIES.filter((c) => c.id !== currentCategory).map((cat) => (
              <ContextMenuItem
                key={cat.id}
                onClick={() => handleMoveTo(cat.id)}
              >
                <cat.icon className="mr-2 h-4 w-4" />
                {cat.label}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleOpenFile}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open File
        </ContextMenuItem>
        <ContextMenuItem onClick={handleShowInExplorer}>
          <FolderOpen className="mr-2 h-4 w-4" />
          Show in Explorer
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
