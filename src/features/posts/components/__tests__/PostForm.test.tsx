import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { PostForm } from '@/features/posts/components/PostForm';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/disciplines.service');

const mockList = disciplinesService.listDisciplines as jest.Mock;

describe('PostForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockList.mockResolvedValue([
      { id: 'd1', label: 'Matemática' },
      { id: 'd2', label: 'Português' },
    ]);
  });

  it('renders empty form by default', async () => {
    const { getByText, findByPlaceholderText } = render(
      <PostForm onSubmit={jest.fn()} submitLabel="Criar" />
    );
    expect(await findByPlaceholderText('Ex: Introdução à Álgebra Linear')).toBeTruthy();
    expect(getByText('Criar')).toBeTruthy();
  });

  it('pre-populates fields when defaultValues provided', async () => {
    const { findByDisplayValue } = render(
      <PostForm
        onSubmit={jest.fn()}
        submitLabel="Salvar"
        defaultValues={{
          title: 'Título pré-existente',
          content: 'Conteúdo pré-existente com mais de dez caracteres.',
          status: 'PUBLISHED',
          discipline_id: 'd1',
        }}
      />
    );
    expect(await findByDisplayValue('Título pré-existente')).toBeTruthy();
    expect(
      await findByDisplayValue('Conteúdo pré-existente com mais de dez caracteres.')
    ).toBeTruthy();
  });

  it('shows validation errors for empty submit', async () => {
    const onSubmit = jest.fn();
    const { getByText, findByText } = render(
      <PostForm onSubmit={onSubmit} submitLabel="Criar" />
    );

    await act(async () => {
      fireEvent.press(getByText('Criar'));
    });

    expect(await findByText('Título deve ter entre 5 e 255 caracteres.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid payload', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByText, getByPlaceholderText } = render(
      <PostForm onSubmit={onSubmit} submitLabel="Criar" />
    );

    fireEvent.changeText(
      getByPlaceholderText('Ex: Introdução à Álgebra Linear'),
      'Título válido'
    );
    fireEvent.changeText(
      getByPlaceholderText('Escreva o conteúdo do post...'),
      'Conteúdo com mais de dez caracteres.'
    );

    await act(async () => {
      fireEvent.press(getByText('Criar'));
    });

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Título válido',
          content: 'Conteúdo com mais de dez caracteres.',
          status: 'DRAFT',
        })
      )
    );
  });
});
