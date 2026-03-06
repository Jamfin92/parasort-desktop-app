import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { TitleBar } from '@renderer/components/layout/TitleBar'
import { Toolbar } from '@renderer/components/layout/Toolbar'
import { KanbanBoard } from '@renderer/components/kanban/KanbanBoard'
import { StatusBar } from '@renderer/components/layout/StatusBar'
import { useTheme } from '@renderer/hooks/useTheme'
import { useFileWatcher } from '@renderer/hooks/useFileWatcher'

function App(): React.JSX.Element {
  useTheme()
  useFileWatcher()

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <TitleBar />
        <Toolbar />
        <KanbanBoard />
        <StatusBar />
      </div>
    </TooltipProvider>
  )
}

export default App
