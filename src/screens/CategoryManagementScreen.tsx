import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Category } from '../types';
import { CategoryBadge } from '../components/categories/CategoryBadge';
import { CategoryPreview } from '../components/categories/CategoryPreview';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useCategories } from '../hooks/useCategories';
import { colors, space, radius, touch, type as type_ } from '../theme/tokens';

const PRESET_COLORS = colors.category as unknown as string[];

export function CategoryManagementScreen(): React.JSX.Element {
  const { categories, createCategory, deleteCategory } = useCategories();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[6]);
  const [newIcon, setNewIcon] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreate(): Promise<void> {
    if (!newName.trim()) {
      Alert.alert('Atenção', 'O nome da categoria é obrigatório.');
      return;
    }
    try {
      setIsSaving(true);
      await createCategory({
        name: newName.trim(),
        color: newColor,
        icon: newIcon.trim() || undefined,
      });
      setNewName('');
      setNewIcon('');
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar categoria.';
      Alert.alert('Erro', msg);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(category: Category): Promise<void> {
    try {
      await deleteCategory(category.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir categoria.';
      Alert.alert('Não foi possível excluir', msg);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <CategoryBadge category={item} size="lg" />
            {!item.isDefault && (
              <Pressable
                onPress={() => setDeleteTarget(item)}
                style={styles.deleteBtn}
                hitSlop={12}
              >
                <Text style={styles.deleteText}>✕</Text>
              </Pressable>
            )}
          </View>
        )}
        ListFooterComponent={
          showForm ? (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Nova categoria</Text>
              <CategoryPreview name={newName} color={newColor} icon={newIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={newName}
                onChangeText={setNewName}
                placeholderTextColor={colors.neutral[500]}
                maxLength={50}
              />
              <TextInput
                style={styles.input}
                placeholder="Ícone (emoji, opcional)"
                value={newIcon}
                onChangeText={setNewIcon}
                placeholderTextColor={colors.neutral[500]}
                maxLength={4}
              />
              <Text style={styles.colorLabel}>Cor</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorScroll}
              >
                {PRESET_COLORS.map((c) => (
                  <Pressable
                    key={c}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c },
                      c === newColor && styles.colorSwatchSelected,
                    ]}
                    onPress={() => setNewColor(c)}
                    hitSlop={4}
                  />
                ))}
              </ScrollView>
              <View style={styles.formActions}>
                <Pressable onPress={() => setShowForm(false)} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    void handleCreate();
                  }}
                  style={[styles.saveBtn, isSaving && styles.disabled]}
                  disabled={isSaving}
                >
                  <Text style={styles.saveText}>Salvar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.addBtn} onPress={() => setShowForm(true)}>
              <Text style={styles.addBtnText}>+ Nova categoria</Text>
            </Pressable>
          )
        }
      />
      <ConfirmDialog
        visible={deleteTarget !== null}
        message={`Excluir a categoria "${deleteTarget?.name}"?`}
        onConfirm={() => deleteTarget && void handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[100] },
  list: { padding: space.lg, gap: space.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[0],
    borderRadius: radius.md,
    padding: space.md,
    minHeight: touch.minSize,
  },
  deleteBtn: { padding: space.xs },
  deleteText: { fontSize: 16, color: colors.semantic.danger },
  form: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
    marginTop: space.sm,
  },
  formTitle: { ...type_.title, color: colors.neutral[900] },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: radius.sm,
    padding: space.md,
    minHeight: touch.minSize,
    fontSize: type_.body.fontSize,
    color: colors.neutral[900],
    backgroundColor: '#fafafa',
  },
  colorLabel: { ...type_.label, color: colors.neutral[700] },
  colorScroll: { flexGrow: 0 },
  colorSwatch: {
    width: touch.colorSwatch,
    height: touch.colorSwatch,
    borderRadius: touch.colorSwatch / 2,
    marginRight: space.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: { borderColor: colors.neutral[900] },
  formActions: {
    flexDirection: 'row',
    gap: space.md,
    justifyContent: 'flex-end',
    marginTop: space.xs,
  },
  cancelBtn: {
    paddingHorizontal: space.lg,
    paddingVertical: 9,
    borderRadius: radius.sm,
    backgroundColor: colors.neutral[100],
  },
  cancelText: { ...type_.label, color: colors.neutral[700] },
  saveBtn: {
    paddingHorizontal: space.lg,
    paddingVertical: 9,
    borderRadius: radius.sm,
    backgroundColor: colors.brand.primary,
  },
  disabled: { opacity: 0.6 },
  saveText: { ...type_.label, color: colors.neutral[0] },
  addBtn: {
    marginTop: space.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    borderStyle: 'dashed',
    paddingVertical: space.lg,
    alignItems: 'center',
  },
  addBtnText: { color: colors.brand.primary, fontSize: 15, fontWeight: '600' },
});
