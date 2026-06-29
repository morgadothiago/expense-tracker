import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ExpenseWithCategory } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatDateShort } from '../../utils/date';
import { colors, space, type as type_, radius } from '../../theme/tokens';

interface Props {
  expense: ExpenseWithCategory;
  onPress: () => void;
}

export function ExpenseItem({ expense, onPress }: Props): React.JSX.Element {
  const { category } = expense;
  const initial = category.icon || category.name.charAt(0).toUpperCase();

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.avatar, { backgroundColor: category.color }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.catName} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={styles.date}>{formatDateShort(expense.date)}</Text>
        {expense.description ? (
          <Text style={styles.desc} numberOfLines={1}>
            {expense.description}
          </Text>
        ) : null}
      </View>

      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    paddingVertical: space.lg,
    paddingHorizontal: space.lg,
    marginHorizontal: space.lg,
    marginVertical: 4,
    gap: space.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  pressed: { opacity: 0.7 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 18,
    color: colors.neutral[0],
    fontWeight: '700',
    lineHeight: 22,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  catName: {
    ...type_.title,
    color: colors.neutral[900],
  },
  date: {
    ...type_.caption,
    color: colors.neutral[500],
  },
  desc: {
    ...type_.caption,
    color: colors.neutral[500],
  },
  amount: {
    ...type_.amount,
    color: colors.neutral[900],
    fontVariant: ['tabular-nums'],
    flexShrink: 0,
  },
});
