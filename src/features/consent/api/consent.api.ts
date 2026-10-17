import { isAxiosError } from "axios";
import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import type { Locale } from "@/shared/i18n/locales";
import type { ConsentPolicy, ConsentStatus } from "./consent.types";

/** Backend'in makine-okur hata kodları (plan 5.10). */
export const CONSENT_REQUIRED = "CONSENT_REQUIRED";
export const POLICY_OUTDATED = "POLICY_OUTDATED";
export const PRIVATE_REPO_ACK_REQUIRED = "PRIVATE_REPO_ACK_REQUIRED";

export function errorCode(error: unknown): string | undefined {
  return isAxiosError(error) ? (error.response?.data as { code?: string } | undefined)?.code : undefined;
}

/** Aydınlatma/onay metni; kimliksiz okunabilir. */
export async function getConsentPolicy(lang: Locale): Promise<ConsentPolicy> {
  const response = await apiClient.get<ConsentPolicy>("/public/consent-policy", { params: { lang } });
  return response.data;
}

export async function getPrivateRepoNotice(lang: Locale): Promise<ConsentPolicy> {
  const response = await apiClient.get<ConsentPolicy>("/public/private-repo-notice", { params: { lang } });
  return response.data;
}

export async function getConsentStatus(): Promise<ConsentStatus> {
  const response = await apiClient.get<ConsentStatus>(`${ApiMethod.USER}/consent`);
  return response.data;
}

/** Gösterilen metnin sürümü ve özeti gönderilir; metin değiştiyse sunucu 409 POLICY_OUTDATED döner. */
export async function acceptConsent(policy: ConsentPolicy): Promise<ConsentStatus> {
  const response = await apiClient.post<ConsentStatus>(`${ApiMethod.USER}/consent`, {
    version: policy.version,
    language: policy.language,
    hash: policy.hash,
  });
  return response.data;
}

export async function withdrawConsent(): Promise<ConsentStatus> {
  const response = await apiClient.delete<ConsentStatus>(`${ApiMethod.USER}/consent`);
  return response.data;
}

export async function acknowledgePrivateRepo(repoId: string): Promise<void> {
  await apiClient.post(`${ApiMethod.REPOS}/${repoId}/private-ack`);
}
