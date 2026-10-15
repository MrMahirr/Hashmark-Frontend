"use client";

import Link from "next/link";
import { useState } from "react";
import { Repo } from "@/shared/types/repo.types";
import { useStartScan } from "@/features/scanner/hooks/useScanner";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { Button, ButtonLink } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Panel";
import { Heading } from "@/shared/ui/Typography";
import { useDeleteRepo } from "../hooks/useRepos";
import { DebtBreakdownBar } from "./DebtBreakdownBar";

interface RepoCardProps {
  repo: Repo;
}

/** Depo paneli: ad + son tarama, serif toplam, yığılmış etiket çubuğu ve eylemler. */
export const RepoCard = ({ repo }: RepoCardProps) => {
  const { t, formatDate } = useI18n();
  const scanMutation = useStartScan();
  const deleteMutation = useDeleteRepo();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleScan = () => {
    if (!scanMutation.isPending) scanMutation.mutate(repo.id);
  };

  const scanText = repo.lastScanAt
    ? t("repos.lastScanHeader", { date: formatDate(repo.lastScanAt, t("common.never")) })
    : t("repos.notScanned");

  return (
    <Panel className="flex flex-col gap-6 p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 flex-col gap-2">
          <Link
            href={`/dashboard/repos/${repo.id}`}
            aria-label={t("repos.viewRepo", { name: repo.fullName })}
            className="break-all font-mono text-[22px] font-bold text-hm-text-primary no-underline hover:text-hm-acc"
          >
            {repo.fullName}
          </Link>
          <span className="flex flex-wrap items-center gap-2.5 font-mono text-[13px] text-hm-text-secondary">
            {scanText}
            <span className="rounded-pill border border-hm-border px-2.5 py-px text-xs">
              {repo.isPrivate ? t("common.private") : t("common.public")}
            </span>
            {repo.trackedBranch && <span>{repo.trackedBranch}</span>}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" onClick={handleScan} isLoading={scanMutation.isPending}>
            {scanMutation.isPending ? t("debts.scanning") : t("debts.scanNow")}
          </Button>
          <ButtonLink
            href={`/dashboard/repos/${repo.id}`}
            variant="outline"
            className="border-hm-text-primary bg-hm-text-primary text-hm-bg hover:border-hm-text-primary"
          >
            {t("repos.viewDebts")}
          </ButtonLink>
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            {t("repos.remove")}
          </Button>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <Heading as="span" className="text-[72px]">
          {repo.debtCount}
        </Heading>
        <span className="font-mono text-[13px] text-hm-text-secondary">{t("repos.openDebt")}</span>
      </div>

      {repo.debtBreakdown && <DebtBreakdownBar breakdown={repo.debtBreakdown} />}

      <ConfirmDialog
        open={confirmOpen}
        title={t("repos.removeTitle")}
        confirmLabel={t("repos.remove")}
        pending={deleteMutation.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteMutation.mutate(repo.id, {
            onSuccess: () => setConfirmOpen(false),
          })
        }
      >
        <p className="m-0">
          <span className="font-mono text-hm-text-primary">{repo.fullName}</span> — {t("repos.removeText")}
        </p>
      </ConfirmDialog>
    </Panel>
  );
};
