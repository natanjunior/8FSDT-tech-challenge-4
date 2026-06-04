import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders the title', () => {
    const { getByText } = render(<Button title="Entrar" onPress={() => {}} />);
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('invokes onPress when not loading or disabled', () => {
    const fn = jest.fn();
    const { getByText } = render(<Button title="OK" onPress={fn} />);
    fireEvent.press(getByText('OK'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onPress when loading', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <Button testID="btn" title="OK" onPress={fn} loading />
    );
    fireEvent.press(getByTestId('btn'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('does not invoke onPress when disabled', () => {
    const fn = jest.fn();
    const { getByText } = render(
      <Button title="OK" onPress={fn} disabled />
    );
    fireEvent.press(getByText('OK'));
    expect(fn).not.toHaveBeenCalled();
  });
});
