import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as authService from '@/services/auth.service';
import * as secureStorage from '@/services/secure-storage.service';

jest.mock('@/services/auth.service');
jest.mock('@/services/secure-storage.service');

const mockGet = secureStorage.getSecureItem as jest.Mock;
const mockLogin = authService.login as jest.Mock;
const mockLogout = authService.logout as jest.Mock;

const fakeUser = {
  id: '1',
  name: 'Prof. Maria',
  email: 'maria@escola.edu',
  role: 'TEACHER' as const,
};

function Probe() {
  const { user, isAuthenticated, isHydrating, login, logout } = useAuth();
  return (
    <>
      <Text testID="status">
        {isHydrating ? 'hydrating' : isAuthenticated ? 'auth' : 'guest'}
      </Text>
      <Text testID="user">{user?.name ?? 'none'}</Text>
      <Text
        testID="do-login"
        onPress={() => login({ email: 'maria@escola.edu' })}
      >
        login
      </Text>
      <Text testID="do-logout" onPress={() => logout()}>
        logout
      </Text>
    </>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hydrates as guest when no stored token', async () => {
    mockGet.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('status').props.children).toBe('guest');
    });
    expect(getByTestId('user').props.children).toBe('none');
  });

  it('hydrates as authenticated when token + user exist in storage', async () => {
    mockGet
      .mockResolvedValueOnce('jwt-xyz') // AUTH_TOKEN
      .mockResolvedValueOnce(JSON.stringify(fakeUser)); // AUTH_USER

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('status').props.children).toBe('auth');
    });
    expect(getByTestId('user').props.children).toBe('Prof. Maria');
  });

  it('login() calls service and updates state', async () => {
    mockGet.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    mockLogin.mockResolvedValueOnce({ token: 'jwt-xyz', user: fakeUser });

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('guest')
    );

    await act(async () => {
      getByTestId('do-login').props.onPress();
    });

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('auth')
    );
    expect(getByTestId('user').props.children).toBe('Prof. Maria');
  });

  it('logout() clears state', async () => {
    mockGet
      .mockResolvedValueOnce('jwt-xyz')
      .mockResolvedValueOnce(JSON.stringify(fakeUser));
    mockLogout.mockResolvedValueOnce(undefined);

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('auth')
    );

    await act(async () => {
      getByTestId('do-logout').props.onPress();
    });

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('guest')
    );
  });
});
