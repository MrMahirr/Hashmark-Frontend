"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Download, Loader2, RefreshCw, Search } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { DebtType, type Debt, type TriageStatus } from "@/shared/types/debt.types";
import { useBulkTriage, useExportDebts, useMappedDebts } from "../hooks/useDebts";
import type { DebtFilters, ExportFormat } from "../api/debts.types";
import { DebtDetailDialog } from "./DebtDetailDialog";
import { DebtTable, type SortDirection } from "./DebtTable";
import { LabelBadge } from "./LabelBadge";

const PAGE_SIZES = [20, 50, 100] as const;
const STATUSES = ["open", "resolved", "ignored", ""] as const;
type StatusFilter = (typeof STATUSES)[number];

interface DebtExplorerProps {
  /** Verilirse yalnızca bu deponun borçları gösterilir ve depo seçici gizlenir. */
  fixedRepoId?: string;
  fixedRepoName?: string;
  repos?: { id: string; name: string }[];
  selectedRepo?: string;
  onRepoChange?: (repoId: string) => void;
}

/**
 * Sunucu tarafında filtreleme/arama/sıralama/sayfalama yapan borç gezgini.
 * Hem "Tüm Borçlar" sayfası hem depo ayrıntı sayfası bunu kullanır.
 */
export function DebtExplorer({
  fixedRepoId,
  fixedRepoName = "",
  repos = [],
  selectedRepo = "",
  onRepoChange,
}: DebtExplorerProps) {
  const { t } = useI18n();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState<number>(20);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<StatusFilter>("open");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("detectedAt");
  const [dir, setDir] = useState<SortDirection>("desc");
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [detail, setDetail] = useState<Debt | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignee, setAssignee] = useState("");

  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const repoId = fixedRepoId ?? selectedRepo;

  const filters: DebtFilters = useMemo(
    () => ({
      repoId: repoId || undefined,
      label: label || undefined,
      status: status || undefined,
      q: debouncedSearch || undefined,
      sort,
      dir,
      page,
      size,
    }),
    [repoId, label, status, debouncedSearch, sort, dir, page, size]
  );

  const { data, isLoading, isFetching, isError, refetch } = useMappedDebts(filters, fixedRepoName);
  const bulk = useBulkTriage();
  const exporter = useExportDebts();

  const debts = useMemo(() => data?.content ?? [], [data]);
  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  // Filtre değişince ilk sayfaya dön ve seçimi temizle
  const resetView = () => {
    setPage(0);
    setSelectedIds(new Set());
  };

  const onSortChange = (key: string) => {
    if (key === sort) {
      setDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setDir(key === "detectedAt" ? "desc" : "asc");
    }
    resetView();
  };

  const toggleRow = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = (selectAll: boolean) => {
    setSelectedIds(selectAll ? new Set(debts.map((d) => d.id)) : new Set());
  };

  const runBulk = (payload: { status?: TriageStatus; assignee?: string }) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || bulk.isPending) return;
    bulk.mutate(
      { ids, payload },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
          setAssignOpen(false);
          setAssignee("");
        },
      }
    );
  };

  const from = debts.length > 0 ? page * size + 1 : 0;
  const to = Math.min((page + 1) * size, totalElements);

  // Ayrıntı paneli, listede güncellenen en son hâliyle gösterilir
  const detailDebt = detail ? (debts.find((d) => d.id === detail.id) ?? detail) : null;

  const chipBase =
    "h-8 px-3 rounded-md border-[0.5px] font-mono text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer";

  if (isError) {
    return (
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-8 flex flex-col items-center justify-center text-center gap-4 my-8">
        <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center text-hm-danger">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div role="alert">
          <h3 className="font-sans text-base font-medium text-hm-text-primary">{t("debts.errorTitle")}</h3>
          <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">{t("debts.errorDescription")}</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-hm-text-primary text-hm-surface rounded text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filtre çubuğu */}
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-xl p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {!fixedRepoId && (
            <label className="flex items-center">
              <span className="sr-only">{t("debts.filter.repo")}</span>
              <select
                value={selectedRepo}
                onChange={(event) => {
                  onRepoChange?.(event.target.value);
                  resetView();
                }}
                className="h-8 w-full sm:w-[170px] pl-3 pr-8 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-primary text-[12px] cursor-pointer"
              >
                <option value="">{t("debts.filter.allRepos")}</option>
                {repos.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div role="group" aria-label={t("debts.filter.label")} className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={!label}
              onClick={() => {
                setLabel("");
                resetView();
              }}
              className={`${chipBase} ${
                !label
                  ? "bg-hm-blue text-hm-on-blue border-hm-blue"
                  : "bg-hm-bg text-hm-text-secondary border-hm-border hover:bg-hm-border-light"
              }`}
            >
              {t("debts.filter.allLabels")}
            </button>
            {Object.values(DebtType).map((type) => {
              const selected = label === type;
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setLabel(selected ? "" : type);
                    resetView();
                  }}
                  className={`${chipBase} ${
                    selected ? "ring-1 ring-current" : "hover:bg-hm-border-light"
                  } bg-hm-bg border-hm-border`}
                >
                  <LabelBadge type={type} className={selected ? "" : "opacity-80"} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label={t("debts.filter.status")} className="flex bg-hm-bg rounded-md p-0.5 border-[0.5px] border-hm-border">
            {STATUSES.map((value) => {
              const key = value === "" ? "all" : value;
              const selected = status === value;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setStatus(value);
                    resetView();
                  }}
                  className={`px-3 py-1 rounded-sm text-[11px] font-medium transition-colors cursor-pointer ${
                    selected
                      ? "bg-hm-surface text-hm-text-primary shadow-sm"
                      : "text-hm-text-secondary hover:text-hm-text-primary"
                  }`}
                >
                  {t(`debts.status.${key}` as const)}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[260px]">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hm-text-secondary"
                size={16}
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetView();
                }}
                aria-label={t("debts.filter.search")}
                placeholder={t("debts.filter.searchPlaceholder")}
                className="w-full h-8 pl-8 pr-3 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-primary text-[12px] placeholder:text-hm-text-secondary/70"
              />
            </div>

            <details className="relative">
              <summary
                className="h-8 px-3 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-[12px] text-hm-text-primary flex items-center gap-1.5 cursor-pointer list-none select-none hover:bg-hm-bg"
                aria-label={t("debts.export")}
              >
                {exporter.isPending ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={14} aria-hidden="true" />
                )}
                {t("debts.export")}
              </summary>
              <div className="absolute right-0 z-20 mt-1 w-32 rounded-md border-[0.5px] border-hm-border bg-hm-surface p-1 shadow-lg">
                {(["csv", "json", "sarif"] as ExportFormat[]).map((format) => (
                  <button
                    key={format}
                    type="button"
                    disabled={exporter.isPending}
                    onClick={(event) => {
                      exporter.mutate({ filters, format });
                      (event.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
                    }}
                    className="w-full rounded px-2 py-1.5 text-left text-[12px] text-hm-text-primary hover:bg-hm-bg disabled:opacity-50"
                  >
                    {t(`debts.export.${format}` as const)}
                  </button>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Toplu işlem çubuğu */}
      {selectedIds.size > 0 && (
        <div
          role="region"
          aria-label={t("debts.selected", { count: selectedIds.size })}
          className="flex flex-wrap items-center gap-2 rounded-xl border-[0.5px] border-hm-blue/40 bg-hm-blue-light px-4 py-2 text-[12px]"
        >
          <span className="font-medium text-hm-text-primary" aria-live="polite">
            {t("debts.selected", { count: selectedIds.size })}
          </span>
          <button
            type="button"
            disabled={bulk.isPending}
            onClick={() => runBulk({ status: "IGNORED" })}
            className="rounded-md border-[0.5px] border-hm-border bg-hm-surface px-2.5 py-1 hover:bg-hm-bg disabled:opacity-50"
          >
            {t("debts.bulk.ignore")}
          </button>
          <button
            type="button"
            disabled={bulk.isPending}
            onClick={() => runBulk({ status: "WONT_FIX" })}
            className="rounded-md border-[0.5px] border-hm-border bg-hm-surface px-2.5 py-1 hover:bg-hm-bg disabled:opacity-50"
          >
            {t("debts.bulk.wontFix")}
          </button>
          <button
            type="button"
            disabled={bulk.isPending}
            onClick={() => runBulk({ status: "OPEN" })}
            className="rounded-md border-[0.5px] border-hm-border bg-hm-surface px-2.5 py-1 hover:bg-hm-bg disabled:opacity-50"
          >
            {t("debts.bulk.reopen")}
          </button>
          {assignOpen ? (
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (assignee.trim()) runBulk({ assignee: assignee.trim() });
              }}
            >
              <input
                autoFocus
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
                maxLength={100}
                aria-label={t("debts.bulk.assignPrompt")}
                placeholder={t("debts.detail.assigneePlaceholder")}
                className="h-7 w-40 rounded-md border-[0.5px] border-hm-border bg-hm-surface px-2 text-[12px]"
              />
              <button
                type="submit"
                disabled={bulk.isPending || !assignee.trim()}
                className="rounded-md bg-hm-blue px-2.5 py-1 text-hm-text-inverse disabled:opacity-50"
              >
                {t("common.save")}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="rounded-md border-[0.5px] border-hm-border bg-hm-surface px-2.5 py-1 hover:bg-hm-bg"
            >
              {t("debts.bulk.assign")}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedIds(new Set());
              setAssignOpen(false);
            }}
            className="ml-auto text-hm-text-secondary underline underline-offset-2 hover:text-hm-text-primary"
          >
            {t("debts.clearSelection")}
          </button>
        </div>
      )}

      {/* Tablo */}
      <div
        className="bg-hm-surface border-[0.5px] border-hm-border rounded-xl overflow-hidden relative min-h-[240px]"
        aria-busy={isFetching}
      >
        {isLoading ? (
          <div role="status" className="flex items-center justify-center gap-2 py-16 text-xs text-hm-text-secondary">
            <Loader2 size={16} className="animate-spin text-hm-blue" aria-hidden="true" />
            {t("common.loading")}
          </div>
        ) : (
          <>
            {isFetching && (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-hm-blue/60 animate-pulse" aria-hidden="true" />
            )}
            <DebtTable
              debts={debts}
              showRepoColumn={!fixedRepoId}
              sort={sort}
              dir={dir}
              onSortChange={onSortChange}
              selectedIds={selectedIds}
              onToggleRow={toggleRow}
              onTogglePage={togglePage}
              onOpenDetails={setDetail}
              emptyMessage={fixedRepoId ? t("debts.emptyRepo") : t("debts.empty")}
            />
          </>
        )}

        {/* Sayfalama */}
        <div className="px-4 py-3 border-t-[0.5px] border-hm-border flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px] text-hm-text-secondary" aria-live="polite">
            {t("debts.pagination.range", { total: totalElements, from, to })}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-[12px] text-hm-text-secondary">
              {t("debts.pagination.size")}
              <select
                value={size}
                onChange={(event) => {
                  setSize(Number(event.target.value));
                  resetView();
                }}
                className="h-7 rounded-md border-[0.5px] border-hm-border bg-hm-surface px-1.5 text-[12px] text-hm-text-primary"
              >
                {PAGE_SIZES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setPage((p) => Math.max(0, p - 1));
                setSelectedIds(new Set());
              }}
              disabled={page <= 0 || isFetching}
              className="px-3 py-1.5 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("debts.pagination.prev")}
            </button>
            <span className="text-[12px] text-hm-text-secondary px-1">
              {t("debts.pagination.page", { page: page + 1, pages: totalPages })}
            </span>
            <button
              type="button"
              onClick={() => {
                setPage((p) => p + 1);
                setSelectedIds(new Set());
              }}
              disabled={page >= totalPages - 1 || isFetching}
              className="px-3 py-1.5 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("debts.pagination.next")}
            </button>
          </div>
        </div>
      </div>

      <DebtDetailDialog debt={detailDebt} onClose={() => setDetail(null)} />
    </div>
  );
}
