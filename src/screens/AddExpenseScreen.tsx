import React, { useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ExpensesStackParamList } from '../navigation/AppNavigator';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'AddExpense'>;

export function AddExpenseScreen({ navigation }: Props): React.JSX.Element {
  const { addExpense } = useExpenses();
  const { categories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: {
    amount: number;
    categoryId: number;
    date: string;
    description?: string;
  }): Promise<void> {
    try {
      setIsLoading(true);
      await addExpense(values);
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o gasto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return <ExpenseForm categories={categories} onSubmit={handleSubmit} isLoading={isLoading} />;
}
