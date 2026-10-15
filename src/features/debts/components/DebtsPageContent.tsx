"use client";

import React, { useState } from "react";
import { Navbar } from "@/widgets/Navbar";
import { DebtExplorer } from "./DebtExplorer";
import { useDebtStats } from "../hooks/useDebts";
import { useMappedRepos, useSyncRepos } from "@/features/repos/hooks/useRepos";
import { useStartScan } from "@/features/scanner/hooks/useScanner";
import { ScanProgress } from "@/features/scanner/components/ScanProgress";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { RefreshCw, Loader2 } from "lucide-react";

/**
 * SRP & Client Boundary:
 * Tüm teknik borçların listelendiği sayfa: depo seçimi, tarama tetikleme ve canlı tarama durumu.
 * Filtreleme/arama/sıralama/sayfalama `DebtExplorer` içindedir.
 */
export function DebtsPageContent() {
  const { t } = useI18n();
  const [selectedRepo, setSelectedRepo] = useState("");

  const { data: repos } = useMappedRepos();
  const { data: stats } = useDebtStats(selectedRepo || undefined);
  const syncMutation = useSyncRepos();
  const scanMutation = useStartScan();

  const handleScan = () => {
    if (selectedRepo) {
      if (!scanMutation.isPending) scanMutation.mutate(selectedRepo);
    } else if (!syncMutation.isPending) {
      syncMutation.mutate();
    }
  };

  const isScanning = syncMutation.isPending || scanMutation.isPending;

  const title = (
    <span className="flex items-center gap-3">
      <span className="text-[16px] font-medium text-hm-text-primary leading-tight">{t("debts.title")}</span>
      <span className="font-sans text-hm-text-secondary bg-hm-bg border-[0.5px] border-hm-border px-2 py-0.5 rounded-full text-xs">
        {t("debts.totalBadge", { count: stats?.total ?? 0 })}
      </span>
    </span>
  );

  const action = (
    <button
      type="button"
      onClick={handleScan}
      disabled={isScanning}
      className="h-8 px-3 rounded-md bg-hm-text-primary text-hm-surface font-sans text-xs font-medium hover:bg-hm-text-primary/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
    >
      {isScanning ? (
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <RefreshCw size={14} aria-hidden="true" />
      )}
      {isScanning ? t("debts.scanning") : t("debts.scanNow")}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
      <Navbar title={title} action={action} />

      <div className="flex-1 overflow-auto px-4 sm:px-6 pb-6 pt-4 w-full">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-4">
          {selectedRepo && <ScanProgress repoId={selectedRepo} />}
          <DebtExplorer
            repos={repos?.map((repo) => ({ id: repo.id, name: repo.fullName })) ?? []}
            selectedRepo={selectedRepo}
            onRepoChange={setSelectedRepo}
          />
        </div>
      </div>
    </div>
  );
}
