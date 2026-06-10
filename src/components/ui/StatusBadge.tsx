import React from 'react';
import { Text, View } from 'react-native';
import type { PostStatus } from '@/types/api';

interface StatusBadgeProps {
  status: PostStatus;
  testID?: string;
}

const CONFIG: Record<
  PostStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PUBLISHED: {
    label: 'PUBLICADO',
    bg: 'bg-status-published/10',
    text: 'text-status-published',
    dot: 'bg-status-published',
  },
  DRAFT: {
    label: 'RASCUNHO',
    bg: 'bg-status-draft/10',
    text: 'text-status-draft',
    dot: 'bg-status-draft',
  },
  ARCHIVED: {
    label: 'ARQUIVADO',
    bg: 'bg-status-archived/10',
    text: 'text-status-archived',
    dot: 'bg-status-archived',
  },
};

export function StatusBadge({ status, testID }: StatusBadgeProps) {
  const c = CONFIG[status];
  return (
    <View
      testID={testID}
      className={`flex-row items-center self-start rounded-full px-2.5 py-0.5 ${c.bg}`}
    >
      <View
        testID={testID ? `${testID}-dot` : undefined}
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${c.dot}`}
      />
      <Text className={`font-sans-bold text-[10px] ${c.text}`}>{c.label}</Text>
    </View>
  );
}
