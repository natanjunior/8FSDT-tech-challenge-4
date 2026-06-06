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
  id: 'u1',
  login: 'joao.silva',
  role: 'TEACHER' as const,
};

const fakeProfile = {
  id: 'Teacher/550e8400-e29b-41d4-a716-446655440001',
  name: 'Prof. João Silva',
  email: 'joao.silva@escola.com',
  birth_date: null,
  pronouns: 'ele/dele' as const,
  biography: null,
  status: 'ATIVO' as const,
  disciplines: [],
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
};

function Probe() {
  const { user, profile, isAuthenticated, isHydrating, login, logout } = useAuth();
  return (
    <>
      <Text testID="status">
        {isHydrating ? 'hydrating' : isAuthenticated ? 'auth' : 'guest'}
      </Text>
      <Text testID="user-login">{user?.login ?? 'none'}</Text>
      <Text testID="profile-name">{profile?.name ?? 'none'}</Text>
      <Text
        testID="do-login"
        onPress={() => login({ login: 'joao.silva', password: 'senha123' })}
      >
        login
      </Text>
      <Text testID="do-logout" onPress={() => logout()}>logout</Text>
    </>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hydrates as guest when no stored token', async () => {
    mockGet.mockResolvedValue(null);
    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('guest')
    );
    expect(getByTestId('user-login').props.children).toBe('none');
    expect(getByTestId('profile-name').props.children).toBe('none');
  });

  it('hydrates as authenticated when token + user + profile exist', async () => {
    mockGet
      .mockResolvedValueOnce('jwt-xyz')                       // AUTH_TOKEN
      .mockResolvedValueOnce(JSON.stringify(fakeUser))        // AUTH_USER
      .mockResolvedValueOnce(JSON.stringify(fakeProfile));    // AUTH_PROFILE

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('auth')
    );
    expect(getByTestId('user-login').props.children).toBe('joao.silva');
    expect(getByTestId('profile-name').props.children).toBe('Prof. João Silva');
  });

  it('handles hydration with null profile (credential without profile)', async () => {
    mockGet
      .mockResolvedValueOnce('jwt-xyz')                       // AUTH_TOKEN
      .mockResolvedValueOnce(JSON.stringify(fakeUser))        // AUTH_USER
      .mockResolvedValueOnce('null');                         // AUTH_PROFILE = "null"

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('auth')
    );
    expect(getByTestId('profile-name').props.children).toBe('none');
  });

  it('login() updates user and profile', async () => {
    mockGet.mockResolvedValue(null);
    mockLogin.mockResolvedValueOnce({
      user: fakeUser,
      profile: fakeProfile,
      token: 'jwt',
    });

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
    expect(getByTestId('user-login').props.children).toBe('joao.silva');
    expect(getByTestId('profile-name').props.children).toBe('Prof. João Silva');
  });

  it('logout() clears user and profile', async () => {
    mockGet
      .mockResolvedValueOnce('jwt-xyz')
      .mockResolvedValueOnce(JSON.stringify(fakeUser))
      .mockResolvedValueOnce(JSON.stringify(fakeProfile));
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
    expect(getByTestId('profile-name').props.children).toBe('none');
  });
});
