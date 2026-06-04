import React from 'react';
import { Text, View } from 'react-native';

type BadgeVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  info: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  error: { bg: 'bg-error/10', text: 'text-error' },
  neutral: { bg: 'bg-secondary', text: 'text-foreground' },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const s = STYLES[variant];
  return (
    <View className={`self-start rounded-full px-2 py-0.5 ${s.bg}`}>
      <Text className={`text-xs font-medium ${s.text}`}>{label}</Text>
    </View>
  );
}
