import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

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
 * Varsayılan (default) auth sağlayıcısı. Auth Store entegrasyonuna kadar
 * doğrudan localStorage işlemlerini yönetir. (Daha sonra store üzerinden inject edilecek)
 */
export const defaultAuthProvider: AuthProvider = {
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth/login";
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
      if (error.response?.status === 401) {
        authProvider.onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};

// Uygulama başlarken varsayılan sağlayıcı ile interceptor'ları kuruyoruz
setupInterceptors(apiClient, defaultAuthProvider);
