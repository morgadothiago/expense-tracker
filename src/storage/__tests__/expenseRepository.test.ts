import { createTestDb } from './testDb';
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
} from '../expenseRepository';
import { seedDefaultCategories, createCategory } from '../categoryRepository';

// Cast TestDatabase to any so it satisfies the expo-sqlite type parameter
type AnyDb = Parameters<typeof addExpense>[0];

async function setup() {
  const db = await createTestDb();
  await seedDefaultCategories(db as unknown as AnyDb);
  const cats = await (db as unknown as AnyDb).getAllAsync<{ id: number; name: string }>(
    'SELECT id, name FROM categories',
    [],
  );
  const categoryId = cats[0]!.id;
  return { db: db as unknown as AnyDb, categoryId };
}

describe('expenseRepository', () => {
  test('EXP-01: add and retrieve expense with category joined', async () => {
    const { db, categoryId } = await setup();
    const expense = await addExpense(db, {
      amount: 4590,
      categoryId,
      date: '2026-06-28',
    });
    expect(expense.amount).toBe(4590);
    expect(expense.date).toBe('2026-06-28');
    expect(expense.category.id).toBe(categoryId);
    expect(typeof expense.category.name).toBe('string');
    expect(typeof expense.category.color).toBe('string');
  });

  test('EXP-02: get expense by ID', async () => {
    const { db, categoryId } = await setup();
    const created = await addExpense(db, { amount: 1000, categoryId, date: '2026-06-01' });
    const found = await getExpenseById(db, created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
    expect(found!.amount).toBe(1000);
  });

  test('EXP-03: getExpenses returns all ordered date DESC', async () => {
    const { db, categoryId } = await setup();
    await addExpense(db, { amount: 100, categoryId, date: '2026-06-01' });
    await addExpense(db, { amount: 200, categoryId, date: '2026-06-10' });
    await addExpense(db, { amount: 300, categoryId, date: '2026-06-05' });
    const expenses = await getExpenses(db);
    expect(expenses).toHaveLength(3);
    expect(expenses[0]!.date >= expenses[1]!.date).toBe(true);
    expect(expenses[1]!.date >= expenses[2]!.date).toBe(true);
  });

  test('EXP-04: update expense amount', async () => {
    const { db, categoryId } = await setup();
    const expense = await addExpense(db, { amount: 500, categoryId, date: '2026-06-15' });
    await updateExpense(db, expense.id, { amount: 999 });
    const updated = await getExpenseById(db, expense.id);
    expect(updated!.amount).toBe(999);
  });

  test('EXP-05: delete expense', async () => {
    const { db, categoryId } = await setup();
    const expense = await addExpense(db, { amount: 750, categoryId, date: '2026-06-20' });
    await deleteExpense(db, expense.id);
    const found = await getExpenseById(db, expense.id);
    expect(found).toBeNull();
  });

  test('EXP-06: monthly summary total for single month', async () => {
    const { db, categoryId } = await setup();
    await addExpense(db, { amount: 1000, categoryId, date: '2026-06-01' });
    await addExpense(db, { amount: 2000, categoryId, date: '2026-06-15' });
    await addExpense(db, { amount: 500, categoryId, date: '2026-07-01' });
    const summary = await getMonthlySummary(db, 2026, 6);
    expect(summary.totalAmount).toBe(3000);
    expect(summary.year).toBe(2026);
    expect(summary.month).toBe(6);
  });

  test('EXP-07: monthly summary for two months is independent', async () => {
    const { db, categoryId } = await setup();
    await addExpense(db, { amount: 1000, categoryId, date: '2026-05-01' });
    await addExpense(db, { amount: 2000, categoryId, date: '2026-06-01' });
    const maySummary = await getMonthlySummary(db, 2026, 5);
    const juneSummary = await getMonthlySummary(db, 2026, 6);
    expect(maySummary.totalAmount).toBe(1000);
    expect(juneSummary.totalAmount).toBe(2000);
  });

  test('EXP-08: monthly summary for empty month returns zero', async () => {
    const { db } = await setup();
    const summary = await getMonthlySummary(db, 2025, 1);
    expect(summary.totalAmount).toBe(0);
    expect(summary.byCategory).toHaveLength(0);
  });

  test('EXP-09: monthly summary by category ordered DESC', async () => {
    const { db } = await setup();
    const rawDb = db as unknown as Parameters<typeof createCategory>[0];
    const catA = await createCategory(rawDb, { name: 'Cat A', color: '#ff0000' });
    const catB = await createCategory(rawDb, { name: 'Cat B', color: '#00ff00' });
    const catC = await createCategory(rawDb, { name: 'Cat C', color: '#0000ff' });
    await addExpense(db, { amount: 300, categoryId: catA.id, date: '2026-06-01' });
    await addExpense(db, { amount: 100, categoryId: catB.id, date: '2026-06-01' });
    await addExpense(db, { amount: 500, categoryId: catC.id, date: '2026-06-01' });
    const summary = await getMonthlySummary(db, 2026, 6);
    expect(summary.byCategory).toHaveLength(3);
    expect(summary.byCategory[0]!.total).toBeGreaterThanOrEqual(summary.byCategory[1]!.total);
    expect(summary.byCategory[1]!.total).toBeGreaterThanOrEqual(summary.byCategory[2]!.total);
    expect(summary.totalAmount).toBe(900);
  });
});
