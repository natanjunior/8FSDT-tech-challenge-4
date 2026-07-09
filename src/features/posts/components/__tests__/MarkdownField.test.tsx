import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { MarkdownField } from '@/features/posts/components/MarkdownField';

describe('MarkdownField', () => {
  it('mostra a aba Escrever (TextInput) por padrão', () => {
    const { getByPlaceholderText } = render(
      <MarkdownField value="" onChangeText={() => {}} />
    );
    expect(getByPlaceholderText('Escreva o conteúdo do post...')).toBeTruthy();
  });

  it('chama onChangeText ao digitar', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <MarkdownField value="" onChangeText={onChangeText} />
    );
    fireEvent.changeText(
      getByPlaceholderText('Escreva o conteúdo do post...'),
      '# Oi'
    );
    expect(onChangeText).toHaveBeenCalledWith('# Oi');
  });

  it('alterna para Prévia e renderiza o conteúdo (Input desmontado)', () => {
    const { getByTestId, queryByPlaceholderText, getByText } = render(
      <MarkdownField value="# Título" onChangeText={() => {}} />
    );
    fireEvent.press(getByTestId('md-tab-preview'));
    expect(queryByPlaceholderText('Escreva o conteúdo do post...')).toBeNull();
    expect(getByText('# Título')).toBeTruthy(); // via mock do renderer
  });

  it('mostra empty state na Prévia quando vazio', () => {
    const { getByTestId, getByText } = render(
      <MarkdownField value="" onChangeText={() => {}} />
    );
    fireEvent.press(getByTestId('md-tab-preview'));
    expect(getByText('Nada para pré-visualizar')).toBeTruthy();
  });

  it('preserva o texto ao voltar para Escrever', () => {
    const { getByTestId, getByDisplayValue } = render(
      <MarkdownField value="conteúdo digitado" onChangeText={() => {}} />
    );
    fireEvent.press(getByTestId('md-tab-preview'));
    fireEvent.press(getByTestId('md-tab-write'));
    expect(getByDisplayValue('conteúdo digitado')).toBeTruthy();
  });

  it('mantém a mensagem de erro visível em ambas as abas (F2)', () => {
    const msg = 'Conteúdo deve ter no mínimo 10 caracteres.';
    const { getByTestId, getByText } = render(
      <MarkdownField value="" onChangeText={() => {}} error={msg} />
    );
    expect(getByText(msg)).toBeTruthy();
    fireEvent.press(getByTestId('md-tab-preview'));
    expect(getByText(msg)).toBeTruthy();
  });

  it('mantém o contador visível mesmo com erro (F1)', () => {
    const { getByText } = render(
      <MarkdownField value="curto" onChangeText={() => {}} error="Erro qualquer" />
    );
    expect(getByText('5 caracteres · mín. 10')).toBeTruthy();
  });
});
