import React from 'react';
import { render } from '@testing-library/react-native';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('renders default size', () => {
    const { getByTestId } = render(<Spinner testID="sp" />);
    expect(getByTestId('sp')).toBeTruthy();
  });
  it('renders size=sm', () => {
    const { getByTestId } = render(<Spinner testID="sp" size="sm" />);
    expect(getByTestId('sp')).toBeTruthy();
  });
});
