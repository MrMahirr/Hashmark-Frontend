"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, File, Folder, Loader2 } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Panel } from "@/shared/ui/Panel";
import { cn } from "@/shared/ui/cn";
import { useHotspots } from "@/features/dashboard/hooks/useDashboard";
import type { HotspotNodeDto } from "@/features/dashboard/api/dashboard.types";
import { buildDebtsHref } from "@/features/debts/utils/debt-links";

interface HotspotMapProps {
  repoId: string;
  repoName: string;
}

/** Isı rengi: en sıcak öğeye göre oran; boş/çok soğuk öğe de görünür kalır. */
export function heatColor(ratio: number): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  return `color-mix(in srgb, var(--hm-danger) ${Math.round(12 + clamped * 78)}%, transparent)`;
}

const ROW = "grid grid-cols-[minmax(0,1fr)_minmax(80px,30%)_auto] items-center gap-3";

/**
 * Hotspot haritası: klasörlerin ağırlıklı borca göre ısısı. Klasöre tıklayınca içine inilir, dosya ve
 * klasör adları süzülmüş borç listesine bağlanır; yanda klasörün altındaki en sıcak dosyalar.
 */
export function HotspotMap({ repoId, repoName }: HotspotMapProps) {
  const { t } = useI18n();
  const [path, setPath] = useState("");
  const { data, isLoading, isError, isFetching, refetch } = useHotspots(repoId, path);

  const segments = path ? path.split("/") : [];
  const maxWeight = Math.max(0, ...(data?.children ?? []).map((c) => c.weightedDebt));
  const debtsHref = (node: HotspotNodeDto) => buildDebtsHref({ repoId, path: node.path, debtOnly: true });

  const nodeLabel = (node: HotspotNodeDto) =>
    node.directory
      ? t("hotspots.dirSummary", { debts: node.debts, files: node.files })
      : t("hotspots.fileSummary", { debts: node.debts });

  return (
    <Panel className="flex min-w-0 flex-col gap-[18px] p-6" aria-busy={isFetching}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("hotspots.title")}</h2>
        {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-hm-acc" aria-hidden="true" />}
      </div>

      <nav aria-label={t("hotspots.breadcrumb")}>
        <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 font-mono text-[13px]">
          <li>
            <button
              type="button"
              onClick={() => setPath("")}
              aria-current={path === "" ? "location" : undefined}
              className={cn(
                "min-h-11 cursor-pointer rounded-[8px] px-2 hover:text-hm-acc",
                path === "" ? "font-bold text-hm-text-primary" : "text-hm-text-secondary",
              )}
            >
              {repoName}
            </button>
          </li>
          {segments.map((segment, index) => {
            const target = segments.slice(0, index + 1).join("/");
            const current = index === segments.length - 1;
            return (
              <li key={target} className="flex items-center gap-1">
                <ChevronRight size={14} className="text-hm-text-muted" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setPath(target)}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "min-h-11 cursor-pointer rounded-[8px] px-2 hover:text-hm-acc",
                    current ? "font-bold text-hm-text-primary" : "text-hm-text-secondary",
                  )}
                >
                  {segment}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {isLoading ? (
        <p role="status" className="m-0 py-6 text-center text-sm text-hm-text-secondary">
          {t("common.loading")}
        </p>
      ) : isError || !data ? (
        <p role="alert" className="m-0 py-6 text-center text-sm text-hm-danger">
          {t("hotspots.error")}{" "}
          <button type="button" onClick={() => refetch()} className="cursor-pointer underline">
            {t("common.retry")}
          </button>
        </p>
      ) : data.children.length === 0 ? (
        <p className="m-0 py-6 text-center text-sm text-hm-text-secondary">{t("hotspots.empty")}</p>
      ) : (
        <div className="flex flex-wrap items-start gap-6">
          <ul className="m-0 flex min-w-0 flex-[2_1_380px] list-none flex-col gap-2 p-0" aria-label={t("hotspots.children")}>
            {data.children.map((node) => {
              const ratio = maxWeight > 0 ? node.weightedDebt / maxWeight : 0;
              const Icon = node.directory ? Folder : File;
              return (
                <li key={`${node.directory ? "d" : "f"}:${node.path}`} className={ROW}>
                  {node.directory ? (
                    <button
                      type="button"
                      onClick={() => setPath(node.path)}
                      title={t("hotspots.open", { name: node.name })}
                      className="flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-[8px] text-left font-mono text-[13px] text-hm-text-primary hover:text-hm-acc"
                    >
                      <Icon size={15} className="shrink-0 text-hm-text-secondary" aria-hidden="true" />
                      <span className="truncate">{node.name}/</span>
                    </button>
                  ) : (
                    <Link
                      href={debtsHref(node)}
                      className="flex min-h-11 min-w-0 items-center gap-2 font-mono text-[13px] text-hm-text-primary hover:text-hm-acc hover:underline"
                    >
                      <Icon size={15} className="shrink-0 text-hm-text-secondary" aria-hidden="true" />
                      <span className="truncate">{node.name}</span>
                    </Link>
                  )}
                  <div
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(ratio * 100)}
                    aria-label={`${node.name}: ${t("hotspots.heat", { weight: node.weightedDebt })}`}
                    className="h-3 overflow-hidden rounded-[4px] bg-[color-mix(in_srgb,var(--hm-text-primary)_8%,transparent)]"
                  >
                    <div
                      className="h-full rounded-[4px]"
                      style={{ width: `${Math.max(4, ratio * 100)}%`, background: heatColor(ratio) }}
                    />
                  </div>
                  <span className="flex items-center gap-2 whitespace-nowrap text-right font-mono text-xs text-hm-text-secondary">
                    {node.directory ? (
                      <Link href={debtsHref(node)} className="hover:text-hm-acc hover:underline" title={t("hotspots.listDebts")}>
                        {nodeLabel(node)}
                      </Link>
                    ) : (
                      nodeLabel(node)
                    )}
                    {node.staleCount > 0 && (
                      <span className="text-hm-danger" title={t("hotspots.staleHint")}>
                        {t("hotspots.stale", { count: node.staleCount })}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
            {data.hiddenChildren > 0 && (
              <li className="font-mono text-xs text-hm-text-secondary">
                {t("hotspots.hidden", { count: data.hiddenChildren })}
              </li>
            )}
          </ul>

          <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-3">
            <h3 className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-hm-text-secondary">
              {t("hotspots.topFiles")}
            </h3>
            <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
              {data.topFiles.map((file, index) => (
                <li key={file.path} className="flex items-baseline gap-2 font-mono text-[13px]">
                  <span className="w-5 shrink-0 text-right text-hm-text-muted">{index + 1}.</span>
                  <Link
                    href={debtsHref(file)}
                    title={file.path}
                    className="min-w-0 flex-1 truncate text-hm-text-primary hover:text-hm-acc hover:underline"
                  >
                    {file.path.slice(path ? path.length + 1 : 0)}
                  </Link>
                  <span className="shrink-0 text-hm-text-secondary">{file.debts}</span>
                </li>
              ))}
            </ol>
            {data.truncated && <p className="m-0 text-xs text-hm-text-secondary">{t("hotspots.truncated")}</p>}
          </div>
        </div>
      )}

      <p className="m-0 text-xs text-hm-text-secondary">{t("hotspots.legend")}</p>
    </Panel>
  );
}
