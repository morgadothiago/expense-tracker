import initSqlJs, { Database } from 'sql.js';

const SCHEMA = `
  PRAGMA foreign_keys = ON;

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
`;

export interface TestDatabase {
  runAsync(sql: string, params?: unknown[]): Promise<{ lastInsertRowId: number; changes: number }>;
  getAllAsync<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  getFirstAsync<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | null>;
  execAsync(sql: string): Promise<void>;
}

function bindValues(params: unknown[]): (string | number | null | Uint8Array)[] {
  return params.map((p) => {
    if (p === undefined) return null;
    return p as string | number | null | Uint8Array;
  });
}

function rowsToObjects(db: Database, sql: string, params: unknown[]): Record<string, unknown>[] {
  const stmt = db.prepare(sql);
  const results: Record<string, unknown>[] = [];
  stmt.bind(bindValues(params));
  while (stmt.step()) {
    results.push(stmt.getAsObject() as Record<string, unknown>);
  }
  stmt.free();
  return results;
}

export async function createTestDb(): Promise<TestDatabase> {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run(SCHEMA);

  return {
    async execAsync(sql: string): Promise<void> {
      db.run(sql);
    },

    async runAsync(
      sql: string,
      params: unknown[] = [],
    ): Promise<{ lastInsertRowId: number; changes: number }> {
      const stmt = db.prepare(sql);
      stmt.bind(bindValues(params));
      stmt.step();
      stmt.free();
      return {
        lastInsertRowId: db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0] as number ?? 0,
        changes: db.getRowsModified(),
      };
    },

    async getAllAsync<T = Record<string, unknown>>(
      sql: string,
      params: unknown[] = [],
    ): Promise<T[]> {
      return rowsToObjects(db, sql, params) as T[];
    },

    async getFirstAsync<T = Record<string, unknown>>(
      sql: string,
      params: unknown[] = [],
    ): Promise<T | null> {
      const rows = rowsToObjects(db, sql, params);
      return (rows[0] as T) ?? null;
    },
  };
}
