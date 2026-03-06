import { getDb } from './connection'

interface ClassificationRow {
  file_path: string
  root_path: string
  category: string
  classified_at: string
  original_path: string | null
}

interface SettingRow {
  key: string
  value: string
}

export function getClassifications(rootPath: string) {
  const db = getDb()
  const rows = db
    .prepare('SELECT file_path, root_path, category, classified_at, original_path FROM classifications WHERE root_path = ?')
    .all(rootPath) as ClassificationRow[]

  return rows.map((r) => ({
    filePath: r.file_path,
    rootPath: r.root_path,
    category: r.category,
    classifiedAt: r.classified_at,
    originalPath: r.original_path
  }))
}

export function setClassification(
  filePath: string,
  rootPath: string,
  category: string
): void {
  const db = getDb()
  db.prepare(
    `INSERT INTO classifications (file_path, root_path, category)
     VALUES (?, ?, ?)
     ON CONFLICT(file_path, root_path) DO UPDATE SET
       category = excluded.category,
       classified_at = datetime('now')`
  ).run(filePath, rootPath, category)
}

export function bulkSetClassifications(
  entries: { filePath: string; category: string }[],
  rootPath: string
): void {
  const db = getDb()
  const stmt = db.prepare(
    `INSERT INTO classifications (file_path, root_path, category)
     VALUES (?, ?, ?)
     ON CONFLICT(file_path, root_path) DO UPDATE SET
       category = excluded.category,
       classified_at = datetime('now')`
  )

  const transaction = db.transaction(() => {
    for (const entry of entries) {
      stmt.run(entry.filePath, rootPath, entry.category)
    }
  })

  transaction()
}

export function deleteClassification(filePath: string, rootPath: string): void {
  const db = getDb()
  db.prepare('DELETE FROM classifications WHERE file_path = ? AND root_path = ?').run(filePath, rootPath)
}

export function getSettings(): Record<string, string> {
  const db = getDb()
  const rows = db.prepare('SELECT key, value FROM settings').all() as SettingRow[]
  const result: Record<string, string> = {}
  for (const row of rows) {
    result[row.key] = row.value
  }
  return result
}

export function setSetting(key: string, value: string): void {
  const db = getDb()
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(key, value)
}
