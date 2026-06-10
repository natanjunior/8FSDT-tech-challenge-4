import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders label and value', () => {
    const { getByText, getByDisplayValue } = render(
      <Input label="E-mail" value="prof@escola.edu" onChangeText={() => {}} />
    );
    expect(getByText('E-mail')).toBeTruthy();
    expect(getByDisplayValue('prof@escola.edu')).toBeTruthy();
  });

  it('renders error message when provided', () => {
    const { getByText } = render(
      <Input label="E-mail" error="Inválido" onChangeText={() => {}} />
    );
    expect(getByText('Inválido')).toBeTruthy();
  });

  it('does not render error block when error is undefined', () => {
    const { queryByTestId } = render(
      <Input label="E-mail" onChangeText={() => {}} />
    );
    expect(queryByTestId('input-error')).toBeNull();
  });

  it('renders hint when no error', () => {
    const { getByText } = render(
      <Input label="Senha" hint="Mínimo 8 caracteres" onChangeText={() => {}} />
    );
    expect(getByText('Mínimo 8 caracteres')).toBeTruthy();
  });

  it('hides hint when error is present', () => {
    const { queryByText, getByText } = render(
      <Input
        label="Senha"
        hint="Mínimo 8 caracteres"
        error="Senha muito curta"
        onChangeText={() => {}}
      />
    );
    expect(getByText('Senha muito curta')).toBeTruthy();
    expect(queryByText('Mínimo 8 caracteres')).toBeNull();
  });

  it('renders leading icon when provided', () => {
    const { getByTestId } = render(
      <Input
        testID="in"
        label="Buscar"
        leadingIcon="magnify"
        onChangeText={() => {}}
      />
    );
    expect(getByTestId('in-leading-icon')).toBeTruthy();
  });

  it('calls onTrailingIconPress when trailing icon pressed', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <Input
        testID="in"
        trailingIcon="close"
        onTrailingIconPress={fn}
        onChangeText={() => {}}
      />
    );
    fireEvent.press(getByTestId('in-trailing-icon'));
    expect(fn).toHaveBeenCalled();
  });
});
