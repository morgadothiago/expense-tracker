import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';
import type { Expense, ExpenseWithCategory } from '../types';
import {
  addExpense as repoAdd,
  getExpenses as repoGet,
  updateExpense as repoUpdate,
  deleteExpense as repoDelete,
} from '../storage/expenseRepository';
import { useAppContext } from '../context/AppContext';

interface UseExpensesReturn {
  expenses: ExpenseWithCategory[];
  isLoading: boolean;
  addExpense: (data: {
    amount: number;
    categoryId: number;
    date: string;
    description?: string;
  }) => Promise<void>;
  updateExpense: (
    id: number,
    data: Partial<Pick<Expense, 'amount' | 'categoryId' | 'date' | 'description'>>,
  ) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
}

export function useExpenses(): UseExpensesReturn {
  const db = useSQLiteContext();
  const { expenseVersion, refreshExpenses } = useAppContext();
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repoGet(db).then((data) => {
      if (!cancelled) {
        setExpenses(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, expenseVersion]);

  const addExpense = useCallback(
    async (data: { amount: number; categoryId: number; date: string; description?: string }) => {
      await repoAdd(db, data);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      refreshExpenses();
    },
    [db, refreshExpenses],
  );

  const updateExpense = useCallback(
    async (
      id: number,
      data: Partial<Pick<Expense, 'amount' | 'categoryId' | 'date' | 'description'>>,
    ) => {
      await repoUpdate(db, id, data);
      refreshExpenses();
    },
    [db, refreshExpenses],
  );

  const deleteExpense = useCallback(
    async (id: number) => {
      await repoDelete(db, id);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      refreshExpenses();
    },
    [db, refreshExpenses],
  );

  return { expenses, isLoading, addExpense, updateExpense, deleteExpense };
}
