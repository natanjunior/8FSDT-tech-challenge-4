import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { ChangePasswordScreen } from '@/screens/ChangePasswordScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as authService from '@/services/auth.service';

jest.mock('@/services/auth.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, goBack: mockGoBack }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockChange = authService.changePassword as jest.Mock;

const baseAuth = {
  user: { id: 'u1', login: 'joao', role: 'TEACHER' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

describe('ChangePasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthSpy.mockReturnValue(baseAuth);
  });

  it('redireciona para Home se não autenticado', async () => {
    useAuthSpy.mockReturnValue({ ...baseAuth, isAuthenticated: false, user: null });
    render(<ChangePasswordScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('mostra erro quando new_password tem menos de 8 chars', async () => {
    const { getByTestId, getByPlaceholderText, findByText } = render(
      <ChangePasswordScreen />
    );
    fireEvent.changeText(getByPlaceholderText('Senha atual'), 'qualquer');
    fireEvent.changeText(getByPlaceholderText('Nova senha (mín. 8 chars)'), '1234');
    fireEvent.changeText(getByPlaceholderText('Confirme a nova senha'), '1234');
    await act(async () => {
      fireEvent.press(getByTestId('change-password-submit'));
    });
    expect(
      await findByText('Nova senha deve ter no mínimo 8 caracteres.')
    ).toBeTruthy();
    expect(mockChange).not.toHaveBeenCalled();
  });

  it('mostra erro quando senhas não conferem', async () => {
    const { getByTestId, getByPlaceholderText, findByText } = render(
      <ChangePasswordScreen />
    );
    fireEvent.changeText(getByPlaceholderText('Senha atual'), 'qualquer');
    fireEvent.changeText(getByPlaceholderText('Nova senha (mín. 8 chars)'), 'novaSenha123');
    fireEvent.changeText(getByPlaceholderText('Confirme a nova senha'), 'diferente123');
    await act(async () => {
      fireEvent.press(getByTestId('change-password-submit'));
    });
    expect(await findByText('As senhas não conferem.')).toBeTruthy();
    expect(mockChange).not.toHaveBeenCalled();
  });

  it('submete payload correto e goBack em sucesso', async () => {
    mockChange.mockResolvedValueOnce(undefined);
    const { getByTestId, getByPlaceholderText } = render(<ChangePasswordScreen />);
    fireEvent.changeText(getByPlaceholderText('Senha atual'), 'atual123A');
    fireEvent.changeText(getByPlaceholderText('Nova senha (mín. 8 chars)'), 'novaSenha123');
    fireEvent.changeText(getByPlaceholderText('Confirme a nova senha'), 'novaSenha123');
    await act(async () => {
      fireEvent.press(getByTestId('change-password-submit'));
    });
    await waitFor(() =>
      expect(mockChange).toHaveBeenCalledWith({
        current_password: 'atual123A',
        new_password: 'novaSenha123',
      })
    );
    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });

  it('mostra erro quando service rejeita (senha atual errada)', async () => {
    mockChange.mockRejectedValueOnce(new Error('Senha atual incorreta.'));
    const { getByTestId, getByPlaceholderText, findByTestId } = render(
      <ChangePasswordScreen />
    );
    fireEvent.changeText(getByPlaceholderText('Senha atual'), 'errada');
    fireEvent.changeText(getByPlaceholderText('Nova senha (mín. 8 chars)'), 'novaSenha123');
    fireEvent.changeText(getByPlaceholderText('Confirme a nova senha'), 'novaSenha123');
    await act(async () => {
      fireEvent.press(getByTestId('change-password-submit'));
    });
    expect(await findByTestId('submit-error')).toBeTruthy();
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});
