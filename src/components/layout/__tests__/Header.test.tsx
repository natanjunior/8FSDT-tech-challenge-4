import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderRight } from '@/components/layout/Header';
import * as AuthContextModule from '@/contexts/AuthContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockNavigate = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

const guest = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};
const student = { ...guest, user: { id: 's1', login: 'pedro.costa', role: 'STUDENT' as const }, isAuthenticated: true };
const teacher = { ...guest, user: { id: 't1', login: 'joao.silva', role: 'TEACHER' as const }, isAuthenticated: true };

describe('HeaderRight', () => {
  afterEach(() => jest.clearAllMocks());

  it('visitante: mostra "Entrar" e nada de "Grupo"/"Sair"/"Painel"', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText, queryByText } = render(<HeaderRight />);
    expect(getByText('Entrar')).toBeTruthy();
    expect(queryByText('Grupo')).toBeNull();
    expect(queryByText('Sair')).toBeNull();
    expect(queryByText('Painel')).toBeNull();
  });

  it('navega para Login ao tocar "Entrar"', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText } = render(<HeaderRight />);
    fireEvent.press(getByText('Entrar'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('não renderiza mais o botão "Grupo" em nenhum estado', () => {
    useAuthSpy.mockReturnValue(guest);
    const { queryByText, rerender } = render(<HeaderRight />);
    expect(queryByText('Grupo')).toBeNull();
    useAuthSpy.mockReturnValue(student);
    rerender(<HeaderRight />);
    expect(queryByText('Grupo')).toBeNull();
    useAuthSpy.mockReturnValue(teacher);
    rerender(<HeaderRight />);
    expect(queryByText('Grupo')).toBeNull();
  });

  it('dropdown (TEACHER) = só conta: Meu perfil, Trocar senha, Sair; sem admin', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByText, queryByText } = render(<HeaderRight />);
    fireEvent.press(getByTestId('header-user-trigger'));
    expect(getByText('Meu perfil')).toBeTruthy();
    expect(getByText('Trocar senha')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
    expect(queryByText('Painel')).toBeNull();
    expect(queryByText('Professores')).toBeNull();
    expect(queryByText('Alunos')).toBeNull();
  });

  it('dropdown (STUDENT) = Meu perfil, Trocar senha, Sair; sem admin', () => {
    useAuthSpy.mockReturnValue(student);
    const { getByTestId, getByText, queryByText } = render(<HeaderRight />);
    fireEvent.press(getByTestId('header-user-trigger'));
    expect(getByText('Meu perfil')).toBeTruthy();
    expect(getByText('Trocar senha')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
    expect(queryByText('Painel')).toBeNull();
  });

  it('navega para Profile ao tocar "Meu perfil"', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByText } = render(<HeaderRight />);
    fireEvent.press(getByTestId('header-user-trigger'));
    fireEvent.press(getByText('Meu perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });

  it('navega para ChangePassword ao tocar "Trocar senha"', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByText } = render(<HeaderRight />);
    fireEvent.press(getByTestId('header-user-trigger'));
    fireEvent.press(getByText('Trocar senha'));
    expect(mockNavigate).toHaveBeenCalledWith('ChangePassword');
  });

  it('chama logout ao tocar "Sair"', () => {
    const logoutMock = jest.fn();
    useAuthSpy.mockReturnValue({ ...teacher, logout: logoutMock });
    const { getByTestId, getByText } = render(<HeaderRight />);
    fireEvent.press(getByTestId('header-user-trigger'));
    fireEvent.press(getByText('Sair'));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
