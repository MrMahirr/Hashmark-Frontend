import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

/**
 * Merkezi axios instance.
 * SRP (Single Responsibility Principle) gereği sadece HTTP istemcisi temel ayarlarını içerir.
 */
export const apiClient: AxiosInstance = axios.create({
  // Backend'de "/api" context-path bulunmadığı için düzeltildi
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * DIP (Dependency Inversion Principle) ve IOC Container mantığına uygun olarak
 * token ve yetkilendirme (auth) işlemlerini dışarıdan enjekte edilebilir (injectable) bir arayüzle alıyoruz.
 */
export interface AuthProvider {
  getToken: () => string | null;
  onUnauthorized: () => void;
}

/**
 * Zustand Store tabanlı auth sağlayıcısı.
 * Interceptor işlemleri için doğrudan global state okumasını ve temizliğini yapar.
 */
export const zustandAuthProvider: AuthProvider = {
  getToken: () => {
    return useAuthStore.getState().accessToken;
  },
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      useAuthStore.getState().setSessionExpired(true);
    }
  }
};

/**
 * Interceptor'ları uygulayan ana fonksiyon. Bağımlılıkları (apiClient ve authProvider) dışarıdan alır.
 * Böylece birleştirme mantığı, token erişim detaylarından izole edilir (SRP) ve genişletilebilir (OCP) olur.
 */
export const setupInterceptors = (client: AxiosInstance, authProvider: AuthProvider) => {
  // Request Interceptor: JWT token ekleme
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authProvider.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: 401 Unauthorized handling
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        authProvider.onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};

// Uygulama başlarken Zustand Store (IOC Container) ile interceptor'ları kuruyoruz
setupInterceptors(apiClient, zustandAuthProvider);
