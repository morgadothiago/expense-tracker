import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ExpensesStackParamList } from '../navigation/AppNavigator';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { getExpenseById } from '../storage/expenseRepository';
import { formatCurrency } from '../utils/currency';
import { colors } from '../theme/tokens';
import type { ExpenseWithCategory } from '../types';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'EditExpense'>;

export function EditExpenseScreen({ route, navigation }: Props): React.JSX.Element {
  const { expenseId } = route.params;
  const db = useSQLiteContext();
  const { updateExpense, deleteExpense } = useExpenses();
  const { categories } = useCategories();
  const [expense, setExpense] = useState<ExpenseWithCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    getExpenseById(db, expenseId).then(setExpense);
  }, [db, expenseId]);

  if (!expense) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  const amountFormatted = (expense.amount / 100).toFixed(2).replace('.', ',');

  async function handleSubmit(values: {
    amount: number;
    categoryId: number;
    date: string;
    description?: string;
  }): Promise<void> {
    try {
      setIsLoading(true);
      await updateExpense(expenseId, {
        amount: values.amount,
        categoryId: values.categoryId,
        date: values.date,
        description: values.description,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o gasto.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      await deleteExpense(expenseId);
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o gasto.');
    }
  }

  return (
    <>
      <ExpenseForm
        initialValues={{
          amountInput: amountFormatted,
          categoryId: expense.categoryId,
          date: expense.date,
          description: expense.description ?? '',
        }}
        categories={categories}
        onSubmit={handleSubmit}
        onDelete={() => setConfirmVisible(true)}
        isLoading={isLoading}
      />
      <ConfirmDialog
        visible={confirmVisible}
        message={`Excluir este gasto de ${formatCurrency(expense.amount)}?`}
        onConfirm={() => {
          setConfirmVisible(false);
          void handleDelete();
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
