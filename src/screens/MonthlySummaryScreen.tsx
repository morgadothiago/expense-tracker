import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MonthNavigator } from '../components/common/MonthNavigator';
import { SpendingChart } from '../components/charts/SpendingChart';
import { useMonthlySummary } from '../hooks/useMonthlySummary';
import { currentYearMonth, nextMonth, prevMonth } from '../utils/date';
import { formatCurrency } from '../utils/currency';
import { colors, space, radius, type as type_ } from '../theme/tokens';

export function MonthlySummaryScreen(): React.JSX.Element {
  const init = currentYearMonth();
  const [year, setYear] = useState(init.year);
  const [month, setMonth] = useState(init.month);
  const { summary, isLoading } = useMonthlySummary(year, month);

  function handlePrev(): void {
    const p = prevMonth(year, month);
    setYear(p.year);
    setMonth(p.month);
  }

  function handleNext(): void {
    const n = nextMonth(year, month);
    setYear(n.year);
    setMonth(n.month);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MonthNavigator year={year} month={month} onPrev={handlePrev} onNext={handleNext} />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.brand.primary} style={styles.loader} />
      ) : (
        <>
          <LinearGradient
            colors={[colors.brand.primaryDark, colors.brand.primary, '#818CF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.totalCard}
          >
            <Text style={styles.totalLabel}>total gasto</Text>
            <Text style={styles.totalAmount}>{formatCurrency(summary?.totalAmount ?? 0)}</Text>
            {summary && summary.byCategory.length > 0 && (
              <Text style={styles.totalSub}>
                {summary.byCategory.length}{' '}
                {summary.byCategory.length === 1 ? 'categoria' : 'categorias'}
              </Text>
            )}
          </LinearGradient>

          {summary && summary.byCategory.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Por categoria</Text>
              {summary.byCategory.map((item) => (
                <View key={item.category.id} style={styles.catRow}>
                  <View style={[styles.catDot, { backgroundColor: item.category.color }]} />
                  <Text style={styles.catName} numberOfLines={1}>
                    {item.category.name}
                  </Text>
                  <Text style={styles.catAmount}>{formatCurrency(item.total)}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribuição</Text>
            <SpendingChart data={summary?.byCategory ?? []} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[100] },
  content: { padding: space.lg, gap: space.lg, paddingBottom: 48 },
  loader: { marginTop: 48 },
  totalCard: {
    borderRadius: radius.xl,
    paddingVertical: 32,
    paddingHorizontal: space.xxl,
    alignItems: 'center',
    gap: 6,
    minHeight: 152,
    justifyContent: 'center',
  },
  totalLabel: {
    ...type_.label,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: { ...type_.amountLg, color: colors.neutral[0], fontVariant: ['tabular-nums'] },
  totalSub: { ...type_.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  section: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  sectionTitle: {
    ...type_.label,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 6,
  },
  catDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  catName: { flex: 1, ...type_.body, color: colors.neutral[700] },
  catAmount: { ...type_.title, color: colors.neutral[900], fontVariant: ['tabular-nums'] },
});
