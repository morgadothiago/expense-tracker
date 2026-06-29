import React, { createContext, useCallback, useContext, useState } from 'react';

interface AppContextValue {
  expenseVersion: number;
  refreshExpenses: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [expenseVersion, setExpenseVersion] = useState(0);

  const refreshExpenses = useCallback(() => {
    setExpenseVersion((v) => v + 1);
  }, []);

  return (
    <AppContext.Provider value={{ expenseVersion, refreshExpenses }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppContextProvider');
  return ctx;
}
