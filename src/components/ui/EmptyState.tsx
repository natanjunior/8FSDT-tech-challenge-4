import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Icon, IconName } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  action?: { label: string; onPress: () => void };
  testID?: string;
}

export function EmptyState({
  title,
  subtitle,
  icon = 'inbox-outline',
  action,
  testID,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-6">
      <View testID={testID ? `${testID}-icon` : undefined}>
        <Icon name={icon} size={64} color={colors.muted} />
      </View>
      <Text className="text-center text-lg font-sans-bold text-primary">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-center font-sans text-sm text-muted">{subtitle}</Text>
      ) : null}
      {action ? (
        <View className="mt-2 w-full max-w-xs">
          <Button title={action.label} onPress={action.onPress} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}
