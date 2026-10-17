import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/shared/api/query-keys";
import { deleteAccount, disconnectGithub } from "./../api/user.api";
import { consumeOAuthState, rememberOAuthState } from "@/shared/auth/oauth-state";
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
      rememberOAuthState(data.authUrl);
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
    mutationFn: ({ code, state }: { code: string; state: string }) => {
      // State bu tarayıcıda başlatılan girişle eşleşmiyorsa kod backend'e hiç gönderilmez (login CSRF).
      if (!consumeOAuthState(state)) {
        return Promise.reject(new Error("OAuth state mismatch"));
      }
      return handleAuthCallback(code, state);
    },
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

/**
 * GitHub bağlantısını keser. `deleteData` true ise depo ve borç kayıtları da silinir.
 * Başarılı olunca profil ve depo önbelleği yenilenir.
 */
export function useDisconnectGithub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deleteData: boolean) => disconnectGithub(deleteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.debts.all });
    },
  });
}

/** Hesabı ve tüm verileri kalıcı olarak siler; başarılı olunca yerel oturum temizlenir. */
export function useDeleteAccount() {
  const { clearTokens } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      router.push("/auth/login");
    },
  });
}
