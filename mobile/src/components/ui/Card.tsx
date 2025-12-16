import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  default: {
    ...shadows.sm,
  },
  elevated: {
    ...shadows.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.light,
  },
});
