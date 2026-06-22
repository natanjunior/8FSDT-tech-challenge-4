import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { PronounsPicker } from '@/components/ui/PronounsPicker';

describe('PronounsPicker', () => {
  it('renderiza os 4 pronouns', () => {
    const { getByText } = render(
      <PronounsPicker value={null} onChange={() => {}} />
    );
    expect(getByText('ele/dele')).toBeTruthy();
    expect(getByText('ela/dela')).toBeTruthy();
    expect(getByText('elu/delu')).toBeTruthy();
    expect(getByText('outro')).toBeTruthy();
  });

  it('chama onChange com o valor escolhido', () => {
    const onChange = jest.fn();
    const { getByText } = render(<PronounsPicker value={null} onChange={onChange} />);
    fireEvent.press(getByText('ela/dela'));
    expect(onChange).toHaveBeenCalledWith('ela/dela');
  });

  it('chama onChange com null ao tocar o chip já selecionado (toggle off)', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <PronounsPicker value="ele/dele" onChange={onChange} />
    );
    fireEvent.press(getByText('ele/dele'));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
