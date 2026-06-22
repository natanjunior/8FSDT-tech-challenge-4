import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DisciplineBadge } from '@/components/ui/DisciplineBadge';
import { getDisciplineMeta } from '@/lib/disciplines';
import type { Discipline } from '@/types/api';

interface DisciplinesMultiSelectProps {
  disciplines: Discipline[];
  selectedIds: string[];
  onChange: (next: string[]) => void;
}

export function DisciplinesMultiSelect({
  disciplines,
  selectedIds,
  onChange,
}: DisciplinesMultiSelectProps) {
  if (disciplines.length === 0) {
    return (
      <Text className="font-sans text-sm text-muted">
        Nenhuma disciplina disponível.
      </Text>
    );
  }

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {disciplines.map((d) => {
        const selected = selectedIds.includes(d.id);
        if (selected) {
          return (
            <TouchableOpacity key={d.id} activeOpacity={0.7} onPress={() => toggle(d.id)}>
              <DisciplineBadge label={d.label} />
            </TouchableOpacity>
          );
        }
        const meta = getDisciplineMeta(d.label);
        return (
          <TouchableOpacity
            key={d.id}
            activeOpacity={0.7}
            onPress={() => toggle(d.id)}
            className="rounded-full border px-3 py-1"
            style={{ borderColor: meta.color }}
          >
            <Text
              className="font-sans-black text-[10px] uppercase tracking-widest"
              style={{ color: meta.color }}
            >
              {d.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
