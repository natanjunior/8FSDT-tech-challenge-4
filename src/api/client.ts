import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSecureItem, SECURE_KEYS } from '@/services/secure-storage.service';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3030';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function attachAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await getSecureItem(SECURE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

attachAuthInterceptor(apiClient);
