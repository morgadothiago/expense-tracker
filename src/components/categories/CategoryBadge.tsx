import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Category } from '../../types';
import { radius, type as type_ } from '../../theme/tokens';

interface Props {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, size = 'md' }: Props): React.JSX.Element {
  const sizeStyle = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.md;
  const textStyle = size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd;
  const iconStyle = size === 'sm' ? styles.iconSm : size === 'lg' ? styles.iconLg : styles.iconMd;
  return (
    <View style={[styles.badge, { backgroundColor: category.color }, sizeStyle]}>
      {category.icon ? <Text style={iconStyle}>{category.icon}</Text> : null}
      <Text style={textStyle} numberOfLines={1}>
        {category.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    gap: 4,
    alignSelf: 'flex-start',
    maxWidth: 160,
  },
  sm: { paddingHorizontal: 7, paddingVertical: 4, minHeight: 24 },
  md: { paddingHorizontal: 10, paddingVertical: 6, minHeight: 32 },
  lg: { paddingHorizontal: 14, paddingVertical: 8, minHeight: 40 },
  iconSm: { fontSize: 11 },
  iconMd: { fontSize: 14 },
  iconLg: { fontSize: 16 },
  textSm: { ...type_.badgeSm, color: '#fff' },
  textMd: { ...type_.badge, color: '#fff' },
  textLg: { ...type_.label, color: '#fff' },
});
