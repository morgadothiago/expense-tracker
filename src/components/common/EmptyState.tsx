import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, space, type as type_ } from '../../theme/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  message: string;
  hint?: string;
  iconName?: IoniconsName;
}

export function EmptyState({
  message,
  hint,
  iconName = 'receipt-outline',
}: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconName} size={36} color={colors.brand.primary} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.xxxl,
    gap: space.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.brand.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  message: {
    ...type_.title,
    color: colors.neutral[900],
    textAlign: 'center',
  },
  hint: {
    ...type_.body,
    color: colors.neutral[500],
    textAlign: 'center',
  },
});
