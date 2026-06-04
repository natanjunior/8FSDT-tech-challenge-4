import React from 'react';
import { render } from '@testing-library/react-native';
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
});
