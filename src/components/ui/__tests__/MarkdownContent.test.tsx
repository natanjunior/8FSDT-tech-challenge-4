import React from 'react';
import { render } from '@testing-library/react-native';
import { MarkdownContent } from '@/components/ui/MarkdownContent';

describe('MarkdownContent', () => {
  it('renderiza o texto Markdown recebido', () => {
    const { getByText } = render(<MarkdownContent value="# Olá mundo" />);
    expect(getByText('# Olá mundo')).toBeTruthy();
  });

  it('não quebra com value vazio', () => {
    const { getByTestId } = render(
      <MarkdownContent value="" testID="md-content" />
    );
    expect(getByTestId('md-content')).toBeTruthy();
  });
});
