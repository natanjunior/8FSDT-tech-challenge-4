import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { PostStatus } from '@/types/api';

interface StatusPickerProps {
  value: PostStatus;
  onChange: (next: PostStatus) => void;
}

const OPTIONS: Array<{ value: PostStatus; label: string; dotClass: string }> = [
  { value: 'DRAFT', label: 'RASCUNHO', dotClass: 'bg-status-draft' },
  { value: 'PUBLISHED', label: 'PUBLICADO', dotClass: 'bg-status-published' },
  { value: 'ARCHIVED', label: 'ARQUIVADO', dotClass: 'bg-status-archived' },
];

export function StatusPicker({ value, onChange }: StatusPickerProps) {
  return (
    <View className="flex-row gap-2">
      {OPTIONS.map((opt) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            accessibilityRole="button"
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full px-3 py-2 ${
              selected ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <View
              testID={`status-${opt.value}-dot`}
              className={`h-1.5 w-1.5 rounded-full ${opt.dotClass}`}
            />
            <Text
              className={`font-sans-bold text-[10px] uppercase tracking-wider ${
                selected ? 'text-primary-foreground' : 'text-foreground'
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
