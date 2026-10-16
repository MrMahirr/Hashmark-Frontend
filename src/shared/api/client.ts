import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
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
  getRefreshToken: () => string | null;
  /** Access token sessizce yenilendiğinde çağrılır. */
  onTokenRefreshed: (accessToken: string, refreshToken?: string) => void;
  /** Oturum kurtarılamadığında (refresh yok/başarısız) çağrılır. */
  onUnauthorized: () => void;
}

/**
 * Zustand Store tabanlı auth sağlayıcısı.
 * Interceptor işlemleri için doğrudan global state okumasını ve temizliğini yapar.
 */
export const zustandAuthProvider: AuthProvider = {
  getToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => {
    // Çoklu sekme: başka bir sekme token'ı döndürdüyse (rotation) güncel değer localStorage'dadır.
    try {
      return localStorage.getItem("refreshToken") ?? useAuthStore.getState().refreshToken;
    } catch {
      return useAuthStore.getState().refreshToken;
    }
  },
  onTokenRefreshed: (accessToken, refreshToken) => {
    useAuthStore.getState().setAccessToken(accessToken, refreshToken);
  },
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      useAuthStore.getState().setSessionExpired(true);
    }
  },
};

/** Oturum kurtarılamaz: yenilenecek token yok veya yanıt geçersiz. */
class SessionLostError extends Error {}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface InterceptorOptions {
  /** Refresh isteği için kullanılacak istemci (interceptor'suz olmalı; sonsuz döngüyü önler). */
  refreshClient?: AxiosInstance;
}

/** Kimlik uçları (login, callback, refresh, logout) için yenileme denenmez. */
function isAuthEndpoint(url: string | undefined): boolean {
  return !!url && /\/auth\//.test(url);
}

/**
 * Interceptor'ları uygulayan ana fonksiyon. Bağımlılıkları (apiClient ve authProvider) dışarıdan alır.
 *
 * 401 davranışı:
 *  1. Refresh token varsa, access token SESSİZCE yenilenir ve istek bir kez tekrarlanır.
 *     Aynı anda gelen birden çok 401 tek bir refresh isteğini paylaşır (single-flight).
 *  2. Yenileme mümkün değilse veya başarısızsa `onUnauthorized` çağrılır (oturum süresi doldu).
 * 403 (yetki yok) oturumu düşürmez; çağıran tarafa hata olarak iletilir.
 */
export const setupInterceptors = (
  client: AxiosInstance,
  authProvider: AuthProvider,
  options: InterceptorOptions = {}
) => {
  let refreshInFlight: Promise<string> | null = null;

  const refreshClient =
    options.refreshClient ??
    axios.create({
      baseURL: client.defaults.baseURL,
      timeout: client.defaults.timeout,
      headers: { "Content-Type": "application/json" },
    });

  const refreshAccessToken = (): Promise<string> => {
    if (!refreshInFlight) {
      const refreshToken = authProvider.getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(new SessionLostError("No refresh token"));
      }
      refreshInFlight = refreshClient
        .post<{ accessToken: string; refreshToken?: string }>("/auth/refresh", { refreshToken })
        .then((response) => {
          const accessToken = response.data?.accessToken;
          if (!accessToken) {
            throw new SessionLostError("Refresh response had no access token");
          }
          const rotated = response.data.refreshToken;
          if (rotated) {
            authProvider.onTokenRefreshed(accessToken, rotated);
          } else {
            authProvider.onTokenRefreshed(accessToken);
          }
          return accessToken;
        })
        .finally(() => {
          refreshInFlight = null;
        });
    }
    return refreshInFlight;
  };

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

  // Response Interceptor: 401'de sessiz yenileme + tekrar deneme
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const original = error.config as RetriableConfig | undefined;

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (!original || original._retry || isAuthEndpoint(original.url)) {
        authProvider.onUnauthorized();
        return Promise.reject(error);
      }

      original._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return await client.request(original);
      } catch (e) {
        // Ağ hatası veya 5xx oturumu düşürmez; yalnızca kurtarılamayan 401 düşürür.
        const status = axios.isAxiosError(e) ? e.response?.status : undefined;
        if (e instanceof SessionLostError || status === 401) {
          authProvider.onUnauthorized();
        }
        return Promise.reject(axios.isAxiosError(e) ? e : error);
      }
    }
  );
};

// Uygulama başlarken Zustand Store (IOC Container) ile interceptor'ları kuruyoruz
setupInterceptors(apiClient, zustandAuthProvider);
