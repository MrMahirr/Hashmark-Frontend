import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { useToastStore } from "@/shared/store/toast.store";
import { useI18n } from "@/shared/i18n/I18nProvider";
import {
  exportDebts,
  getDebtContext,
  getDebts,
  getDebtStats,
  triageDebt,
  buildDebtParams,
} from "../api/debts.api";
import {
  Debt,
  DebtType,
  DebtStatus,
  type DebtPriority,
  type TriageStatus,
} from "@/shared/types/debt.types";
import type {
  DebtFilters,
  DebtResponse,
  DebtTriageRequest,
  ExportFormat,
  PageResponse,
} from "../api/debts.types";

/**
 * SRP (Single Responsibility Principle) ve Adapter Pattern:
 * API ile React Component'ları (Arayüz) arasındaki iletişimi sağlayan ara katman.
 */

const PRIORITIES: readonly DebtPriority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const TRIAGE: readonly TriageStatus[] = ["OPEN", "IGNORED", "WONT_FIX"];

/**
 * Adapter: Backend DTO'sunu UI katmanının beklediği Debt arayüzüne çevirir.
 * Tarihler ISO olarak taşınır; biçimlendirme gösterim anında kullanıcının diline göre yapılır.
 */
export function mapDebtResponseToDebt(dto: DebtResponse, defaultRepoName = ""): Debt {
  const triage = TRIAGE.includes(dto.triageStatus as TriageStatus) ? (dto.triageStatus as TriageStatus) : "OPEN";
  const priority = PRIORITIES.includes(dto.priority as DebtPriority) ? (dto.priority as DebtPriority) : null;

  return {
    id: String(dto.id),
    type: (dto.label as DebtType) || DebtType.TODO,
    message: dto.content || "",
    filePath: dto.filePath || "",
    lineNumber: dto.lineNo || 0,
    repoId: String(dto.repoId),
    repoName: dto.repoFullName || defaultRepoName || `Repo #${dto.repoId}`,
    status: dto.resolvedAt ? DebtStatus.RESOLVED : DebtStatus.ACTIVE,
    createdAt: dto.detectedAt ?? "",
    resolvedAt: dto.resolvedAt ?? null,
    manuallyResolved: dto.manuallyResolved ?? false,
    triageStatus: triage,
    permalink: dto.permalink ?? null,
    commitSha: dto.commitSha ?? null,
    assignee: dto.assignee ?? null,
    priority,
    dueDate: dto.dueDate ?? null,
    issueRef: dto.issueRef ?? null,
    authorLogin: dto.authorLogin ?? null,
    authorName: dto.authorName ?? null,
    introducedAt: dto.introducedAt ?? null,
  };
}

function filtersKey(filters?: DebtFilters | Record<string, unknown>) {
  const params = buildDebtParams(filters as DebtFilters);
  return Object.keys(params).length > 0 ? queryKeys.debts.filtered(params) : queryKeys.debts.all;
}

/**
 * Veritabanındaki teknik borçları listeler (ham DTO PageResponse).
 */
export function useDebts(filters?: DebtFilters | Record<string, unknown>) {
  return useQuery({
    queryKey: filtersKey(filters),
    queryFn: () => getDebts(filters),
  });
}

/**
 * Borçları UI modeline çevrilmiş olarak döner. Sayfa/filtre değişirken önceki sayfa
 * ekranda kalır (titreşim olmaz).
 */
export function useMappedDebts(filters?: DebtFilters | Record<string, unknown>, defaultRepoName = "") {
  return useQuery({
    queryKey: [...filtersKey(filters), "mapped"],
    queryFn: async (): Promise<PageResponse<Debt>> => {
      const res = await getDebts(filters);
      return {
        ...res,
        content: res.content.map((dto) => mapDebtResponseToDebt(dto, defaultRepoName)),
      };
    },
    placeholderData: keepPreviousData,
  });
}

/** Tüm projenin veya spesifik bir reponun istatistik verilerini çeker. */
export function useDebtStats(repoId?: string) {
  return useQuery({
    queryKey: queryKeys.debts.stats(repoId),
    queryFn: () => getDebtStats(repoId),
  });
}

/** Borcun çevresindeki ±N satır kod. Yalnızca ayrıntı paneli açıkken çekilir. */
export function useDebtContext(debtId: string | null, radius = 5) {
  return useQuery({
    queryKey: ["debts", "context", debtId, radius] as const,
    queryFn: () => getDebtContext(debtId as string, radius),
    enabled: !!debtId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

function invalidateDebtViews(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.debts.all });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
}

/** Tek borç için triyaj (yok say / düzeltilmeyecek / yeniden aç / ata). */
export function useTriageDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DebtTriageRequest }) => triageDebt(id, payload),
    onSuccess: () => invalidateDebtViews(queryClient),
  });
}

export interface BulkTriageResult {
  ok: number;
  failed: number;
}

const BULK_CONCURRENCY = 5;

/**
 * Çoklu seçim için toplu triyaj. Backend'de toplu uç olmadığı için istekler küçük gruplar
 * halinde paralel gönderilir; bir kısmı başarısız olsa da diğerleri uygulanır ve sonuç raporlanır.
 */
export function useBulkTriage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();

  return useMutation({
    mutationFn: async ({ ids, payload }: { ids: string[]; payload: DebtTriageRequest }): Promise<BulkTriageResult> => {
      let ok = 0;
      let failed = 0;
      for (let i = 0; i < ids.length; i += BULK_CONCURRENCY) {
        const chunk = ids.slice(i, i + BULK_CONCURRENCY);
        const results = await Promise.allSettled(chunk.map((id) => triageDebt(id, payload)));
        for (const result of results) {
          if (result.status === "fulfilled") ok++;
          else failed++;
        }
      }
      return { ok, failed };
    },
    onSuccess: ({ ok, failed }) => {
      invalidateDebtViews(queryClient);
      if (failed === 0) {
        addToast({ title: t("debts.bulk.done", { count: ok }), type: "success" });
      } else if (ok === 0) {
        addToast({ title: t("debts.bulk.failed"), type: "error" });
      } else {
        addToast({ title: t("debts.bulk.partial", { ok, failed }), type: "info" });
      }
    },
    onError: () => {
      addToast({ title: t("debts.bulk.failed"), type: "error" });
    },
  });
}

/** Filtrelere göre dışa aktarır ve tarayıcıda dosya olarak indirtir. */
export function useExportDebts() {
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();

  return useMutation({
    mutationFn: async ({ filters, format }: { filters: DebtFilters; format: ExportFormat }) => {
      const file = await exportDebts(filters, format);
      const url = URL.createObjectURL(file.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    onError: () => {
      addToast({ title: t("debts.export.failed"), type: "error" });
    },
  });
}
