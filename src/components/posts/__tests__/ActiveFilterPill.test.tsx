import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ActiveFilterPill } from '@/components/posts/ActiveFilterPill';

describe('ActiveFilterPill', () => {
  it('mostra o label da disciplina', () => {
    const { getByText } = render(
      <ActiveFilterPill label="Ciências" onClear={jest.fn()} />
    );
    expect(getByText('Ciências')).toBeTruthy();
  });

  it('chama onClear ao tocar no botão de remover', () => {
    const onClear = jest.fn();
    const { getByTestId } = render(
      <ActiveFilterPill label="Ciências" onClear={onClear} />
    );
    fireEvent.press(getByTestId('active-filter-clear'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
