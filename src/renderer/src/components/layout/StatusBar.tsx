import { useFileStore } from '@renderer/store/fileStore'
import { ParaCategory, PARA_COLUMNS } from '@renderer/types/para'

const CATEGORY_COLORS: Record<ParaCategory, string> = {
  [ParaCategory.INBOX]: 'text-amber-500',
  [ParaCategory.PROJECTS]: 'text-blue-500',
  [ParaCategory.AREAS]: 'text-emerald-500',
  [ParaCategory.RESOURCES]: 'text-violet-500',
  [ParaCategory.ARCHIVE]: 'text-slate-400'
}

export function StatusBar() {
  const files = useFileStore((s) => s.files)

  const counts: Record<ParaCategory, number> = {
    [ParaCategory.INBOX]: 0,
    [ParaCategory.PROJECTS]: 0,
    [ParaCategory.AREAS]: 0,
    [ParaCategory.RESOURCES]: 0,
    [ParaCategory.ARCHIVE]: 0
  }

  for (const file of files) {
    counts[file.category]++
  }

  return (
    <div className="flex h-7 shrink-0 items-center gap-4 border-t border-border bg-muted/50 px-4 text-xs text-muted-foreground">
      {PARA_COLUMNS.map((col) => (
        <span key={col.id}>
          {col.label}:{' '}
          <span className={CATEGORY_COLORS[col.id]}>{counts[col.id]}</span>
        </span>
      ))}
      <span className="ml-auto">Total: {files.length} files</span>
    </div>
  )
}
