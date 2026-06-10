import React from 'react';
import { render } from '@testing-library/react-native';
import { DisciplineBadge } from '@/components/ui/DisciplineBadge';

describe('DisciplineBadge', () => {
  it('renders label for known discipline', () => {
    const { getByText } = render(<DisciplineBadge label="Matemática" />);
    expect(getByText('Matemática')).toBeTruthy();
  });
  it('renders "Sem disciplina" fallback for null', () => {
    const { getByText } = render(<DisciplineBadge label={null} />);
    expect(getByText('Sem disciplina')).toBeTruthy();
  });
  it('renders "Sem disciplina" fallback for unknown', () => {
    const { getByText } = render(<DisciplineBadge label="Astronomia" />);
    expect(getByText('Sem disciplina')).toBeTruthy();
  });
});
