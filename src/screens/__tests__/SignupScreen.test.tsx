import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { SignupScreen } from '@/screens/SignupScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as studentsService from '@/services/students.service';

jest.mock('@/services/students.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: mockNavigate }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockSignup = studentsService.signupStudent as jest.Mock;

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

const studentLogged = {
  user: { id: 's1', login: 'pedro', role: 'STUDENT' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

describe('SignupScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('redireciona para Home se STUDENT já logado', async () => {
    useAuthSpy.mockReturnValue(studentLogged);
    render(<SignupScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('renderiza o form para anônimo', async () => {
    useAuthSpy.mockReturnValue(guest);
    const { findByText } = render(<SignupScreen />);
    expect(await findByText('Cadastrar')).toBeTruthy();
  });

  it('em sucesso, navega para Login com login pré-preenchido', async () => {
    useAuthSpy.mockReturnValue(guest);
    mockSignup.mockResolvedValueOnce({
      id: 'Student/new',
      name: 'Novo Aluno',
      user: { id: 'u1', login: 'novo', role: 'STUDENT' },
    });
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    fireEvent.changeText(getByPlaceholderText('Ex: Pedro Costa'), 'Novo Aluno');
    fireEvent.changeText(getByPlaceholderText('ex: pedro.costa'), 'novo');
    fireEvent.changeText(getByPlaceholderText('mínimo 8 caracteres'), '12345678');
    await act(async () => {
      fireEvent.press(getByText('Cadastrar'));
    });
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('Login', { login: 'novo' })
    );
  });
});
