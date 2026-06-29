import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CategoryBadge } from './CategoryBadge';
import type { Category } from '../../types';

interface Props {
  name: string;
  color: string;
  icon?: string;
}

export function CategoryPreview({ name, color, icon }: Props): React.JSX.Element {
  const previewCategory: Category = {
    id: 0,
    name: name.trim() || 'Nova categoria',
    color,
    icon: icon ?? null,
    isDefault: false,
    createdAt: '',
  };

  return (
    <View style={styles.container}>
      <CategoryBadge category={previewCategory} size="md" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
