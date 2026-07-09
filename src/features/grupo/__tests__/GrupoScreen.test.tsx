import React from 'react';
import { render } from '@testing-library/react-native';
import { GrupoScreen } from '@/features/grupo/GrupoScreen';

describe('GrupoScreen', () => {
  it('renders all five members', () => {
    const { getByText } = render(<GrupoScreen />);
    expect(getByText('Dario Lacerda')).toBeTruthy();
    expect(getByText('Larissa Kramer')).toBeTruthy();
    expect(getByText('Mirian Storino')).toBeTruthy();
    expect(getByText('Natanael Dias')).toBeTruthy();
    expect(getByText('Tiago Victor')).toBeTruthy();
  });

  it('não duplica um título "Grupo N" no conteúdo (o header já mostra)', () => {
    const { queryByText } = render(<GrupoScreen />);
    expect(queryByText(/^Grupo \d+$/)).toBeNull();
  });

  it('renders RMs for each member', () => {
    const { getByText } = render(<GrupoScreen />);
    expect(getByText('rm369195')).toBeTruthy();
    expect(getByText('rm370062')).toBeTruthy();
    expect(getByText('rm369489')).toBeTruthy();
    expect(getByText('rm369334')).toBeTruthy();
    expect(getByText('rm370117')).toBeTruthy();
  });
});
