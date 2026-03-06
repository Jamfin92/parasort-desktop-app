import { ParaCategory } from '@renderer/types/para'

export const CATEGORY_ACCENT_COLORS: Record<ParaCategory, string> = {
  [ParaCategory.INBOX]: 'border-l-amber-500',
  [ParaCategory.PROJECTS]: 'border-l-blue-500',
  [ParaCategory.AREAS]: 'border-l-emerald-500',
  [ParaCategory.RESOURCES]: 'border-l-violet-500',
  [ParaCategory.ARCHIVE]: 'border-l-slate-400'
}

export const CATEGORY_BG_HOVER: Record<ParaCategory, string> = {
  [ParaCategory.INBOX]: 'hover:bg-amber-500/5',
  [ParaCategory.PROJECTS]: 'hover:bg-blue-500/5',
  [ParaCategory.AREAS]: 'hover:bg-emerald-500/5',
  [ParaCategory.RESOURCES]: 'hover:bg-violet-500/5',
  [ParaCategory.ARCHIVE]: 'hover:bg-slate-400/5'
}

export const CATEGORY_HEADER_COLORS: Record<ParaCategory, string> = {
  [ParaCategory.INBOX]: 'bg-amber-500',
  [ParaCategory.PROJECTS]: 'bg-blue-500',
  [ParaCategory.AREAS]: 'bg-emerald-500',
  [ParaCategory.RESOURCES]: 'bg-violet-500',
  [ParaCategory.ARCHIVE]: 'bg-slate-400'
}

export const CATEGORY_DROP_HIGHLIGHT: Record<ParaCategory, string> = {
  [ParaCategory.INBOX]: 'ring-amber-500/50 bg-amber-500/5',
  [ParaCategory.PROJECTS]: 'ring-blue-500/50 bg-blue-500/5',
  [ParaCategory.AREAS]: 'ring-emerald-500/50 bg-emerald-500/5',
  [ParaCategory.RESOURCES]: 'ring-violet-500/50 bg-violet-500/5',
  [ParaCategory.ARCHIVE]: 'ring-slate-400/50 bg-slate-400/5'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
