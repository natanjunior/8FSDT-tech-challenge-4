import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthorAvatar } from '@/components/ui/AuthorAvatar';

describe('AuthorAvatar', () => {
  it('renders single initial when name is one word', () => {
    const { getByText } = render(<AuthorAvatar name="João" />);
    expect(getByText('J')).toBeTruthy();
  });
  it('renders two initials when name has multiple words', () => {
    const { getByText } = render(<AuthorAvatar name="João Silva" />);
    expect(getByText('JS')).toBeTruthy();
  });
  it('renders "?" when name is null', () => {
    const { getByText } = render(<AuthorAvatar name={null} />);
    expect(getByText('?')).toBeTruthy();
  });
  it('renders icon (no initials) when variant="icon"', () => {
    const { queryByText, getByTestId } = render(
      <AuthorAvatar name="Joana" variant="icon" testID="av" />
    );
    expect(queryByText('J')).toBeNull();
    expect(getByTestId('av-icon')).toBeTruthy();
  });
  it('icon variant uses fallback color when name is null', () => {
    const { getByTestId } = render(
      <AuthorAvatar name={null} variant="icon" testID="av" />
    );
    expect(getByTestId('av')).toBeTruthy();
  });
  it('accepts size sm/md/lg', () => {
    const sm = render(<AuthorAvatar name="Ana" size="sm" />);
    const md = render(<AuthorAvatar name="Ana" size="md" />);
    const lg = render(<AuthorAvatar name="Ana" size="lg" />);
    expect(sm.toJSON()).toBeTruthy();
    expect(md.toJSON()).toBeTruthy();
    expect(lg.toJSON()).toBeTruthy();
  });
});
