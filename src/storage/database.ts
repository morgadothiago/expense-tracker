import * as SQLite from 'expo-sqlite';

export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL COLLATE NOCASE,
      color      TEXT    NOT NULL,
      icon       TEXT,
      is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
      created_at TEXT    NOT NULL,
      UNIQUE (name COLLATE NOCASE)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      amount      INTEGER NOT NULL CHECK (amount > 0),
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      date        TEXT    NOT NULL,
      description TEXT,
      created_at  TEXT    NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_date        ON expenses(date);
    CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
  `);
}
