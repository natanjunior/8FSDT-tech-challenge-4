import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSecureItem, SECURE_KEYS } from '@/services/secure-storage.service';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3030';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Render free tier hiberna após ~15min e cold start leva 20-40s.
  // 30s cobre o pior caso sem ficar "esperando para sempre" em rede ruim.
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Ponte singleton-axios ↔ React Context: o response interceptor (módulo) precisa
// avisar o AuthContext (React) numa 401 de sessão. O AuthProvider registra o handler
// via useEffect e o limpa no cleanup. Evita import circular (a api não importa o Context).
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export function attachAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await getSecureItem(SECURE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      // Só dispara se a request realmente carregava sessão (Bearer enviado).
      // 401 anônimo (POST /comments) e login não enviam Authorization → não deslogam.
      const sentAuth = Boolean(error.config?.headers?.Authorization);
      if (status === 401 && sentAuth) {
        onUnauthorized?.();
      }
      return Promise.reject(error);
    }
  );
}

attachAuthInterceptor(apiClient);
