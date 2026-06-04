import { apiClient } from '@/api/client';
import { login, logout } from '@/services/auth.service';
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
  SECURE_KEYS: { AUTH_TOKEN: '8fsdt.auth-token', AUTH_USER: '8fsdt.auth-user' },
}));

const mockPost = apiClient.post as jest.Mock;
const mockSet = setSecureItem as jest.Mock;
const mockDelete = deleteSecureItem as jest.Mock;

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('calls POST /auth/login with email and stores token + user', async () => {
      const fakeUser = {
        id: '1',
        name: 'Prof. Maria',
        email: 'maria@escola.edu',
        role: 'TEACHER',
      };
      mockPost.mockResolvedValueOnce({
        data: { token: 'jwt-xyz', user: fakeUser },
      });

      const result = await login({ email: 'maria@escola.edu' });

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: 'maria@escola.edu',
      });
      expect(mockSet).toHaveBeenCalledWith(SECURE_KEYS.AUTH_TOKEN, 'jwt-xyz');
      expect(mockSet).toHaveBeenCalledWith(
        SECURE_KEYS.AUTH_USER,
        JSON.stringify(fakeUser)
      );
      expect(result).toEqual({ token: 'jwt-xyz', user: fakeUser });
    });

    it('propagates a friendly error on 404', async () => {
      mockPost.mockRejectedValueOnce({
        response: { status: 404, data: { error: 'Email não cadastrado' } },
      });
      await expect(login({ email: 'nope@nope.com' })).rejects.toThrow(
        'Email não cadastrado'
      );
    });

    it('throws generic message when response has no error field', async () => {
      mockPost.mockRejectedValueOnce(new Error('network'));
      await expect(login({ email: 'x@x.com' })).rejects.toThrow(
        'Não foi possível entrar. Tente novamente.'
      );
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout then clears secure storage', async () => {
      mockPost.mockResolvedValueOnce({ data: undefined });
      await logout();
      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_TOKEN);
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_USER);
    });

    it('clears secure storage even if server call fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('network'));
      await logout();
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_TOKEN);
      expect(mockDelete).toHaveBeenCalledWith(SECURE_KEYS.AUTH_USER);
    });
  });
});
