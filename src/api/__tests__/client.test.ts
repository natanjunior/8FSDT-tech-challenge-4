import { getSecureItem } from '@/services/secure-storage.service';
import {
  apiClient,
  attachAuthInterceptor,
  setUnauthorizedHandler,
} from '@/api/client';

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

describe('apiClient response interceptor (401 → unauthorized handler)', () => {
  afterEach(() => {
    setUnauthorizedHandler(null);
    jest.clearAllMocks();
  });

  it('chama o handler em 401 quando a request enviou Bearer', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    const error = {
      response: { status: 401 },
      config: { headers: { Authorization: 'Bearer x' } },
    };
    await expect(runResponseError(error)).rejects.toBe(error);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('NÃO chama o handler em 401 sem Authorization (anônimo/login)', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    const error = { response: { status: 401 }, config: { headers: {} } };
    await expect(runResponseError(error)).rejects.toBe(error);
    expect(handler).not.toHaveBeenCalled();
  });

  it('NÃO chama o handler em erro não-401 e ainda rejeita', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    const error = {
      response: { status: 500 },
      config: { headers: { Authorization: 'Bearer x' } },
    };
    await expect(runResponseError(error)).rejects.toBe(error);
    expect(handler).not.toHaveBeenCalled();
  });

  it('não quebra quando nenhum handler está registrado (cleanup)', async () => {
    setUnauthorizedHandler(null);
    const error = {
      response: { status: 401 },
      config: { headers: { Authorization: 'Bearer x' } },
    };
    await expect(runResponseError(error)).rejects.toBe(error);
  });
});

async function runResponseError(error: any) {
  const rejected = (apiClient.interceptors.response as any).handlers[0]
    .rejected;
  return rejected(error);
}
