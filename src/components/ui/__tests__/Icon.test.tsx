import React from 'react';
import { render } from '@testing-library/react-native';
import { Icon } from '@/components/ui/Icon';

describe('Icon', () => {
  it('renders with default size and color', () => {
    const { getByTestId } = render(<Icon name="magnify" testID="ic" />);
    expect(getByTestId('ic')).toBeTruthy();
  });

  it('accepts a custom size', () => {
    const { getByTestId } = render(
      <Icon name="account-group" size={32} testID="ic" />
    );
    expect(getByTestId('ic')).toBeTruthy();
  });

  it('accepts a custom color', () => {
    const { getByTestId } = render(
      <Icon name="logout" color="#FF0000" testID="ic" />
    );
    expect(getByTestId('ic')).toBeTruthy();
  });
});
