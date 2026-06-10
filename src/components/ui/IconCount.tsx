import React from 'react';
import { Text, View } from 'react-native';
import { Icon, IconName } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';

type IconCountType = 'comment' | 'bookmark' | 'views';
type IconCountSize = 'sm' | 'md' | 'lg';

interface IconCountProps {
  type: IconCountType;
  count: number;
  size?: IconCountSize;
  testID?: string;
}

const ICON_MAP: Record<IconCountType, IconName> = {
  comment: 'forum',
  bookmark: 'bookmark-outline',
  views: 'eye',
};

const ICON_PX: Record<IconCountSize, number> = { sm: 14, md: 16, lg: 18 };
const TEXT_CLASS: Record<IconCountSize, string> = {
  sm: 'text-[10px]',
  md: 'text-[11px]',
  lg: 'text-xs',
};

export function IconCount({ type, count, size = 'md', testID }: IconCountProps) {
  return (
    <View testID={testID} className="flex-row items-center gap-1">
      <View testID={testID ? `${testID}-icon` : undefined}>
        <Icon name={ICON_MAP[type]} size={ICON_PX[size]} color={colors.outline} />
      </View>
      <Text className={`font-jetbrains text-muted ${TEXT_CLASS[size]}`}>{count}</Text>
    </View>
  );
}
