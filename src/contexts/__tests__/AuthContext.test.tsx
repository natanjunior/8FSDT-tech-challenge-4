import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as authService from '@/services/auth.service';
import * as secureStorage from '@/services/secure-storage.service';
import { getMyTeacher } from '@/services/teachers.service';
import { getMyStudent } from '@/services/students.service';
import Toast from 'react-native-toast-message';
import { setUnauthorizedHandler } from '@/api/client';

jest.mock('@/services/auth.service');
jest.mock('@/services/secure-storage.service');
jest.mock('@/services/teachers.service', () => ({
  getMyTeacher: jest.fn(),
}));
jest.mock('@/services/students.service', () => ({
  getMyStudent: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));
jest.mock('@/api/client', () => ({
  setUnauthorizedHandler: jest.fn(),
  attachAuthInterceptor: jest.fn(),
  apiClient: {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
    patch: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
  API_BASE_URL: 'http://test',
}));

const mockGet = secureStorage.getSecureItem as jest.Mock;
const mockSet = secureStorage.setSecureItem as jest.Mock;
const mockLogin = authService.login as jest.Mock;
const mockLogout = authService.logout as jest.Mock;
const mockGetMyTeacher = getMyTeacher as jest.Mock;
const mockGetMyStudent = getMyStudent as jest.Mock;

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
  const { user, profile, isAuthenticated, isHydrating, login, logout, refreshProfile } = useAuth();
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
      <Text testID="do-refresh" onPress={() => refreshProfile()}>refresh</Text>
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

  describe('refreshProfile', () => {
    it('chama getMyTeacher quando user.role é TEACHER e atualiza profile', async () => {
      // Arrange: hydrate as a logged-in TEACHER
      mockGet
        .mockResolvedValueOnce('jwt-xyz')
        .mockResolvedValueOnce(JSON.stringify(fakeUser))   // role: TEACHER
        .mockResolvedValueOnce(JSON.stringify(fakeProfile));
      mockSet.mockResolvedValue(undefined);

      const updatedTeacherProfile = {
        ...fakeProfile,
        id: 'Teacher/abc',
        name: 'João Atualizado',
        email: null as null,
        birth_date: null as null,
        pronouns: null as null,
        biography: null as null,
        status: 'ATIVO' as const,
        disciplines: [],
        user: null as null,
        created_at: '2026-01-01',
        updated_at: '2026-06-01',
      };
      mockGetMyTeacher.mockResolvedValueOnce(updatedTeacherProfile);

      const { getByTestId } = render(
        <AuthProvider>
          <Probe />
        </AuthProvider>
      );

      // Wait for hydration
      await waitFor(() =>
        expect(getByTestId('status').props.children).toBe('auth')
      );

      // Act: call refreshProfile
      await act(async () => {
        getByTestId('do-refresh').props.onPress();
      });

      // Assert: profile updated to new name
      await waitFor(() =>
        expect(getByTestId('profile-name').props.children).toBe('João Atualizado')
      );

      // Assert: getMyTeacher called, getMyStudent NOT called
      expect(mockGetMyTeacher).toHaveBeenCalledTimes(1);
      expect(mockGetMyStudent).not.toHaveBeenCalled();

      // Assert: SecureStore persisted the updated profile
      expect(mockSet).toHaveBeenCalledWith(
        '8fsdt.auth-profile',
        JSON.stringify(updatedTeacherProfile)
      );
    });

    it('chama getMyStudent quando user.role é STUDENT', async () => {
      const fakeStudentUser = { id: 'u2', login: 'ana.student', role: 'STUDENT' as const };
      const fakeStudentProfile = {
        id: 'Student/def',
        name: 'Ana Original',
        email: 'ana@escola.com',
        birth_date: null as null,
        pronouns: null as null,
        biography: null as null,
        status: 'ATIVO' as const,
        disciplines: [],
        user: null as null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };

      // Hydrate as a logged-in STUDENT
      mockGet
        .mockResolvedValueOnce('jwt-abc')
        .mockResolvedValueOnce(JSON.stringify(fakeStudentUser))
        .mockResolvedValueOnce(JSON.stringify(fakeStudentProfile));
      mockSet.mockResolvedValue(undefined);

      const updatedStudentProfile = { ...fakeStudentProfile, name: 'Ana Atualizada' };
      mockGetMyStudent.mockResolvedValueOnce(updatedStudentProfile);

      const { getByTestId } = render(
        <AuthProvider>
          <Probe />
        </AuthProvider>
      );

      await waitFor(() =>
        expect(getByTestId('status').props.children).toBe('auth')
      );

      await act(async () => {
        getByTestId('do-refresh').props.onPress();
      });

      await waitFor(() =>
        expect(getByTestId('profile-name').props.children).toBe('Ana Atualizada')
      );

      expect(mockGetMyStudent).toHaveBeenCalledTimes(1);
      expect(mockGetMyTeacher).not.toHaveBeenCalled();

      expect(mockSet).toHaveBeenCalledWith(
        '8fsdt.auth-profile',
        JSON.stringify(updatedStudentProfile)
      );
    });

    it('é no-op quando user é null (não autenticado)', async () => {
      // Hydrate as guest (no token)
      mockGet.mockResolvedValue(null);

      const { getByTestId } = render(
        <AuthProvider>
          <Probe />
        </AuthProvider>
      );

      await waitFor(() =>
        expect(getByTestId('status').props.children).toBe('guest')
      );

      // Act: call refreshProfile while logged out
      await act(async () => {
        getByTestId('do-refresh').props.onPress();
      });

      // Neither service should be called
      expect(mockGetMyTeacher).not.toHaveBeenCalled();
      expect(mockGetMyStudent).not.toHaveBeenCalled();
      // SecureStore should not have been written
      expect(mockSet).not.toHaveBeenCalled();
    });
  });
});

describe('AuthContext — handler de 401 (sessão expirada)', () => {
  const mockSetHandler = setUnauthorizedHandler as jest.Mock;

  // O AuthProvider registra o handler no mount (fn) e o limpa no unmount (null).
  // Pega a última chamada que recebeu uma função.
  function getRegisteredHandler(): (() => void) | null {
    const calls = mockSetHandler.mock.calls;
    for (let i = calls.length - 1; i >= 0; i--) {
      if (typeof calls[i][0] === 'function') return calls[i][0] as () => void;
    }
    return null;
  }

  function hydrateAuthenticated() {
    mockGet
      .mockResolvedValueOnce('jwt-xyz') // AUTH_TOKEN
      .mockResolvedValueOnce(JSON.stringify(fakeUser)) // AUTH_USER
      .mockResolvedValueOnce(JSON.stringify(fakeProfile)); // AUTH_PROFILE
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('limpa a sessão e mostra Toast ao receber o sinal de 401', async () => {
    hydrateAuthenticated();
    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('auth')
    );

    const handler = getRegisteredHandler();
    expect(handler).toBeTruthy();

    await act(async () => {
      handler!();
    });

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('guest')
    );
    expect(authService.clearSession).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ text1: 'Sessão expirada' })
    );
  });

  it('mostra o Toast de expiração só uma vez para 401s repetidas (guard)', async () => {
    hydrateAuthenticated();
    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('auth')
    );

    const handler = getRegisteredHandler();

    await act(async () => {
      handler!();
      handler!();
    });

    await waitFor(() =>
      expect(getByTestId('status').props.children).toBe('guest')
    );
    expect(Toast.show).toHaveBeenCalledTimes(1);
  });
});
