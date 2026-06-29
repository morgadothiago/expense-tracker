import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatMonthLabel } from '../../utils/date';
import { colors, touch, type as type_ } from '../../theme/tokens';

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNavigator({ year, month, onPrev, onNext }: Props): React.JSX.Element {
  const label = formatMonthLabel(year, month);
  return (
    <View style={styles.container}>
      <Pressable onPress={onPrev} style={styles.arrow} hitSlop={4}>
        <Text style={styles.arrowText}>‹</Text>
      </Pressable>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onNext} style={styles.arrow} hitSlop={4}>
        <Text style={styles.arrowText}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    height: 56,
  },
  arrow: {
    minWidth: touch.minSize,
    minHeight: touch.minSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontSize: 32, color: colors.neutral[700], lineHeight: 36 },
  label: {
    ...type_.title,
    color: colors.neutral[900],
    textTransform: 'capitalize',
    minWidth: 220,
    textAlign: 'center',
  },
});
