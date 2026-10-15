import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { useToastStore } from "@/shared/store/toast.store";
import { useI18n } from "@/shared/i18n/I18nProvider";
import {
  getRepos,
  getRepo,
  syncRepos,
  deleteRepo,
  setTrackedBranch, getRepoCandidates, trackRepo } from "../api/repos.api";

import { Repo, ScanStatus } from "@/shared/types/repo.types";
import type { RepoResponse } from "../api/repos.types";

/**
 * SRP ve Adapter Pattern:
 * Repos modülüne ait Component'lar doğrudan API çağrıları yapmak yerine
 * bu hook'ları tüketir. Önbelleğe alma, hata yönetimi ve loading stateleri UI katmanına iletilir.
 */

/**
 * Adapter: Backend DTO'sunu (RepoResponse) UI katmanının (Repo) beklediği formata çevirir.
 * Tarihler ISO olarak taşınır; ekranda kullanıcının diline göre biçimlendirilir.
 */
export function mapRepoResponseToRepo(dto: RepoResponse): Repo {
  const parts = (dto.fullName || "").split("/");
  return {
    id: String(dto.id),
    name: parts.length > 1 ? parts[1] : dto.fullName || `Repo #${dto.id}`,
    fullName: dto.fullName || `repo-${dto.id}`,
    owner: parts.length > 1 ? parts[0] : "",
    language: "",
    description: "",
    isPrivate: dto.isPrivate ?? false,
    lastScanAt: dto.lastScannedAt ?? null,
    scanStatus: dto.lastScannedAt ? ScanStatus.COMPLETED : ScanStatus.IDLE,
    debtCount: dto.debtCount ?? 0,
    resolvedCount: 0,
    connectedAt: dto.createdAt ?? "",
    trackedBranch: dto.trackedBranch ?? null,
    debtBreakdown: dto.debtBreakdown ?? undefined,
  };
}

/**
 * Kullanıcının sahip olduğu tüm repoları fetch eder (ham DTO). Not: `useMappedRepos` ile
 * aynı önbellek anahtarını paylaşmaması için farklı anahtar kullanır.
 */
export function useRepos() {
  return useQuery({
    queryKey: [...queryKeys.repos.all, "raw"],
    queryFn: getRepos,
  });
}

/** Kullanıcının repolarını UI'ın beklediği Repo modeline dönüştürülmüş olarak döner. */
export function useMappedRepos() {
  return useQuery({
    queryKey: queryKeys.repos.all,
    queryFn: async (): Promise<Repo[]> => {
      const list = await getRepos();
      return (list || []).map(mapRepoResponseToRepo);
    },
  });
}

/**
 * Spesifik bir repoId'ye ait veriyi fetch eder ve önbellekler.
 * @param {string} repoId - Backend'den istenecek reponun ID'si
 */
export function useRepo(repoId: string) {
  return useQuery({
    queryKey: queryKeys.repos.detail(repoId),
    queryFn: () => getRepo(repoId),
    enabled: !!repoId,
  });
}

/**
 * GitHub depolarını sisteme senkronize eder. (Mutation)
 * İşlem bittikten sonra listeyi yeniler ve bildirim gösterir.
 */
export function useSyncRepos() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();

  return useMutation({
    mutationFn: syncRepos,
    onMutate: () => {
      addToast({
        title: t("repos.sync.started"),
        description: t("repos.sync.startedDescription"),
        type: "info",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      addToast({
        title: t("repos.sync.done"),
        description: t("repos.sync.doneDescription"),
        type: "success",
      });
    },
    onError: (err: Error) => {
      addToast({
        title: t("repos.sync.failed"),
        description: err.message || t("repos.sync.failedDescription"),
        type: "error",
      });
    },
  });
}

/** Henüz izlenmeyen (aday) depolar; yalnızca `enabled` iken çekilir. */
export function useRepoCandidates(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.repos.candidates,
    queryFn: getRepoCandidates,
    enabled,
  });
}

/** Adayı izlemeye alır; depo listesi ve aday listesi yenilenir. */
export function useTrackRepo() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();

  return useMutation({
    mutationFn: (repoId: string) => trackRepo(repoId),
    onSuccess: (repo) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      addToast({
        title: t("repos.add.done"),
        description: t("repos.add.doneDescription", { name: repo.fullName }),
        type: "success",
      });
    },
    onError: (err: Error) => {
      addToast({ title: t("repos.add.failed"), description: err.message, type: "error" });
    },
  });
}

/** Verilen repoyu sistemden siler. (Mutation) */
export function useDeleteRepo() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();

  return useMutation({
    mutationFn: (repoId: string) => deleteRepo(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      addToast({
        title: t("repos.delete.done"),
        description: t("repos.delete.doneDescription"),
        type: "success",
      });
    },
    onError: (err: Error) => {
      addToast({
        title: t("repos.delete.failed"),
        description: err.message || t("repos.delete.failedDescription"),
        type: "error",
      });
    },
  });
}

/** Taranacak dalı ayarlar; boş değer varsayılan dalı seçer. */
export function useSetTrackedBranch() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({ repoId, branch }: { repoId: string; branch: string | null }) =>
      setTrackedBranch(repoId, branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      addToast({ title: t("repos.branch.saved"), type: "success" });
    },
    onError: () => {
      addToast({ title: t("repos.branch.failed"), type: "error" });
    },
  });
}
