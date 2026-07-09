import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { getDisciplineMeta } from '@/lib/disciplines';

interface ActiveFilterPillProps {
  label: string;
  onClear: () => void;
}

export function ActiveFilterPill({ label, onClear }: ActiveFilterPillProps) {
  const meta = getDisciplineMeta(label);
  return (
    <View className="flex-row items-center self-start gap-2 rounded-full bg-surface-container px-3 py-1.5">
      <Icon name={meta.icon} size={16} color={meta.color} />
      <Text className="font-sans-semibold text-sm text-foreground">{label}</Text>
      <TouchableOpacity
        testID="active-filter-clear"
        accessibilityRole="button"
        accessibilityLabel="Remover filtro de disciplina"
        hitSlop={8}
        onPress={onClear}
        className="ml-0.5"
      >
        <Icon name="close" size={16} color={meta.color} />
      </TouchableOpacity>
    </View>
  );
}
