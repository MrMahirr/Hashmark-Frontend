import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getGitHubLoginUrl,
  handleAuthCallback,
  logout,
} from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

/**
 * SRP (Single Responsibility Principle) ve Adapter Pattern:
 * Bu hook'lar React Bileşenleri (Component) ile API & Store (İş Mantığı) katmanları arasında bir köprü görevi görür.
 * Component'lar içerisindeki karmaşayı engeller ve işlemleri bu hooklarda encapsulate ederiz.
 */

/** 
 * GitHub login işlemini başlatır ve dönen URL'e yönlendirme yapar.
 */
export function useGitHubLogin() {
  return useMutation({
    mutationFn: getGitHubLoginUrl,
    onSuccess: (data) => {
      window.location.href = data.authUrl;
    },
  });
}

/** 
 * GitHub'dan dönen yetki kodunu backend'e iletip tokenları alan OAuth callback sürecini işler.
 */
export function useAuthCallback() {
  const { setTokens } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => handleAuthCallback(code),
    onSuccess: (data) => {
      // Tokenları Global State (Zustand) ve LocalStorage'a kaydet
      setTokens(data.accessToken, data.refreshToken);
      // Başarılı giriş sonrası yönlendirme
      router.push("/dashboard");
    },
  });
}

/** 
 * Kullanıcıyı sistemden çıkış yaptırır ve auth state'ini sıfırlar.
 */
export function useLogout() {
  const { refreshToken, clearTokens } = useAuthStore();
  const router = useRouter();

  return useMutation({
    // refreshToken undefined ise boş string atayarak hata fırlatmasını önlüyoruz
    mutationFn: () => logout({ refreshToken: refreshToken ?? "" }),
    onSuccess: () => {
      clearTokens();
      router.push("/auth/login");
    },
    onError: () => {
      // API'da hata olsa dahi güvenlik gereği token'ları temizleyip çıkış yapıyoruz
      clearTokens();
      router.push("/auth/login");
    },
  });
}
