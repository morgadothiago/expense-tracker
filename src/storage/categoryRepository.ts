import * as SQLite from 'expo-sqlite';
import type { Category } from '../types';

const DEFAULT_CATEGORIES: Array<{ name: string; color: string }> = [
  { name: 'Alimentação', color: '#FF6B6B' },
  { name: 'Transporte', color: '#4ECDC4' },
  { name: 'Moradia', color: '#45B7D1' },
  { name: 'Lazer', color: '#96CEB4' },
  { name: 'Saúde', color: '#FFEAA7' },
  { name: 'Outros', color: '#DDA0DD' },
];

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as number,
    name: row.name as string,
    color: row.color as string,
    icon: (row.icon as string | null) ?? null,
    isDefault: (row.is_default as number) === 1,
    createdAt: row.created_at as string,
  };
}

export async function seedDefaultCategories(db: SQLite.SQLiteDatabase): Promise<void> {
  const count = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) as n FROM categories');
  if (count && count.n > 0) return;

  const now = new Date().toISOString();
  for (const cat of DEFAULT_CATEGORIES) {
    await db.runAsync(
      'INSERT INTO categories (name, color, is_default, created_at) VALUES (?, ?, 1, ?)',
      [cat.name, cat.color, now],
    );
  }
}

export async function getCategories(db: SQLite.SQLiteDatabase): Promise<Category[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM categories ORDER BY is_default DESC, name ASC',
  );
  return rows.map(rowToCategory);
}

export async function createCategory(
  db: SQLite.SQLiteDatabase,
  data: { name: string; color: string; icon?: string },
): Promise<Category> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO categories (name, color, icon, is_default, created_at) VALUES (?, ?, ?, 0, ?)',
    [data.name, data.color, data.icon ?? null, now],
  );
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM categories WHERE id = ?',
    [result.lastInsertRowId],
  );
  if (!row) throw new Error('Failed to retrieve created category');
  return rowToCategory(row);
}

export async function getCategoryExpenseCount(
  db: SQLite.SQLiteDatabase,
  categoryId: number,
): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) as n FROM expenses WHERE category_id = ?',
    [categoryId],
  );
  return row?.n ?? 0;
}

export async function deleteCategory(db: SQLite.SQLiteDatabase, categoryId: number): Promise<void> {
  const cat = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM categories WHERE id = ?',
    [categoryId],
  );
  if (!cat) throw new Error('Category not found');
  if ((cat.is_default as number) === 1) {
    throw new Error('Não é possível excluir categorias padrão.');
  }
  const count = await getCategoryExpenseCount(db, categoryId);
  if (count > 0) {
    throw new Error('Não é possível excluir — esta categoria possui gastos vinculados.');
  }
  await db.runAsync('DELETE FROM categories WHERE id = ?', [categoryId]);
}
