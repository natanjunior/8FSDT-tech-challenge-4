import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { TeacherForm } from '@/features/teachers/components/TeacherForm';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/disciplines.service');

const mockList = disciplinesService.listDisciplines as jest.Mock;

describe('TeacherForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockList.mockResolvedValue([{ id: 'd1', label: 'Matemática' }]);
  });

  it('renderiza form vazio em modo create', async () => {
    const { findByText, getByText } = render(
      <TeacherForm mode="create" onSubmit={jest.fn()} submitLabel="Criar" />
    );
    expect(await findByText('Nome')).toBeTruthy();
    expect(getByText('Criar')).toBeTruthy();
    expect(getByText('Credenciais (opcional)')).toBeTruthy();
  });

  it('esconde bloco de credenciais em modo edit', async () => {
    const { queryByText, findByDisplayValue } = render(
      <TeacherForm
        mode="edit"
        onSubmit={jest.fn()}
        submitLabel="Salvar"
        defaultValues={{
          name: 'João Existente',
          discipline_ids: [],
        }}
      />
    );
    expect(await findByDisplayValue('João Existente')).toBeTruthy();
    expect(queryByText('Credenciais (opcional)')).toBeNull();
  });

  it('mostra erro de validação quando submete vazio', async () => {
    const onSubmit = jest.fn();
    const { findByText, getByText } = render(
      <TeacherForm mode="create" onSubmit={onSubmit} submitLabel="Criar" />
    );
    await act(async () => {
      fireEvent.press(getByText('Criar'));
    });
    expect(await findByText('Nome é obrigatório.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('chama onSubmit com payload válido', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByText, getByPlaceholderText } = render(
      <TeacherForm mode="create" onSubmit={onSubmit} submitLabel="Criar" />
    );
    fireEvent.changeText(getByPlaceholderText('Ex: João Silva'), 'João Silva');
    await act(async () => {
      fireEvent.press(getByText('Criar'));
    });
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'João Silva' })
      )
    );
  });
});
