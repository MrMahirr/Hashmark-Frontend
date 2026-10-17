"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { queryKeys } from "@/shared/api/query-keys";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Button } from "@/shared/ui/Button";
import { useMappedRepos } from "@/features/repos/hooks/useRepos";
import { startScan } from "../api/scanner.api";
import { PRIVATE_REPO_ACK_REQUIRED, errorCode } from "@/features/consent/api/consent.api";
import { ScanDialog } from "./ScanDialog";

/**
 * Bağlı tüm depolar için tarama sıraya alınır. Zaten kuyrukta/çalışan depolar (409)
 * sessizce atlanır; sonuç tek bir bildirimle raporlanır.
 */
export function ScanAllButton() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { data: repos = [] } = useMappedRepos();
  const [scanning, setScanning] = useState<string[]>([]);

  const scanAll = useMutation({
    mutationFn: async () => {
      const results = await Promise.allSettled(repos.map((repo) => startScan(repo.id)));
      const needsAck = results.filter(
        (r) => r.status === "rejected" && errorCode(r.reason) === PRIVATE_REPO_ACK_REQUIRED,
      ).length;
      return {
        startedIds: repos.filter((_, index) => results[index].status === "fulfilled").map((repo) => repo.id),
        needsAck,
      };
    },
    onSuccess: ({ startedIds, needsAck }) => {
      // Özel depolar toplu taramada atlanır; ek onay depo tek tek taranırken istenir
      if (needsAck > 0) {
        addToast({ title: t("privateRepo.skipped", { count: needsAck }), type: "info" });
      }
      repos.forEach((repo) =>
        queryClient.invalidateQueries({ queryKey: queryKeys.scanner.status(repo.id) })
      );
      if (startedIds.length === 0) {
        addToast({
          title: t("scan.started"),
          description: t("scan.startedAll", { count: 0 }),
          type: "success",
        });
        return;
      }
      setScanning(startedIds);
    },
    onError: () => {
      addToast({ title: t("scan.startFailed"), description: t("scan.startFailedDescription"), type: "error" });
    },
  });

  return (
    <>
      <Button
        onClick={() => scanAll.mutate()}
        disabled={repos.length === 0}
        isLoading={scanAll.isPending}
        leftIcon={<Search size={16} aria-hidden="true" />}
        className="max-sm:hidden"
      >
        {t("nav.scanAll")}
      </Button>
      <ScanDialog
        open={scanning.length > 0}
        repos={repos.filter((repo) => scanning.includes(repo.id))}
        onClose={() => setScanning([])}
      />
    </>
  );
}
