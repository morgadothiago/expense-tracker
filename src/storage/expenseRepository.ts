import * as SQLite from 'expo-sqlite';
import type { SQLiteBindValue } from 'expo-sqlite';
import type {
  Category,
  Expense,
  ExpenseWithCategory,
  MonthlySummary,
  CategorySummary,
} from '../types';
import { monthFilterPattern } from '../utils/date';

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.cat_id as number,
    name: row.cat_name as string,
    color: row.cat_color as string,
    icon: (row.cat_icon as string | null) ?? null,
    isDefault: (row.cat_is_default as number) === 1,
    createdAt: row.cat_created_at as string,
  };
}

function rowToExpense(row: Record<string, unknown>): ExpenseWithCategory {
  return {
    id: row.id as number,
    amount: row.amount as number,
    categoryId: row.category_id as number,
    date: row.date as string,
    description: (row.description as string | null) ?? null,
    createdAt: row.created_at as string,
    category: rowToCategory(row),
  };
}

const JOIN_QUERY = `
  SELECT
    e.id, e.amount, e.category_id, e.date, e.description, e.created_at,
    c.id AS cat_id, c.name AS cat_name, c.color AS cat_color,
    c.icon AS cat_icon, c.is_default AS cat_is_default, c.created_at AS cat_created_at
  FROM expenses e
  JOIN categories c ON e.category_id = c.id
`;

export async function addExpense(
  db: SQLite.SQLiteDatabase,
  data: { amount: number; categoryId: number; date: string; description?: string },
): Promise<ExpenseWithCategory> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO expenses (amount, category_id, date, description, created_at) VALUES (?, ?, ?, ?, ?)',
    [data.amount, data.categoryId, data.date, data.description ?? null, now],
  );
  const row = await db.getFirstAsync<Record<string, unknown>>(`${JOIN_QUERY} WHERE e.id = ?`, [
    result.lastInsertRowId,
  ]);
  if (!row) throw new Error('Failed to retrieve created expense');
  return rowToExpense(row);
}

export async function getExpenses(db: SQLite.SQLiteDatabase): Promise<ExpenseWithCategory[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `${JOIN_QUERY} ORDER BY e.date DESC, e.id DESC`,
  );
  return rows.map(rowToExpense);
}

export async function getExpenseById(
  db: SQLite.SQLiteDatabase,
  id: number,
): Promise<ExpenseWithCategory | null> {
  const row = await db.getFirstAsync<Record<string, unknown>>(`${JOIN_QUERY} WHERE e.id = ?`, [id]);
  return row ? rowToExpense(row) : null;
}

export async function updateExpense(
  db: SQLite.SQLiteDatabase,
  id: number,
  data: Partial<Pick<Expense, 'amount' | 'categoryId' | 'date' | 'description'>>,
): Promise<void> {
  const fields: string[] = [];
  const values: SQLiteBindValue[] = [];

  if (data.amount !== undefined) {
    fields.push('amount = ?');
    values.push(data.amount);
  }
  if (data.categoryId !== undefined) {
    fields.push('category_id = ?');
    values.push(data.categoryId);
  }
  if (data.date !== undefined) {
    fields.push('date = ?');
    values.push(data.date);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description ?? null);
  }

  if (fields.length === 0) return;
  values.push(id);
  await db.runAsync(`UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteExpense(db: SQLite.SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}

export async function getMonthlySummary(
  db: SQLite.SQLiteDatabase,
  year: number,
  month: number,
): Promise<MonthlySummary> {
  const pattern = monthFilterPattern(year, month);

  const totalRow = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(amount) as total FROM expenses WHERE date LIKE ?',
    [pattern],
  );

  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT
       e.category_id,
       SUM(e.amount) as cat_total,
       c.id AS cat_id, c.name AS cat_name, c.color AS cat_color,
       c.icon AS cat_icon, c.is_default AS cat_is_default, c.created_at AS cat_created_at
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE e.date LIKE ?
     GROUP BY e.category_id
     ORDER BY cat_total DESC`,
    [pattern],
  );

  const byCategory: CategorySummary[] = rows.map((row) => ({
    category: rowToCategory(row),
    total: row.cat_total as number,
  }));

  return {
    year,
    month,
    totalAmount: totalRow?.total ?? 0,
    byCategory,
  };
}
