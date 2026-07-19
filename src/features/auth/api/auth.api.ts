import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type {
  GitHubLoginUrlResponse,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
} from "./auth.types";

/**
 * SRP (Single Responsibility Principle) ve DIP (Dependency Inversion Principle):
 * Bu dosya sadece Auth modülüne ait API isteklerinin nasıl yapılacağından (HTTP katmanı) sorumludur.
 * URL yolları (ApiMethod, ApiEndpoint) ve Http Client (apiClient) gibi altyapı bağımlılıkları 
 * dışarıdan (import ile) alınarak, kodun değişime karşı dirençli ve test edilebilir olması sağlanır.
 */

/** 
 * GitHub OAuth yönlendirme URL'ini backend'den döndürür.
 * @returns {Promise<GitHubLoginUrlResponse>}
 */
export async function getGitHubLoginUrl(): Promise<GitHubLoginUrlResponse> {
  const response = await apiClient.get<GitHubLoginUrlResponse>(
    `${ApiMethod.AUTH}/${ApiEndpoint.GITHUB}`
  );
  return response.data;
}

/** 
 * GitHub OAuth callback "code" bilgisini işleyip backend üzerinden JWT (accessToken, refreshToken) tokenlarını alır.
 * @param {string} code - GitHub auth code
 * @returns {Promise<LoginResponse>}
 */
export async function handleAuthCallback(code: string): Promise<LoginResponse> {
  const response = await apiClient.get<LoginResponse>(
    `${ApiMethod.AUTH}/${ApiEndpoint.CALLBACK}`,
    { params: { code } }
  );
  return response.data;
}

/** 
 * Süresi dolmuş Access Token'ı Refresh Token kullanarak yeniler.
 * @param {RefreshRequest} payload - refreshToken içeren obje
 * @returns {Promise<RefreshResponse>}
 */
export async function refreshAccessToken(payload: RefreshRequest): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>(
    `${ApiMethod.AUTH}/${ApiEndpoint.REFRESH}`,
    payload
  );
  return response.data;
}

/** 
 * Kullanıcı çıkışını gerçekleştirir. (Refresh Token expire edilir/kara listeye alınır)
 * @param {RefreshRequest} payload - refreshToken içeren obje
 * @returns {Promise<void>}
 */
export async function logout(payload: RefreshRequest): Promise<void> {
  await apiClient.post(
    `${ApiMethod.AUTH}/${ApiEndpoint.LOGOUT}`,
    payload
  );
}
