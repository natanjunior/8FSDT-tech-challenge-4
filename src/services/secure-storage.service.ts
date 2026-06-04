import * as SecureStore from 'expo-secure-store';

export const SECURE_KEYS = {
  AUTH_TOKEN: '@8fsdt/auth-token',
  AUTH_USER: '@8fsdt/auth-user',
} as const;

export type SecureKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];

export async function setSecureItem(key: SecureKey, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecureItem(key: SecureKey): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecureItem(key: SecureKey): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
