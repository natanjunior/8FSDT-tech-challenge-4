import React from 'react';
import { render } from '@testing-library/react-native';
import { StatsCard } from '@/components/ui/StatsCard';

describe('StatsCard', () => {
  it('renders icon, value and label', () => {
    const { getByTestId, getByText } = render(
      <StatsCard
        testID="sc"
        icon="check-circle-outline"
        value={42}
        label="Publicados"
      />
    );
    expect(getByTestId('sc-icon')).toBeTruthy();
    expect(getByText('42')).toBeTruthy();
    expect(getByText('Publicados')).toBeTruthy();
  });

  it('renders zero value (does not skip)', () => {
    const { getByText } = render(
      <StatsCard icon="inbox-outline" value={0} label="Rascunhos" />
    );
    expect(getByText('0')).toBeTruthy();
  });

  it('accepts variant="primary" without crashing', () => {
    const { getByText } = render(
      <StatsCard icon="check-circle" value={10} label="Total" variant="primary" />
    );
    expect(getByText('10')).toBeTruthy();
  });
});
