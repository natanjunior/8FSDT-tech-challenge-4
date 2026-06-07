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
});
