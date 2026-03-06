import { FolderOpen, Search, Settings } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Switch } from '@renderer/components/ui/switch'
import { ThemeToggle } from '@renderer/components/settings/ThemeToggle'
import { useFileStore } from '@renderer/store/fileStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUIStore } from '@renderer/store/uiStore'

export function Toolbar() {
  const rootPath = useFileStore((s) => s.rootPath)
  const { sortMode, setSortMode } = useSettingsStore()
  const { searchQuery, setSearchQuery } = useUIStore()

  const handleSelectDirectory = async () => {
    if (!window.api) return
    const selected = await window.api.openDirectoryDialog()
    if (selected) {
      useFileStore.getState().setRootPath(selected)
      const files = await window.api.scanDirectory(
        selected,
        useSettingsStore.getState().scanRecursive
      )
      const classifications = await window.api.getClassifications(selected)
      const classMap = new Map(
        classifications.map((c) => [c.filePath, c.category])
      )
      useFileStore.getState().setFiles(files, classMap)
      await window.api.startWatcher(selected)
    }
  }

  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSelectDirectory}
        className="gap-2"
      >
        <FolderOpen className="h-4 w-4" />
        {rootPath ? 'Change' : 'Open Directory'}
      </Button>

      {rootPath && (
        <span className="truncate text-sm text-muted-foreground max-w-[300px]">
          {rootPath}
        </span>
      )}

      <div className="flex-1" />

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-48 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Virtual</span>
        <Switch
          checked={sortMode === 'physical'}
          onCheckedChange={(checked) =>
            setSortMode(checked ? 'physical' : 'virtual')
          }
        />
        <span className="text-muted-foreground">Physical</span>
      </div>

      <ThemeToggle />

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
