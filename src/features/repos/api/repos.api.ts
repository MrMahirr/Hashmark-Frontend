import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { RepoResponse } from "./repos.types";

/**
 * SRP (Single Responsibility Principle) ve DIP (Dependency Inversion Principle):
 * Bu dosya sadece Repos (Depolar) modülüne ait API isteklerinin nasıl yapılacağından sorumludur.
 * Hardcoded stringler yerine global sabitleri (ApiMethod, ApiEndpoint) ve soyutlanmış HTTP client'ı 
 * kullanarak değişime karşı dirençli (Open/Closed Principle) bir yapı sunar.
 */

/** 
 * Oturum açmış kullanıcının tüm repolarını backend üzerinden listeler.
 * @returns {Promise<RepoResponse[]>} Repo dizisi döner.
 */
export async function getRepos(): Promise<RepoResponse[]> {
  const response = await apiClient.get<RepoResponse[]>(
    ApiMethod.REPOS
  );
  return response.data;
}

/** 
 * Verilen id değerine ait tekil (spesifik) repo detayını getirir.
 * @param {string} repoId - Sorgulanacak repo'nun id'si (Backend'de Long karşılığı)
 * @returns {Promise<RepoResponse>} Tekil repo döner.
 */
export async function getRepo(repoId: string): Promise<RepoResponse> {
  const response = await apiClient.get<RepoResponse>(
    `${ApiMethod.REPOS}/${repoId}`
  );
  return response.data;
}

/** 
 * Backend'e istek atarak GitHub üzerindeki kullanıcının repolarını sistemle senkronize eder.
 * @returns {Promise<void>} 
 */
export async function syncRepos(): Promise<void> {
  await apiClient.post(
    `${ApiMethod.REPOS}/${ApiEndpoint.SYNC}`
  );
}

/** GitHub'dan senkronlanmış ama henüz izlenmeyen (aday) depolar. */
export async function getRepoCandidates(): Promise<RepoResponse[]> {
  const response = await apiClient.get<RepoResponse[]>(`${ApiMethod.REPOS}/candidates`);
  return response.data;
}

/** Adayı izlemeye alır (taramalara dahil olur). */
export async function trackRepo(repoId: string): Promise<RepoResponse> {
  const response = await apiClient.post<RepoResponse>(`${ApiMethod.REPOS}/${repoId}/track`);
  return response.data;
}

/** 
 * Verilen id değerine ait repoyu sistemden (ve veritabanından) siler.
 * @param {string} repoId - Silinecek repo'nun id'si
 * @returns {Promise<void>}
 */
export async function deleteRepo(repoId: string): Promise<void> {
  await apiClient.delete(
    `${ApiMethod.REPOS}/${repoId}`
  );
}

/**
 * Taramanın izleyeceği dalı ayarlar. Boş/null → deponun varsayılan dalı.
 * @param {string} repoId - Repo id'si
 * @param {string | null} branch - Dal adı
 */
export async function setTrackedBranch(repoId: string, branch: string | null): Promise<RepoResponse> {
  const response = await apiClient.put<RepoResponse>(
    `${ApiMethod.REPOS}/${repoId}/branch`,
    { branch }
  );
  return response.data;
}

/**
 * Push'ta otomatik taramayı açar/kapatır. Açmak depoya GitHub webhook'u kurar (depoda admin yetkisi gerekir).
 * @param {string} repoId - Repo id'si
 * @param {boolean} enabled - true: aç, false: kapat
 */
export async function setAutoScan(repoId: string, enabled: boolean): Promise<RepoResponse> {
  const response = await apiClient.put<RepoResponse>(
    `${ApiMethod.REPOS}/${repoId}/auto-scan`,
    { enabled }
  );
  return response.data;
}

/** README rozeti durumu: açıksa tahmin edilemez anahtar. Backend: dev.hashmark.badge.BadgeController.BadgeInfo */
export interface BadgeInfo {
  enabled: boolean;
  token: string | null;
}

export async function getBadge(repoId: string): Promise<BadgeInfo> {
  return (await apiClient.get<BadgeInfo>(`${ApiMethod.REPOS}/${repoId}/badge`)).data;
}

/** Rozeti açar ya da anahtarı yeniler (eski README bağlantıları çalışmaz). */
export async function rotateBadge(repoId: string): Promise<BadgeInfo> {
  return (await apiClient.post<BadgeInfo>(`${ApiMethod.REPOS}/${repoId}/badge`)).data;
}

export async function disableBadge(repoId: string): Promise<void> {
  await apiClient.delete(`${ApiMethod.REPOS}/${repoId}/badge`);
}
