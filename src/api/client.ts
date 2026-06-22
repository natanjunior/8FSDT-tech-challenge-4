import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSecureItem, SECURE_KEYS } from '@/services/secure-storage.service';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3030';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Render free tier hiberna após ~15min e cold start leva 20-40s.
  // 30s cobre o pior caso sem ficar "esperando para sempre" em rede ruim.
  timeout: 30000,
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
