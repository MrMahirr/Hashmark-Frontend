import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type { Locale } from "@/shared/i18n/locales";
import {
  acceptConsent,
  acknowledgePrivateRepo,
  getConsentPolicy,
  getConsentStatus,
  getPrivateRepoNotice,
  withdrawConsent,
} from "../api/consent.api";
import type { ConsentPolicy } from "../api/consent.types";

export function useConsentPolicy(locale: Locale) {
  return useQuery({
    queryKey: queryKeys.consent.policy(locale),
    queryFn: () => getConsentPolicy(locale),
    staleTime: 5 * 60_000,
  });
}

export function usePrivateRepoNotice(locale: Locale, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.consent.privateRepoNotice(locale),
    queryFn: () => getPrivateRepoNotice(locale),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useConsentStatus() {
  return useQuery({ queryKey: queryKeys.consent.status, queryFn: getConsentStatus });
}

/** Onay/geri çekme profil (consentRequired) ve durum sorgularını tazeler. */
function useInvalidateConsent() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.me });
    queryClient.invalidateQueries({ queryKey: queryKeys.consent.status });
  };
}

export function useAcceptConsent() {
  const invalidate = useInvalidateConsent();
  return useMutation({
    mutationFn: (policy: ConsentPolicy) => acceptConsent(policy),
    onSuccess: invalidate,
  });
}

export function useWithdrawConsent() {
  const invalidate = useInvalidateConsent();
  return useMutation({ mutationFn: withdrawConsent, onSuccess: invalidate });
}

export function useAcknowledgePrivateRepo() {
  return useMutation({ mutationFn: (repoId: string) => acknowledgePrivateRepo(repoId) });
}
