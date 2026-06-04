import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { HomeScreen } from '@/screens/HomeScreen';
import * as AuthContextModule from '@/contexts/AuthContext';

describe('HomeScreen', () => {
  const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user name and role', () => {
    useAuthSpy.mockReturnValue({
      user: {
        id: '1',
        name: 'Prof. Maria',
        email: 'maria@escola.edu',
        role: 'TEACHER',
      },
      isAuthenticated: true,
      isHydrating: false,
      isAuthenticating: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Olá, Prof. Maria')).toBeTruthy();
    expect(getByText('TEACHER')).toBeTruthy();
  });

  it('calls logout on button press', () => {
    const logoutMock = jest.fn();
    useAuthSpy.mockReturnValue({
      user: {
        id: '1',
        name: 'Aluno João',
        email: 'joao@aluno.edu',
        role: 'STUDENT',
      },
      isAuthenticated: true,
      isHydrating: false,
      isAuthenticating: false,
      login: jest.fn(),
      logout: logoutMock,
    });
    const { getByText } = render(<HomeScreen />);
    fireEvent.press(getByText('Sair'));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
