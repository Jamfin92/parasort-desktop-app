export enum ParaCategory {
  INBOX = 'inbox',
  PROJECTS = 'projects',
  AREAS = 'areas',
  RESOURCES = 'resources',
  ARCHIVE = 'archive'
}

export interface ColumnConfig {
  id: ParaCategory
  label: string
  description: string
  icon: string
}

export const PARA_COLUMNS: ColumnConfig[] = [
  {
    id: ParaCategory.INBOX,
    label: 'Inbox',
    description: 'Unsorted files',
    icon: 'Inbox'
  },
  {
    id: ParaCategory.PROJECTS,
    label: 'Projects',
    description: 'Active, goal-driven work',
    icon: 'FolderKanban'
  },
  {
    id: ParaCategory.AREAS,
    label: 'Areas',
    description: 'Ongoing responsibilities',
    icon: 'Layers'
  },
  {
    id: ParaCategory.RESOURCES,
    label: 'Resources',
    description: 'Reference material & topics',
    icon: 'BookOpen'
  },
  {
    id: ParaCategory.ARCHIVE,
    label: 'Archive',
    description: 'Inactive items',
    icon: 'Archive'
  }
]
