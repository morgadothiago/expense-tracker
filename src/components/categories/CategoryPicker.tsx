import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import type { Category } from '../../types';
import { CategoryBadge } from './CategoryBadge';
import { colors, space, touch } from '../../theme/tokens';

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ categories, selectedId, onSelect }: Props): React.JSX.Element {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const selected = item.id === selectedId;
        return (
          <Pressable
            onPress={() => onSelect(item)}
            style={[styles.item, selected && styles.selected]}
          >
            <CategoryBadge category={item} size="md" />
            {selected && <View style={[styles.dot, { backgroundColor: item.color }]} />}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm, paddingHorizontal: 2, paddingVertical: 4 },
  item: {
    alignItems: 'center',
    gap: space.xs,
    padding: space.xs,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: touch.minSize,
    justifyContent: 'center',
  },
  selected: { borderColor: colors.neutral[900] },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
