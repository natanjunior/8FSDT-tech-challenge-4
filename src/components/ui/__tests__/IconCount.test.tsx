import React from 'react';
import { render } from '@testing-library/react-native';
import { IconCount } from '@/components/ui/IconCount';

describe('IconCount', () => {
  it('renders the count number', () => {
    const { getByText } = render(<IconCount type="comment" count={3} />);
    expect(getByText('3')).toBeTruthy();
  });
  it('renders zero', () => {
    const { getByText } = render(<IconCount type="bookmark" count={0} />);
    expect(getByText('0')).toBeTruthy();
  });
  it('accepts type "comment"', () => {
    const { getByTestId } = render(
      <IconCount testID="c" type="comment" count={5} />
    );
    expect(getByTestId('c-icon')).toBeTruthy();
  });
  it('accepts type "bookmark"', () => {
    const { getByTestId } = render(
      <IconCount testID="c" type="bookmark" count={5} />
    );
    expect(getByTestId('c-icon')).toBeTruthy();
  });
  it('accepts type "views"', () => {
    const { getByTestId } = render(
      <IconCount testID="c" type="views" count={5} />
    );
    expect(getByTestId('c-icon')).toBeTruthy();
  });
});
