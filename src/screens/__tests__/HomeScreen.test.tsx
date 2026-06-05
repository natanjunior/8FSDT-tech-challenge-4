import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '@/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders the public hero copy', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Blog FIAP')).toBeTruthy();
    expect(
      getByText('Conteúdo educacional compartilhado por professores da rede.')
    ).toBeTruthy();
  });

  it('renders the Fase 2 placeholder card', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Em construção')).toBeTruthy();
  });
});
