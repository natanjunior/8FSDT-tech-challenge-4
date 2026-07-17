import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { DisciplineChips } from '@/components/posts/DisciplineChips';
import type { Discipline } from '@/types/api';

const disciplines: Discipline[] = [
  { id: 'd1', label: 'Matemática' },
  { id: 'd2', label: 'Português' },
];

describe('DisciplineChips', () => {
  it('renders "Todas" plus one chip per discipline', () => {
    const { getByText } = render(
      <DisciplineChips
        disciplines={disciplines}
        selectedId={null}
        onSelect={() => {}}
      />
    );
    expect(getByText('Todas')).toBeTruthy();
    expect(getByText('Matemática')).toBeTruthy();
    expect(getByText('Português')).toBeTruthy();
  });

  it('calls onSelect with discipline id', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <DisciplineChips
        disciplines={disciplines}
        selectedId={null}
        onSelect={onSelect}
      />
    );
    fireEvent.press(getByText('Matemática'));
    expect(onSelect).toHaveBeenCalledWith('d1');
  });

  it('calls onSelect with null when "Todas" is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <DisciplineChips
        disciplines={disciplines}
        selectedId="d1"
        onSelect={onSelect}
      />
    );
    fireEvent.press(getByText('Todas'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('não renderiza o chip "Todas" quando showAllOption é false (uso em formulário)', () => {
    const { queryByText, getByText } = render(
      <DisciplineChips
        disciplines={disciplines}
        selectedId={null}
        onSelect={() => {}}
        showAllOption={false}
      />
    );
    expect(queryByText('Todas')).toBeNull();
    // as disciplinas continuam disponíveis
    expect(getByText('Matemática')).toBeTruthy();
    expect(getByText('Português')).toBeTruthy();
  });

  it('sem "Todas", tocar o chip já selecionado limpa o campo (onSelect null)', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <DisciplineChips
        disciplines={disciplines}
        selectedId="d1"
        onSelect={onSelect}
        showAllOption={false}
      />
    );
    fireEvent.press(getByText('Matemática')); // já selecionada → limpa
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
