import { apiClient } from '@/api/client';
import {
  setSecureItem,
  deleteSecureItem,
  SECURE_KEYS,
} from '@/services/secure-storage.service';
import type { LoginRequest, LoginResponse, User } from '@/types/api';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    await setSecureItem(SECURE_KEYS.AUTH_TOKEN, data.token);
    await setSecureItem(SECURE_KEYS.AUTH_USER, JSON.stringify(data.user));
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.error ?? 'Não foi possível entrar. Tente novamente.';
    throw new Error(message);
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignores network error — always clear local state.
  } finally {
    await deleteSecureItem(SECURE_KEYS.AUTH_TOKEN);
    await deleteSecureItem(SECURE_KEYS.AUTH_USER);
  }
}

export function parseStoredUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
