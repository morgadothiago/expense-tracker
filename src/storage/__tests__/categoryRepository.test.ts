import { createTestDb } from './testDb';
import {
  seedDefaultCategories,
  getCategories,
  createCategory,
  deleteCategory,
} from '../categoryRepository';
import { addExpense } from '../expenseRepository';

type AnyDb = Parameters<typeof getCategories>[0];

async function setup() {
  const db = await createTestDb();
  const anyDb = db as unknown as AnyDb;
  await seedDefaultCategories(anyDb);
  return anyDb;
}

describe('categoryRepository', () => {
  test('CAT-01: getCategories after seed returns 6 defaults', async () => {
    const db = await setup();
    const categories = await getCategories(db);
    expect(categories).toHaveLength(6);
    expect(categories.every((c) => c.isDefault)).toBe(true);
  });

  test('CAT-02: createCategory adds to list', async () => {
    const db = await setup();
    await createCategory(db, { name: 'Investimentos', color: '#4F46E5' });
    const categories = await getCategories(db);
    expect(categories).toHaveLength(7);
    const created = categories.find((c) => c.name === 'Investimentos');
    expect(created).toBeDefined();
    expect(created!.isDefault).toBe(false);
  });

  test('CAT-03: delete user-created category with no expenses succeeds', async () => {
    const db = await setup();
    const cat = await createCategory(db, { name: 'Temp', color: '#aaaaaa' });
    await deleteCategory(db, cat.id);
    const categories = await getCategories(db);
    expect(categories.find((c) => c.id === cat.id)).toBeUndefined();
  });

  test('CAT-04: delete category with linked expense throws', async () => {
    const db = await setup();
    const cat = await createCategory(db, { name: 'HasExpense', color: '#bbbbbb' });
    await addExpense(db, { amount: 500, categoryId: cat.id, date: '2026-06-01' });
    await expect(deleteCategory(db, cat.id)).rejects.toThrow();
    const categories = await getCategories(db);
    expect(categories.find((c) => c.id === cat.id)).toBeDefined();
  });

  test('CAT-05: delete default category throws', async () => {
    const db = await setup();
    const categories = await getCategories(db);
    const defaultCat = categories.find((c) => c.isDefault)!;
    await expect(deleteCategory(db, defaultCat.id)).rejects.toThrow(
      'Não é possível excluir categorias padrão.',
    );
  });

  test('CAT-06: duplicate category name throws', async () => {
    const db = await setup();
    await createCategory(db, { name: 'Unique', color: '#cccccc' });
    await expect(createCategory(db, { name: 'Unique', color: '#dddddd' })).rejects.toThrow();
  });
});
