import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  Folder,
  FileJson
} from 'lucide-react'

const EXTENSION_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Text
  txt: FileText,
  md: FileText,
  doc: FileText,
  docx: FileText,
  pdf: FileText,
  rtf: FileText,

  // Images
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  svg: FileImage,
  webp: FileImage,
  ico: FileImage,
  bmp: FileImage,

  // Video
  mp4: FileVideo,
  avi: FileVideo,
  mkv: FileVideo,
  mov: FileVideo,
  wmv: FileVideo,
  webm: FileVideo,

  // Audio
  mp3: FileAudio,
  wav: FileAudio,
  flac: FileAudio,
  ogg: FileAudio,
  aac: FileAudio,

  // Code
  js: FileCode,
  ts: FileCode,
  jsx: FileCode,
  tsx: FileCode,
  py: FileCode,
  rb: FileCode,
  go: FileCode,
  rs: FileCode,
  java: FileCode,
  c: FileCode,
  cpp: FileCode,
  h: FileCode,
  css: FileCode,
  scss: FileCode,
  html: FileCode,
  xml: FileCode,
  yaml: FileCode,
  yml: FileCode,
  toml: FileCode,

  // Data
  json: FileJson,
  csv: FileSpreadsheet,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,

  // Archives
  zip: FileArchive,
  tar: FileArchive,
  gz: FileArchive,
  rar: FileArchive,
  '7z': FileArchive
}

interface FileIconProps {
  extension: string
  isDirectory: boolean
  className?: string
}

export function FileIcon({ extension, isDirectory, className = 'h-4 w-4' }: FileIconProps) {
  if (isDirectory) {
    return <Folder className={className} />
  }

  const Icon = EXTENSION_MAP[extension.toLowerCase()] ?? File
  return <Icon className={className} />
}
