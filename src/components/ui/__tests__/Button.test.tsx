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

  it('renders leading icon when provided', () => {
    const { getByTestId } = render(
      <Button
        testID="btn"
        title="Salvar"
        onPress={() => {}}
        leadingIcon="check"
      />
    );
    expect(getByTestId('btn-leading-icon')).toBeTruthy();
  });

  it('renders trailing icon when provided', () => {
    const { getByTestId } = render(
      <Button
        testID="btn"
        title="Continuar"
        onPress={() => {}}
        trailingIcon="arrow-right"
      />
    );
    expect(getByTestId('btn-trailing-icon')).toBeTruthy();
  });

  it('renders gradient overlay for variant="primary"', () => {
    const { getByTestId } = render(
      <Button testID="btn" title="Criar post" variant="primary" onPress={() => {}} />
    );
    expect(getByTestId('btn-gradient')).toBeTruthy();
  });

  it('renders gradient overlay for variant="nav"', () => {
    const { getByTestId } = render(
      <Button testID="btn" title="Entrar" variant="nav" onPress={() => {}} />
    );
    expect(getByTestId('btn-gradient')).toBeTruthy();
  });

  it('does NOT render gradient for variant="secondary"', () => {
    const { getByTestId, queryByTestId } = render(
      <Button testID="btn" title="Cancelar" variant="secondary" onPress={() => {}} />
    );
    expect(getByTestId('btn')).toBeTruthy();
    expect(queryByTestId('btn-gradient')).toBeNull();
  });

  it('does NOT render gradient for variant="danger-outline"', () => {
    const { queryByTestId } = render(
      <Button testID="btn" title="Excluir" variant="danger-outline" onPress={() => {}} />
    );
    expect(queryByTestId('btn-gradient')).toBeNull();
  });

  it('accepts a size without crashing', () => {
    const { getByText } = render(
      <Button title="Pequeno" onPress={() => {}} size="sm" />
    );
    expect(getByText('Pequeno')).toBeTruthy();
  });
});
