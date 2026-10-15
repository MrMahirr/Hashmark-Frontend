"use client";

import Link from "next/link";
import { ChevronRight, Radar } from "lucide-react";
import { Repo } from "@/shared/types/repo.types";
import { useStartScan } from "@/features/scanner/hooks/useScanner";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";

interface RepoHeaderProps {
  repo: Repo;
}

export const RepoHeader = ({ repo }: RepoHeaderProps) => {
  const { t, formatDate } = useI18n();
  const scanMutation = useStartScan();

  const handleScan = () => {
    if (!scanMutation.isPending && repo.id) scanMutation.mutate(repo.id);
  };

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="breadcrumb" className="flex items-center gap-2 font-mono text-xs text-hm-text-secondary">
        <Link href="/dashboard/repos" className="inline-flex min-h-11 items-center hover:text-hm-acc">
          {t("repos.breadcrumb")}
        </Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-hm-text-primary">
          {repo.fullName}
        </span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="m-0 break-all font-mono text-[22px] font-bold text-hm-text-primary">{repo.fullName}</h2>
          <p className="m-0 mt-2 font-mono text-[13px] text-hm-text-secondary">
            {t("repos.lastScanHeader", { date: formatDate(repo.lastScanAt, t("common.never")) })}
          </p>
        </div>
        <Button onClick={handleScan} isLoading={scanMutation.isPending} leftIcon={<Radar size={16} aria-hidden="true" />}>
          {scanMutation.isPending ? t("debts.scanning") : t("debts.scanNow")}
        </Button>
      </div>
    </div>
  );
};
