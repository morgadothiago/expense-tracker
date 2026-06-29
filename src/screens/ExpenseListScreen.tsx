import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ExpensesStackParamList } from '../navigation/AppNavigator';
import { ExpenseItem } from '../components/expenses/ExpenseItem';
import { EmptyState } from '../components/common/EmptyState';
import { useExpenses } from '../hooks/useExpenses';
import { colors, layout, radius, shadow } from '../theme/tokens';
import type { ExpenseWithCategory } from '../types';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseList'>;

export function ExpenseListScreen({ navigation }: Props): React.JSX.Element {
  const { expenses, isLoading } = useExpenses();
  const insets = useSafeAreaInsets();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('CategoryManagement')}
          hitSlop={8}
          style={styles.headerIconBtn}
        >
          <Ionicons name="pricetag-outline" size={22} color={colors.brand.primary} />
        </Pressable>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item: ExpenseWithCategory) => String(item.id)}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => navigation.navigate('EditExpense', { expenseId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            iconName="receipt-outline"
            message="Nenhum gasto ainda"
            hint="Toque em + para adicionar"
          />
        }
        contentContainerStyle={expenses.length === 0 ? styles.emptyContent : styles.listContent}
      />
      <Pressable
        style={[styles.fab, { bottom: layout.fabBottom + insets.bottom }]}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Ionicons name="add" size={28} color={colors.neutral[0]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[100] },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingVertical: 12, paddingBottom: 96 },
  emptyContent: { flex: 1 },
  headerIconBtn: { padding: 4 },
  fab: {
    position: 'absolute',
    right: layout.fabBottom,
    width: layout.fabSize,
    height: layout.fabSize,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.md,
  },
});
