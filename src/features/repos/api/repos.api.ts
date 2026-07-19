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
