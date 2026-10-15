"use client";

import { Dialog } from "@/shared/components/Dialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/ui/cn";
import { useScanStatus } from "../hooks/useScanner";
import { isScanActive } from "../utils/scan-status";

interface ScanDialogProps {
  open: boolean;
  onClose: () => void;
  repos: ReadonlyArray<{ id: string; fullName: string }>;
}

/**
 * Tarama penceresi: başlatılan her depo için bir ilerleme satırı.
 * Backend yüzde vermez; çubuk "sürüyor" iken belirsiz (indeterminate), bitince dolu gösterilir
 * ve işlenen dosya sayısı yazılır (tasarımdaki yüzde yalnızca dürüstçe karşılanabilen kadarıyla).
 */
export function ScanDialog({ open, onClose, repos }: ScanDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onClose={onClose} title={t("scan.title")}>
      <div className="flex flex-col gap-6 px-5 py-6">
        <ul className="flex flex-col gap-[18px]" aria-label={t("scan.region")}>
          {repos.map((repo) => (
            <ScanRepoRow key={repo.id} repoId={repo.id} name={repo.fullName} />
          ))}
        </ul>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("scan.doneClose")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function ScanRepoRow({ repoId, name }: { repoId: string; name: string }) {
  const { t } = useI18n();
  const { data: job } = useScanStatus(repoId);
  const status = job?.status;
  const active = status === undefined || isScanActive(status);

  let stage = t("scan.pending");
  if (status === "RUNNING") stage = t("scan.running", { count: job?.filesScanned ?? 0 });
  else if (status === "DONE") stage = t("scan.done", { debts: job?.debtFound ?? 0, files: job?.filesScanned ?? 0 });
  else if (status === "FAILED") stage = job?.message ? `${t("scan.failed")}: ${job.message}` : t("scan.failed");

  return (
    <li className="flex flex-col gap-2">
      <span className="truncate font-mono text-sm font-bold text-hm-text-primary">{name}</span>
      <span
        role="progressbar"
        aria-label={name}
        aria-valuetext={stage}
        {...(!active ? { "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 100 } : {})}
        className="relative block h-2.5 overflow-hidden rounded-[5px] bg-[color-mix(in_srgb,var(--hm-text-primary)_10%,transparent)]"
      >
        <span
          className={cn(
            "block h-full rounded-[5px]",
            active ? "hm-anim-indeterminate w-[30%] bg-hm-acc" : status === "FAILED" ? "w-full bg-hm-danger" : "w-full bg-hm-acc",
          )}
        />
      </span>
      <span aria-live="polite" className="text-[13px] text-hm-text-secondary">
        {stage}
      </span>
    </li>
  );
}
