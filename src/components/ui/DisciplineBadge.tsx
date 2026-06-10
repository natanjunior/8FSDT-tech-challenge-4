import React from 'react';
import { Text, View } from 'react-native';
import { getDisciplineMeta } from '@/lib/disciplines';

interface DisciplineBadgeProps {
  label: string | null | undefined;
  testID?: string;
}

export function DisciplineBadge({ label, testID }: DisciplineBadgeProps) {
  const meta = getDisciplineMeta(label);
  return (
    <View
      testID={testID}
      className="self-start rounded-full px-3 py-1"
      style={{ backgroundColor: meta.color }}
    >
      <Text className="font-sans-black text-[10px] uppercase tracking-widest text-white">
        {meta.label}
      </Text>
    </View>
  );
}
