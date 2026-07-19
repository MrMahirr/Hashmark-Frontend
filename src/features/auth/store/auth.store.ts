import { create } from "zustand";

/**
 * Interface Ayrımı (ISP): State ve Actions arayüzlerini birbirinden ayırıyoruz.
 * Bu sayede Store yapısı tip güvenli ve genişletilebilir (OCP) olur.
 */

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

/**
 * SRP (Single Responsibility Principle):
 * Bu dosyanın (Store) tek bir sorumluluğu vardır: Frontend uygulamasında auth durumunu (state) 
 * yönetmek ve ilgili state güncellemelerini diğer componentlere bildirmek.
 * Hiçbir API çağrısı (HTTP request) veya UI işlemi yapmaz.
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // Başlangıç durumu (Initial state)
  accessToken: typeof window !== "undefined" 
    ? localStorage.getItem("accessToken") 
    : null,
  refreshToken: typeof window !== "undefined" 
    ? localStorage.getItem("refreshToken") 
    : null,
  isAuthenticated: typeof window !== "undefined" 
    ? !!localStorage.getItem("accessToken") 
    : false,

  // Tokenları ve Auth State'i Kaydet
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  // Tokenları ve Auth State'i Temizle (Logout durumu)
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
