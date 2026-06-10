import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-6">
      <Text className="text-center text-lg font-semibold text-foreground">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-center text-sm text-muted">{subtitle}</Text>
      ) : null}
      {action ? (
        <View className="mt-2 w-full max-w-xs">
          <Button title={action.label} onPress={action.onPress} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}
