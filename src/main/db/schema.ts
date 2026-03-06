import { getDb } from './connection'

export function runMigrations(): void {
  const db = getDb()

  db.exec(`
    CREATE TABLE IF NOT EXISTS classifications (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path     TEXT    NOT NULL,
      root_path     TEXT    NOT NULL,
      category      TEXT    NOT NULL CHECK(category IN ('inbox','projects','areas','resources','archive')),
      classified_at TEXT    NOT NULL DEFAULT (datetime('now')),
      original_path TEXT,
      UNIQUE(file_path, root_path)
    );

    CREATE INDEX IF NOT EXISTS idx_classifications_root
      ON classifications(root_path);

    CREATE INDEX IF NOT EXISTS idx_classifications_category
      ON classifications(root_path, category);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)
}
