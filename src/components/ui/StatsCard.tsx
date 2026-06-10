import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon, IconName } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';
import { editorialShadow } from '@/theme/elevation';

type StatsCardVariant = 'default' | 'primary';

interface StatsCardProps {
  icon: IconName;
  value: number;
  label: string;
  variant?: StatsCardVariant;
  testID?: string;
}

export function StatsCard({
  icon,
  value,
  label,
  variant = 'default',
  testID,
}: StatsCardProps) {
  if (variant === 'primary') {
    return (
      <View
        testID={testID}
        className="flex-1 gap-2 rounded-xl bg-primary p-4"
        style={editorialShadow}
      >
        <View testID={testID ? `${testID}-icon` : undefined}>
          <Icon name={icon} size={20} color={colors.primaryForeground} />
        </View>
        <Text className="font-sans-extrabold text-3xl text-primary-foreground">
          {value}
        </Text>
        <Text className="font-sans-medium text-[10px] uppercase tracking-wider text-primary-foreground/80">
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View testID={testID} className="flex-1">
      <Card>
        <View className="gap-2">
          <View testID={testID ? `${testID}-icon` : undefined}>
            <Icon name={icon} size={20} color={colors.primary} />
          </View>
          <Text className="font-sans-extrabold text-3xl text-primary">
            {value}
          </Text>
          <Text className="font-sans-medium text-[10px] uppercase tracking-wider text-muted">
            {label}
          </Text>
        </View>
      </Card>
    </View>
  );
}
