import { create } from "zustand";
import { clearSessionCookie, setSessionCookie } from "@/shared/auth/session";

/**
 * Interface Ayrımı (ISP): State ve Actions arayüzlerini birbirinden ayırıyoruz.
 * Bu sayede Store yapısı tip güvenli ve genişletilebilir (OCP) olur.
 */

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  /** Yalnızca access token yenilenirken kullanılır; refresh token ve oturum aynı kalır. */
  setAccessToken: (accessToken: string, refreshToken?: string) => void;
  clearTokens: () => void;
  setSessionExpired: (expired: boolean) => void;
}

function readStorage(key: string): string | null {
  try {
    return typeof window !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null; // gizli mod / engellenmiş depolama
  }
}

const initialAccessToken = readStorage("accessToken");
if (initialAccessToken) {
  // Çerez yoksa (eski oturumlar) proxy'nin yanlışlıkla login'e atmaması için eşitle
  setSessionCookie();
}

/**
 * SRP (Single Responsibility Principle):
 * Bu dosyanın (Store) tek bir sorumluluğu vardır: Frontend uygulamasında auth durumunu (state)
 * yönetmek ve ilgili state güncellemelerini diğer componentlere bildirmek.
 * Hiçbir API çağrısı (HTTP request) veya UI işlemi yapmaz.
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: initialAccessToken,
  refreshToken: readStorage("refreshToken"),
  isAuthenticated: !!initialAccessToken,
  sessionExpired: false,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setSessionCookie();
    set({ accessToken, refreshToken, isAuthenticated: true, sessionExpired: false });
  },

  setAccessToken: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      // Rotation: eski refresh token artık geçersiz, yenisi saklanmalı.
      localStorage.setItem("refreshToken", refreshToken);
      set({ accessToken, refreshToken, isAuthenticated: true });
      return;
    }
    set({ accessToken, isAuthenticated: true });
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    clearSessionCookie();
    set({ accessToken: null, refreshToken: null, isAuthenticated: false, sessionExpired: false });
  },

  setSessionExpired: (expired: boolean) => {
    set({ sessionExpired: expired });
  },
}));
