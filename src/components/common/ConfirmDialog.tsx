import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, space, type as type_ } from '../../theme/tokens';

interface Props {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  confirmDestructive?: boolean;
}

export function ConfirmDialog({
  visible,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Excluir',
  confirmDestructive = true,
}: Props): React.JSX.Element {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, confirmDestructive ? styles.destructive : styles.primary]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.xxl,
  },
  dialog: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: space.xxl,
    width: '100%',
    maxWidth: 360,
  },
  message: { ...type_.body, color: colors.neutral[900], marginBottom: space.xl, lineHeight: 22 },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: space.md },
  btn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: radius.sm },
  cancel: { backgroundColor: colors.neutral[100] },
  destructive: { backgroundColor: colors.semantic.danger },
  primary: { backgroundColor: colors.brand.primary },
  cancelText: { ...type_.label, color: colors.neutral[700] },
  confirmText: { ...type_.label, color: colors.neutral[0] },
});
