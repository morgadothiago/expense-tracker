import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Category } from '../../types';
import { parseCurrencyInput } from '../../utils/currency';
import { todayISO } from '../../utils/date';
import { CategoryPicker } from '../categories/CategoryPicker';
import { colors, space, type as type_, radius, touch } from '../../theme/tokens';

export interface ExpenseFormValues {
  amountInput: string;
  categoryId: number | null;
  date: string;
  description: string;
}

interface Props {
  initialValues?: Partial<ExpenseFormValues>;
  categories: Category[];
  onSubmit: (values: {
    amount: number;
    categoryId: number;
    date: string;
    description?: string;
  }) => Promise<void>;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function ExpenseForm({
  initialValues,
  categories,
  onSubmit,
  onDelete,
  isLoading = false,
}: Props): React.JSX.Element {
  const [amountInput, setAmountInput] = useState(initialValues?.amountInput ?? '');
  const [categoryId, setCategoryId] = useState<number | null>(initialValues?.categoryId ?? null);
  const [date, setDate] = useState(initialValues?.date ?? todayISO());
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(): Promise<void> {
    const newErrors: { amount?: string; category?: string } = {};
    const parsedAmount = parseCurrencyInput(amountInput);
    if (!parsedAmount) newErrors.amount = 'Informe um valor maior que zero.';
    if (!categoryId) newErrors.category = 'Selecione uma categoria.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    await onSubmit({
      amount: parsedAmount!,
      categoryId: categoryId!,
      date,
      description: description.trim() || undefined,
    });
  }

  function inputStyle(field: string, hasError?: boolean) {
    return [
      styles.input,
      focusedField === field && styles.inputFocused,
      hasError && styles.inputError,
    ];
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={inputStyle('amount', !!errors.amount)}
            value={amountInput}
            onChangeText={(t) => {
              setAmountInput(t);
              setErrors((e) => ({ ...e, amount: undefined }));
            }}
            onFocus={() => setFocusedField('amount')}
            onBlur={() => setFocusedField(null)}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={colors.neutral[500]}
          />
          {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
          <CategoryPicker
            categories={categories}
            selectedId={categoryId}
            onSelect={(cat) => {
              setCategoryId(cat.id);
              setErrors((e) => ({ ...e, category: undefined }));
            }}
          />
          {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={inputStyle('date')}
            value={date}
            onChangeText={setDate}
            onFocus={() => setFocusedField('date')}
            onBlur={() => setFocusedField(null)}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.neutral[500]}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[inputStyle('desc'), styles.textArea]}
            value={description}
            onChangeText={setDescription}
            onFocus={() => setFocusedField('desc')}
            onBlur={() => setFocusedField(null)}
            multiline
            numberOfLines={3}
            placeholder="Adicione uma nota..."
            placeholderTextColor={colors.neutral[500]}
            maxLength={500}
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          style={isLoading ? styles.saveBtnDisabled : undefined}
        >
          <LinearGradient
            colors={[colors.brand.primary, colors.brand.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.neutral[0]} />
            ) : (
              <Text style={styles.saveBtnText}>Salvar</Text>
            )}
          </LinearGradient>
        </Pressable>

        {onDelete ? (
          <Pressable style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteBtnText}>Excluir gasto</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: space.xl, gap: space.xl, paddingBottom: 40 },
  field: { gap: space.sm },
  label: { ...type_.label, color: colors.neutral[700] },
  input: {
    borderWidth: 1.5,
    borderColor: colors.neutral[300],
    borderRadius: radius.md,
    padding: space.md,
    minHeight: touch.minSize,
    ...type_.body,
    color: colors.neutral[900],
    backgroundColor: colors.neutral[0],
  },
  inputFocused: { borderColor: colors.brand.primary, backgroundColor: colors.brand.primaryLight },
  inputError: { borderColor: colors.semantic.danger },
  textArea: { height: 88, textAlignVertical: 'top' },
  errorText: { ...type_.caption, color: colors.semantic.danger },
  saveBtn: {
    borderRadius: radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.xs,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: colors.neutral[0], fontWeight: '700', fontSize: 16 },
  deleteBtn: { alignItems: 'center', paddingVertical: space.md },
  deleteBtnText: { color: colors.semantic.danger, ...type_.body, fontWeight: '600' },
});
