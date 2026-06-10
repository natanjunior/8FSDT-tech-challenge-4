import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';

describe('StatusBadge', () => {
  it('renders PUBLISHED label', () => {
    const { getByText } = render(<StatusBadge status="PUBLISHED" />);
    expect(getByText('PUBLICADO')).toBeTruthy();
  });
  it('renders DRAFT label', () => {
    const { getByText } = render(<StatusBadge status="DRAFT" />);
    expect(getByText('RASCUNHO')).toBeTruthy();
  });
  it('renders ARCHIVED label', () => {
    const { getByText } = render(<StatusBadge status="ARCHIVED" />);
    expect(getByText('ARQUIVADO')).toBeTruthy();
  });
  it('renders the colored dot indicator', () => {
    const { getByTestId } = render(<StatusBadge status="PUBLISHED" testID="sb" />);
    expect(getByTestId('sb-dot')).toBeTruthy();
  });
});
