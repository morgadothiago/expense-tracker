import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import type { CategorySummary } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { EmptyState } from '../common/EmptyState';
import { colors, space, type as type_ } from '../../theme/tokens';

interface Props {
  data: CategorySummary[];
}

export function SpendingChart({ data }: Props): React.JSX.Element {
  if (data.length === 0) {
    return (
      <EmptyState
        iconName="bar-chart-outline"
        message="Nenhum gasto neste mês"
        hint="Navegue para outro mês"
      />
    );
  }

  const pieData = data.map((item) => ({
    value: item.total,
    color: item.category.color,
    focused: false,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        donut
        radius={110}
        innerRadius={60}
        strokeColor={colors.neutral[0]}
        strokeWidth={2}
      />
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.category.id} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: item.category.color }]} />
            <Text style={styles.catName} numberOfLines={1}>
              {item.category.icon ? `${item.category.icon} ` : ''}
              {item.category.name}
            </Text>
            <Text style={styles.catAmount}>{formatCurrency(item.total)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space.xxl, paddingVertical: space.sm },
  legend: { width: '100%', paddingHorizontal: space.lg, gap: space.sm },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  dot: { width: 12, height: 12, borderRadius: 6, flexShrink: 0 },
  catName: { flex: 1, ...type_.body, color: colors.neutral[700] },
  catAmount: { ...type_.label, color: colors.neutral[900] },
});
