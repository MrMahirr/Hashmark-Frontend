"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Navbar } from "@/widgets/Navbar";
import { DebtExplorer } from "./DebtExplorer";
import { useDebtStats } from "../hooks/useDebts";
import { useMappedRepos, useSyncRepos } from "@/features/repos/hooks/useRepos";
import { useStartScan } from "@/features/scanner/hooks/useScanner";
import { ScanProgress } from "@/features/scanner/components/ScanProgress";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";

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
      <span>{t("debts.title")}</span>
      <span className="rounded-pill border border-hm-border bg-hm-surface px-3 py-0.5 font-mono text-xs font-bold text-hm-text-secondary">
        {t("debts.totalBadge", { count: stats?.total ?? 0 })}
      </span>
    </span>
  );

  const action = (
    <Button
      onClick={handleScan}
      isLoading={isScanning}
      leftIcon={<RefreshCw size={14} aria-hidden="true" />}
      className="max-sm:hidden"
    >
      {isScanning ? t("debts.scanning") : t("debts.scanNow")}
    </Button>
  );

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      <Navbar title={title} action={action} />

      <div className="w-full flex-1 overflow-auto px-4 py-5 sm:p-8">
        <div className="flex w-full flex-col gap-5">
          {selectedRepo && <ScanProgress repoId={selectedRepo} />}
          <DebtExplorer
            repos={repos?.map((repo) => ({ id: repo.id, name: repo.fullName, debtCount: repo.debtCount })) ?? []}
            selectedRepo={selectedRepo}
            onRepoChange={setSelectedRepo}
          />
        </div>
      </div>
    </div>
  );
}
