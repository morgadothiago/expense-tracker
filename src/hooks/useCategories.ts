import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';
import type { Category } from '../types';
import {
  getCategories as repoGet,
  createCategory as repoCreate,
  deleteCategory as repoDelete,
} from '../storage/categoryRepository';

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  createCategory: (data: { name: string; color: string; icon?: string }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  reload: () => void;
}

export function useCategories(): UseCategoriesReturn {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repoGet(db).then((data) => {
      if (!cancelled) {
        setCategories(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, version]);

  const createCategory = useCallback(
    async (data: { name: string; color: string; icon?: string }) => {
      await repoCreate(db, data);
      reload();
    },
    [db, reload],
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      await repoDelete(db, id);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      reload();
    },
    [db, reload],
  );

  return { categories, isLoading, createCategory, deleteCategory, reload };
}
