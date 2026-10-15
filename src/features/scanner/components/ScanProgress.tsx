"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { queryKeys } from "@/shared/api/query-keys";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { useScanStatus } from "../hooks/useScanner";
import { isScanActive } from "../utils/scan-status";

interface ScanProgressProps {
  repoId: string;
  /** Tamamlandıktan sonra bu süre geçince başarı çubuğu gizlenir (ms). */
  hideDoneAfterMs?: number;
}

/**
 * Seçili deponun tarama durumunu canlı gösterir (aria-live ile ekran okuyucuya da duyurulur).
 * Tarama aktifken durum periyodik sorgulanır; bittiğinde borç/dashboard/depo verileri otomatik yenilenir.
 *
 * Not: bu bir polling çözümüdür; sunucudan itme (SSE/WebSocket) için backend desteği gerekir.
 */
export function ScanProgress({ repoId, hideDoneAfterMs = 15_000 }: ScanProgressProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { data: job } = useScanStatus(repoId);

  const previous = useRef<{ jobId: number | null; status: string | undefined }>({ jobId: null, status: undefined });

  // Bitmiş tarama bildirimi yalnızca kısa süre gösterilir; sayfa açılmadan çok önce bitenler hiç gösterilmez
  const [mountedAt] = useState(() => Date.now());
  const [dismissedJobId, setDismissedJobId] = useState<number | null>(null);
  const doneJobId = job?.status === "DONE" ? job.id : null;

  useEffect(() => {
    if (doneJobId === null) return;
    const timer = setTimeout(() => setDismissedJobId(doneJobId), hideDoneAfterMs);
    return () => clearTimeout(timer);
  }, [doneJobId, hideDoneAfterMs]);

  useEffect(() => {
    if (!job) return;
    const before = previous.current;
    const wasActive = before.jobId === job.id && (before.status === "PENDING" || before.status === "RUNNING");
    previous.current = { jobId: job.id, status: job.status };

    // Yalnızca bu oturumda izlenen bir tarama aktiften bitişe geçtiğinde bir kez tetiklenir
    if (wasActive && job.status === "DONE") {
      queryClient.invalidateQueries({ queryKey: queryKeys.debts.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      addToast({
        title: t("scan.doneToast"),
        description: t("scan.done", { debts: job.debtFound, files: job.filesScanned }),
        type: "success",
      });
    } else if (wasActive && job.status === "FAILED") {
      addToast({ title: t("scan.failed"), description: job.message ?? undefined, type: "error" });
    }
  }, [job, queryClient, addToast, t]);

  if (!job) return null;

  const active = isScanActive(job.status);
  const finishedAt = job.finishedAt ? new Date(job.finishedAt).getTime() : 0;
  const recentlyDone =
    job.status === "DONE" && dismissedJobId !== job.id && finishedAt >= mountedAt - hideDoneAfterMs;

  if (!active && job.status !== "FAILED" && !recentlyDone) return null;

  const details: string[] = [];
  if (job.message) details.push(job.message);
  if (job.filesSkipped > 0) details.push(t("scan.skipped", { count: job.filesSkipped }));
  if (job.filesFailed > 0) details.push(t("scan.filesFailed", { count: job.filesFailed }));

  let tone = "border-hm-border bg-hm-surface text-hm-text-primary";
  let icon = <Loader2 size={16} className="animate-spin text-hm-acc" aria-hidden="true" />;
  let text = job.status === "PENDING" ? t("scan.pending") : t("scan.running", { count: job.filesScanned });

  if (job.status === "FAILED") {
    tone = "border-hm-danger bg-hm-danger-bg text-hm-text-primary";
    icon = <AlertCircle size={16} className="text-hm-danger" aria-hidden="true" />;
    text = t("scan.failed");
  } else if (job.status === "DONE") {
    tone = "border-hm-acc bg-hm-surface text-hm-text-primary";
    icon = <CheckCircle2 size={16} className="text-hm-success" aria-hidden="true" />;
    text = t("scan.done", { debts: job.debtFound, files: job.filesScanned });
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t("scan.region")}
      className={`flex items-start gap-3 rounded-card border px-4 py-3 text-sm ${tone}`}
    >
      <span className="mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="font-semibold">{text}</p>
        {details.length > 0 && <p className="mt-0.5 font-mono text-xs text-hm-text-secondary">{details.join(" · ")}</p>}
      </div>
    </div>
  );
}
