import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { StudentForm } from '@/features/students/components/StudentForm';

describe('StudentForm', () => {
  it('renderiza em modo create com bloco credenciais opcional', async () => {
    const { findByText, getByText } = render(
      <StudentForm mode="create" onSubmit={jest.fn()} submitLabel="Criar" />
    );
    expect(await findByText('Nome')).toBeTruthy();
    expect(getByText('Credenciais (opcional)')).toBeTruthy();
  });

  it('esconde credenciais em modo edit', async () => {
    const { queryByText, findByDisplayValue } = render(
      <StudentForm
        mode="edit"
        onSubmit={jest.fn()}
        submitLabel="Salvar"
        defaultValues={{ name: 'Pedro' }}
      />
    );
    expect(await findByDisplayValue('Pedro')).toBeTruthy();
    expect(queryByText('Credenciais (opcional)')).toBeNull();
  });

  it('mostra "Crie sua conta" em modo signup com credenciais obrigatórias', async () => {
    const { findByText } = render(
      <StudentForm mode="signup" onSubmit={jest.fn()} submitLabel="Cadastrar" />
    );
    expect(await findByText('Crie sua conta')).toBeTruthy();
  });

  it('valida user obrigatório em modo signup', async () => {
    const onSubmit = jest.fn();
    const { getByText, getByPlaceholderText, findByText } = render(
      <StudentForm mode="signup" onSubmit={onSubmit} submitLabel="Cadastrar" />
    );
    // só preenche nome, deixa user vazio
    fireEvent.changeText(getByPlaceholderText('Ex: Pedro Costa'), 'Pedro Costa');
    await act(async () => {
      fireEvent.press(getByText('Cadastrar'));
    });
    expect(await findByText('Login é obrigatório.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
