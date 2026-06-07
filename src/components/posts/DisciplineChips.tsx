import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import type { Discipline } from '@/types/api';

interface DisciplineChipsProps {
  disciplines: Discipline[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      className={`mr-2 rounded-full px-4 py-2 ${selected ? 'bg-primary' : 'bg-surface-container'}`}
    >
      <Text
        className={`text-sm font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function DisciplineChips({
  disciplines,
  selectedId,
  onSelect,
}: DisciplineChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <Chip
        label="Todas"
        selected={selectedId === null}
        onPress={() => onSelect(null)}
      />
      {disciplines.map((d) => (
        <Chip
          key={d.id}
          label={d.label}
          selected={selectedId === d.id}
          onPress={() => onSelect(d.id)}
        />
      ))}
    </ScrollView>
  );
}
