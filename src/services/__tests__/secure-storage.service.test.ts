import * as SecureStore from 'expo-secure-store';
import {
  SECURE_KEYS,
  setSecureItem,
  getSecureItem,
  deleteSecureItem,
} from '@/services/secure-storage.service';

jest.mock('expo-secure-store');

const mockSet = SecureStore.setItemAsync as jest.Mock;
const mockGet = SecureStore.getItemAsync as jest.Mock;
const mockDelete = SecureStore.deleteItemAsync as jest.Mock;

describe('secure-storage.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes well-known keys', () => {
    expect(SECURE_KEYS.AUTH_TOKEN).toBe('@8fsdt/auth-token');
    expect(SECURE_KEYS.AUTH_USER).toBe('@8fsdt/auth-user');
  });

  it('setSecureItem persists value via SecureStore', async () => {
    mockSet.mockResolvedValueOnce(undefined);
    await setSecureItem(SECURE_KEYS.AUTH_TOKEN, 'abc123');
    expect(mockSet).toHaveBeenCalledWith('@8fsdt/auth-token', 'abc123');
  });

  it('getSecureItem returns stored value', async () => {
    mockGet.mockResolvedValueOnce('abc123');
    await expect(getSecureItem(SECURE_KEYS.AUTH_TOKEN)).resolves.toBe('abc123');
    expect(mockGet).toHaveBeenCalledWith('@8fsdt/auth-token');
  });

  it('getSecureItem returns null when not found', async () => {
    mockGet.mockResolvedValueOnce(null);
    await expect(getSecureItem(SECURE_KEYS.AUTH_TOKEN)).resolves.toBeNull();
  });

  it('deleteSecureItem removes value via SecureStore', async () => {
    mockDelete.mockResolvedValueOnce(undefined);
    await deleteSecureItem(SECURE_KEYS.AUTH_TOKEN);
    expect(mockDelete).toHaveBeenCalledWith('@8fsdt/auth-token');
  });
});
