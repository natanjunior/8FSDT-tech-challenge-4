import { apiClient } from '@/api/client';
import {
  login,
  logout,
  parseStoredUser,
  parseStoredProfile,
} from '@/services/auth.service';
import {
  setSecureItem,
  deleteSecureItem,
  SECURE_KEYS,
} from '@/services/secure-storage.service';

jest.mock('@/api/client', () => ({
  apiClient: { post: jest.fn() },
}));
jest.mock('@/services/secure-storage.service', () => ({
  setSecureItem: jest.fn(),
  deleteSecureItem: jest.fn(),
  SECURE_KEYS: {
    AUTH_TOKEN: '8fsdt.auth-token',
    AUTH_USER: '8fsdt.auth-user',
    AUTH_PROFILE: '8fsdt.auth-profile',
  },
}));

const mockPost = apiClient.post as jest.Mock;
const mockSet = setSecureItem as jest.Mock;
const mockDelete = deleteSecureItem as jest.Mock;

const fakeUser = { id: 'u1', login: 'joao.silva', role: 'TEACHER' as const };
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

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('sends { login, password } and persists token + user + profile', async () => {
      mockPost.mockResolvedValueOnce({
        data: { user: fakeUser, profile: fakeProfile, token: 'jwt-xyz' },
      });

      const result = await login({ login: 'joao.silva', password: 'senha123' });

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        login: 'joao.silva',
        password: 'senha123',
      });
      expect(mockSet).toHaveBeenCalledWith(SECURE_KEYS.AUTH_TOKEN, 'jwt-xyz');
      expect(mockSet).toHaveBeenCalledWith(
        SECURE_KEYS.AUTH_USER,
        JSON.stringify(fakeUser)
      );
      expect(mockSet).toHaveBeenCalledWith(
        SECURE_KEYS.AUTH_PROFILE,
        JSON.stringify(fakeProfile)
      );
      expect(result.user).toEqual(fakeUser);
      expect(result.profile).toEqual(fakeProfile);
      expect(result.token).toBe('jwt-xyz');
    });

    it('persists null profile when backend returns it (credential without profile)', async () => {
      mockPost.mockResolvedValueOnce({
        data: { user: fakeUser, profile: null, token: 'jwt' },
      });

      const result = await login({ login: 'orphan', password: 'senha1234' });

      expect(mockSet).toHaveBeenCalledWith(
        SECURE_KEYS.AUTH_PROFILE,
        'null'
      );
      expect(result.profile).toBeNull();
    });

    it('propagates 401 "Credenciais inválidas" message', async () => {
      mockPost.mockRejectedValueOnce({
        response: { status: 401, data: { error: 'Credenciais inválidas' } },
      });
      await expect(
        login({ login: 'x', password: 'y' })
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('propagates 401 "Usuário inativo" message', async () => {
      mockPost.mockRejectedValueOnce({
        response: { status: 401, data: { error: 'Usuário inativo' } },
      });
      await expect(
        login({ login: 'x', password: 'y' })
      ).rejects.toThrow('Usuário inativo');
    });

    it('throws generic message when no api message available', async () => {
      mockPost.mockRejectedValueOnce(new Error('network'));
      await expect(
        login({ login: 'x', password: 'y' })
      ).rejects.toThrow('Não foi possível entrar. Tente novamente.');
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout and clears all 3 secure keys', async () => {
      mockPost.mockResolvedValueOnce({ data: undefined });
      await logout();
      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_TOKEN);
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_USER);
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_PROFILE);
    });

    it('clears all 3 keys even when network call fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('network'));
      await logout();
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_TOKEN);
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_USER);
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_PROFILE);
    });
  });

  describe('parseStoredUser', () => {
    it('returns null for null input', () => {
      expect(parseStoredUser(null)).toBeNull();
    });

    it('parses valid JSON', () => {
      expect(parseStoredUser(JSON.stringify(fakeUser))).toEqual(fakeUser);
    });

    it('returns null on malformed JSON', () => {
      expect(parseStoredUser('not-json')).toBeNull();
    });
  });

  describe('parseStoredProfile', () => {
    it('returns null for null input', () => {
      expect(parseStoredProfile(null)).toBeNull();
    });

    it('parses valid teacher profile', () => {
      expect(parseStoredProfile(JSON.stringify(fakeProfile))).toEqual(fakeProfile);
    });

    it('returns null for the string "null" (since JSON.parse("null") === null)', () => {
      expect(parseStoredProfile('null')).toBeNull();
    });

    it('returns null on malformed JSON', () => {
      expect(parseStoredProfile('not-json')).toBeNull();
    });
  });
});
