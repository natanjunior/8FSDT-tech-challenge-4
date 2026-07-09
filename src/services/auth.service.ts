import { apiClient } from '@/api/client';
import {
  setSecureItem,
  deleteSecureItem,
  SECURE_KEYS,
} from '@/services/secure-storage.service';
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  Profile,
  User,
} from '@/types/api';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    await setSecureItem(SECURE_KEYS.AUTH_TOKEN, data.token);
    await setSecureItem(SECURE_KEYS.AUTH_USER, JSON.stringify(data.user));
    await setSecureItem(
      SECURE_KEYS.AUTH_PROFILE,
      JSON.stringify(data.profile)
    );
    return data;
  } catch (err: any) {
    const apiMessage = err?.response?.data?.error;
    // Backend devolve mensagens deliberadamente vagas em 401 para não
    // vazar se o login existe; preservamos como vem.
    const message =
      apiMessage ?? 'Não foi possível entrar. Tente novamente.';
    throw new Error(message);
  }
}

export async function clearSession(): Promise<void> {
  await deleteSecureItem(SECURE_KEYS.AUTH_TOKEN);
  await deleteSecureItem(SECURE_KEYS.AUTH_USER);
  await deleteSecureItem(SECURE_KEYS.AUTH_PROFILE);
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignora erro de rede — sempre limpa o estado local.
  } finally {
    await clearSession();
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

export function parseStoredProfile(raw: string | null): Profile {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export async function changePassword(
  payload: ChangePasswordRequest
): Promise<void> {
  try {
    await apiClient.patch('/auth/password', payload);
  } catch (err: any) {
    const apiMessage =
      err?.response?.data?.errors?.[0]?.message ??
      err?.response?.data?.error;
    const message = apiMessage ?? 'Não foi possível alterar a senha.';
    throw new Error(message);
  }
}
