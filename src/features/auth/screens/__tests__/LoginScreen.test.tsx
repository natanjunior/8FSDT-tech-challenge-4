import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import * as AuthContextModule from '@/contexts/AuthContext';

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
let mockRouteParams: { login?: string } | undefined = undefined;

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

import { useNavigation, useRoute } from '@react-navigation/native';

(useNavigation as jest.Mock).mockReturnValue({
  replace: mockReplace,
  navigate: mockNavigate,
});
(useRoute as jest.Mock).mockImplementation(() => ({
  params: mockRouteParams,
}));

describe('LoginScreen', () => {
  const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

  const guestAuth = {
    user: null,
    profile: null,
    isAuthenticated: false,
    isHydrating: false,
    isAuthenticating: false,
    login: jest.fn(),
    logout: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
    mockReplace.mockClear();
    mockNavigate.mockClear();
    mockRouteParams = undefined;
    (useNavigation as jest.Mock).mockReturnValue({
      replace: mockReplace,
      navigate: mockNavigate,
    });
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: mockRouteParams,
    }));
  });

  it('renders login + password fields and submit button', () => {
    useAuthSpy.mockReturnValue(guestAuth);
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByPlaceholderText('ex: joao.silva')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('shows validation error for short password', async () => {
    useAuthSpy.mockReturnValue(guestAuth);

    const { getByText, getByPlaceholderText, findByText } = render(
      <LoginScreen />
    );

    fireEvent.changeText(getByPlaceholderText('ex: joao.silva'), 'joao.silva');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'curta');
    fireEvent.press(getByText('Entrar'));

    expect(
      await findByText('Senha deve ter no mínimo 8 caracteres.')
    ).toBeTruthy();
  });

  it('calls login() with trimmed login and untrimmed password', async () => {
    const loginMock = jest.fn().mockResolvedValue(undefined);
    useAuthSpy.mockReturnValue({ ...guestAuth, login: loginMock });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('ex: joao.silva'),
      '  joao.silva  '
    );
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'senha123');

    await act(async () => {
      fireEvent.press(getByText('Entrar'));
    });

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith({
        login: 'joao.silva',
        password: 'senha123',
      })
    );
    expect(mockReplace).toHaveBeenCalledWith('Home');
  });

  it('shows submit error when login service throws', async () => {
    const loginMock = jest
      .fn()
      .mockRejectedValue(new Error('Credenciais inválidas'));
    useAuthSpy.mockReturnValue({ ...guestAuth, login: loginMock });

    const { getByText, getByPlaceholderText, findByText } = render(
      <LoginScreen />
    );

    fireEvent.changeText(getByPlaceholderText('ex: joao.silva'), 'joao.silva');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'errada00');

    await act(async () => {
      fireEvent.press(getByText('Entrar'));
    });

    expect(await findByText('Credenciais inválidas')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('pre-popula login a partir do route param', async () => {
    mockRouteParams = { login: 'novo' };
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: mockRouteParams,
    }));
    useAuthSpy.mockReturnValue(guestAuth);
    const { getByDisplayValue } = render(<LoginScreen />);
    expect(getByDisplayValue('novo')).toBeTruthy();
  });

  it('navega para Signup quando "Cadastre-se" é tocado', () => {
    useAuthSpy.mockReturnValue(guestAuth);
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText(/Cadastre-se como aluno/i));
    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });
});
