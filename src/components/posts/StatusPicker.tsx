import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { PostStatus } from '@/types/api';

interface StatusPickerProps {
  value: PostStatus;
  onChange: (next: PostStatus) => void;
}

const OPTIONS: Array<{ value: PostStatus; label: string }> = [
  { value: 'DRAFT', label: 'Rascunho' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'ARCHIVED', label: 'Arquivado' },
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
            className={`flex-1 items-center rounded-full px-3 py-2 ${selected ? 'bg-primary' : 'bg-surface-container'}`}
          >
            <Text
              className={`text-sm font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
