export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface Expense {
  id: number;
  amount: number; // integer centavos, always > 0
  categoryId: number;
  date: string; // 'YYYY-MM-DD'
  description: string | null;
  createdAt: string;
}

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface CategorySummary {
  category: Category;
  total: number; // centavos
}

export interface MonthlySummary {
  year: number;
  month: number; // 1–12
  totalAmount: number; // centavos
  byCategory: CategorySummary[];
}
