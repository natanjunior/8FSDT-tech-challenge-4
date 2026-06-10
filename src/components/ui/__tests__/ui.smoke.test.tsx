import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from 'react-native';

describe('UI components — smoke', () => {
  it('Card renders children with default editorial elevation', () => {
    const { getByText } = render(
      <Card>
        <Text>Inner</Text>
      </Card>
    );
    expect(getByText('Inner')).toBeTruthy();
  });

  it('Card accepts elevation="soft" without crashing', () => {
    const { getByText } = render(
      <Card elevation="soft">
        <Text>Soft</Text>
      </Card>
    );
    expect(getByText('Soft')).toBeTruthy();
  });

  it('Card with elevation="none" renders flat', () => {
    const { getByText } = render(
      <Card elevation="none">
        <Text>Flat</Text>
      </Card>
    );
    expect(getByText('Flat')).toBeTruthy();
  });

  it('Badge renders label', () => {
    const { getByText } = render(<Badge label="PUBLISHED" variant="success" />);
    expect(getByText('PUBLISHED')).toBeTruthy();
  });

  it('Loader renders optional message', () => {
    const { getByText } = render(<Loader message="Carregando..." />);
    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('EmptyState renders title and optional action', () => {
    const { getByText } = render(
      <EmptyState
        title="Sem resultados"
        subtitle="Tente outra busca"
        action={{ label: 'Limpar', onPress: () => {} }}
      />
    );
    expect(getByText('Sem resultados')).toBeTruthy();
    expect(getByText('Limpar')).toBeTruthy();
  });

  it('Skeleton renders a View', () => {
    const { toJSON } = render(<Skeleton className="h-4 w-32" />);
    expect(toJSON()).toBeTruthy();
  });
});
