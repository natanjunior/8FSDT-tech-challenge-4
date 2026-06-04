import { getSecureItem } from '@/services/secure-storage.service';
import { apiClient, attachAuthInterceptor } from '@/api/client';

jest.mock('@/services/secure-storage.service');

const mockGetSecureItem = getSecureItem as jest.Mock;

describe('apiClient interceptor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('injects Authorization header when token exists', async () => {
    mockGetSecureItem.mockResolvedValueOnce('token-xyz');

    const config = await runRequestInterceptor({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer token-xyz');
  });

  it('omits Authorization header when no token', async () => {
    mockGetSecureItem.mockResolvedValueOnce(null);

    const config = await runRequestInterceptor({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});

async function runRequestInterceptor(initial: any) {
  // pull the registered fulfilled handler off axios' interceptors
  const handler = (apiClient.interceptors.request as any).handlers[0]
    .fulfilled;
  return handler(initial);
}
