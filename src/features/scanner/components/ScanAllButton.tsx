"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { queryKeys } from "@/shared/api/query-keys";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { useMappedRepos } from "@/features/repos/hooks/useRepos";
import { startScan } from "../api/scanner.api";

/**
 * Bağlı tüm depolar için tarama sıraya alınır. Zaten kuyrukta/çalışan depolar (409)
 * sessizce atlanır; sonuç tek bir bildirimle raporlanır.
 */
export function ScanAllButton() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { data: repos = [] } = useMappedRepos();

  const scanAll = useMutation({
    mutationFn: async () => {
      const results = await Promise.allSettled(repos.map((repo) => startScan(repo.id)));
      return results.filter((r) => r.status === "fulfilled").length;
    },
    onSuccess: (started) => {
      repos.forEach((repo) =>
        queryClient.invalidateQueries({ queryKey: queryKeys.scanner.status(repo.id) })
      );
      addToast({
        title: t("scan.started"),
        description: t("scan.startedAll", { count: started }),
        type: "success",
      });
    },
    onError: () => {
      addToast({ title: t("scan.startFailed"), description: t("scan.startFailedDescription"), type: "error" });
    },
  });

  return (
    <button
      type="button"
      onClick={() => scanAll.mutate()}
      disabled={scanAll.isPending || repos.length === 0}
      className="hidden sm:flex bg-hm-text-primary text-hm-surface font-sans text-sm font-medium px-4 py-2 rounded-lg border-[0.5px] border-hm-border hover:bg-hm-text-primary/90 transition-colors items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {scanAll.isPending ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        <Search size={16} aria-hidden="true" />
      )}
      {t("nav.scanAll")}
    </button>
  );
}
