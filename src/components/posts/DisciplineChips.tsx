import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import type { Discipline } from '@/types/api';

interface DisciplineChipsProps {
  disciplines: Discipline[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Exibe o chip "Todas" (limpa a seleção). Faz sentido como filtro de lista;
   *  num formulário — onde disciplina é opcional — oculte-o: "Todas" não é uma
   *  opção de disciplina. Sem ele, tocar de novo o chip já selecionado limpa o
   *  campo. Default `true` para não mudar o comportamento dos filtros. */
  showAllOption?: boolean;
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
  showAllOption = true,
}: DisciplineChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {showAllOption ? (
        <Chip
          label="Todas"
          selected={selectedId === null}
          onPress={() => onSelect(null)}
        />
      ) : null}
      {disciplines.map((d) => {
        const selected = selectedId === d.id;
        return (
          <Chip
            key={d.id}
            label={d.label}
            selected={selected}
            // Sem o chip "Todas", tocar o chip já selecionado limpa o campo opcional.
            onPress={() => onSelect(!showAllOption && selected ? null : d.id)}
          />
        );
      })}
    </ScrollView>
  );
}
