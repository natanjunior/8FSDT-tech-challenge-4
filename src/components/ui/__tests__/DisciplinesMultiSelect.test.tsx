import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { DisciplinesMultiSelect } from '@/components/ui/DisciplinesMultiSelect';

const DISCIPLINES = [
  { id: 'd1', label: 'Matemática' },
  { id: 'd2', label: 'Português' },
  { id: 'd3', label: 'Ciências' },
];

describe('DisciplinesMultiSelect', () => {
  it('renderiza todas as disciplinas', () => {
    const { getByText } = render(
      <DisciplinesMultiSelect
        disciplines={DISCIPLINES}
        selectedIds={[]}
        onChange={() => {}}
      />
    );
    expect(getByText('Matemática')).toBeTruthy();
    expect(getByText('Português')).toBeTruthy();
    expect(getByText('Ciências')).toBeTruthy();
  });

  it('adiciona ao array selectedIds ao tocar não-selecionado', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <DisciplinesMultiSelect
        disciplines={DISCIPLINES}
        selectedIds={['d1']}
        onChange={onChange}
      />
    );
    fireEvent.press(getByText('Português'));
    expect(onChange).toHaveBeenCalledWith(['d1', 'd2']);
  });

  it('remove do array selectedIds ao tocar selecionado', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <DisciplinesMultiSelect
        disciplines={DISCIPLINES}
        selectedIds={['d1', 'd2']}
        onChange={onChange}
      />
    );
    fireEvent.press(getByText('Matemática'));
    expect(onChange).toHaveBeenCalledWith(['d2']);
  });

  it('mostra estado "vazio" quando disciplines=[]', () => {
    const { getByText } = render(
      <DisciplinesMultiSelect
        disciplines={[]}
        selectedIds={[]}
        onChange={() => {}}
      />
    );
    expect(getByText(/Nenhuma disciplina/i)).toBeTruthy();
  });
});
