import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import * as AuthContextModule from '@/contexts/AuthContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockReplace = jest.fn();

describe('LoginScreen', () => {
  const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReplace.mockClear();
  });

  it('renders email field and submit button', () => {
    useAuthSpy.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
      isAuthenticating: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByPlaceholderText('seu@email.com')).toBeTruthy();
  });

  it('shows validation error for invalid email', async () => {
    useAuthSpy.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
      isAuthenticating: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText, getByPlaceholderText, findByText } = render(
      <LoginScreen />
    );

    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'not-an-email');
    fireEvent.press(getByText('Entrar'));

    expect(await findByText('E-mail inválido.')).toBeTruthy();
  });

  it('calls login() with trimmed email on submit', async () => {
    const loginMock = jest.fn().mockResolvedValue(undefined);
    useAuthSpy.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
      isAuthenticating: false,
      login: loginMock,
      logout: jest.fn(),
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('seu@email.com'),
      '  prof@escola.edu  '
    );

    await act(async () => {
      fireEvent.press(getByText('Entrar'));
    });

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith({ email: 'prof@escola.edu' })
    );

    expect(mockReplace).toHaveBeenCalledWith('Home');
  });
});
