import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthorId } from '@/components/ui/AuthorId';

describe('AuthorId', () => {
  it('renders name', () => {
    const { getByText } = render(<AuthorId name="Maria Santos" />);
    expect(getByText('Maria Santos')).toBeTruthy();
  });
  it('renders subtitle when provided', () => {
    const { getByText } = render(
      <AuthorId name="Maria" subtitle="Matemática" />
    );
    expect(getByText('Matemática')).toBeTruthy();
  });
  it('renders date only when size=lg', () => {
    const md = render(<AuthorId name="Maria" date="15/01/2024" size="md" />);
    expect(md.queryByText('15/01/2024')).toBeNull();
    const lg = render(<AuthorId name="Maria" date="15/01/2024" size="lg" />);
    expect(lg.getByText('15/01/2024')).toBeTruthy();
  });
  it('renders avatar (default initials variant)', () => {
    const { getByTestId } = render(<AuthorId testID="aid" name="Ana" />);
    expect(getByTestId('aid-avatar')).toBeTruthy();
  });
});
