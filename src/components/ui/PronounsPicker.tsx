import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import type { Pronouns } from '@/types/api';

interface PronounsPickerProps {
  value: Pronouns | null;
  onChange: (next: Pronouns | null) => void;
}

const OPTIONS: Pronouns[] = ['ele/dele', 'ela/dela', 'elu/delu', 'outro'];

export function PronounsPicker({ value, onChange }: PronounsPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {OPTIONS.map((opt) => {
        const selected = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            accessibilityRole="button"
            onPress={() => onChange(selected ? null : opt)}
            activeOpacity={0.7}
            className={`rounded-full px-3 py-2 ${
              selected ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <Text
              className={`font-sans-medium text-sm ${
                selected ? 'text-primary-foreground' : 'text-foreground'
              }`}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
