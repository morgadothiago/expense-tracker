import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { MonthlySummary } from '../types';
import { getMonthlySummary } from '../storage/expenseRepository';
import { useAppContext } from '../context/AppContext';

interface UseMonthlySummaryReturn {
  summary: MonthlySummary | null;
  isLoading: boolean;
}

export function useMonthlySummary(year: number, month: number): UseMonthlySummaryReturn {
  const db = useSQLiteContext();
  const { expenseVersion } = useAppContext();
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getMonthlySummary(db, year, month).then((data) => {
      if (!cancelled) {
        setSummary(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, year, month, expenseVersion]);

  return { summary, isLoading };
}
