"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { type Debt, type TriageRequestStatus } from "@/shared/types/debt.types";
import { Panel } from "@/shared/ui/Panel";
import { ErrorState } from "@/shared/ui/StateViews";
import { useBulkTriage, useCreateDebtIssues, useDebtAuthors, useExportDebts, useMappedDebts } from "../hooks/useDebts";
import type { DebtFilters } from "../api/debts.types";
import type { DebtLinkFilters } from "../utils/debt-links";
import { DebtBulkBar } from "./DebtBulkBar";
import { DebtDetailDialog } from "./DebtDetailDialog";
import { DebtFilterBar, type DebtStatusFilter, type RepoOption } from "./DebtFilterBar";
import { DebtPagination } from "./DebtPagination";
import { DebtTable, type SortDirection } from "./DebtTable";

interface DebtExplorerProps {
  /** Verilirse yalnızca bu deponun borçları gösterilir ve depo seçici gizlenir. */
  fixedRepoId?: string;
  fixedRepoName?: string;
  repos?: RepoOption[];
  selectedRepo?: string;
  onRepoChange?: (repoId: string) => void;
  /** Etiket çiplerinde gösterilecek sayılar (ör. istatistik ucundan). */
  labelCounts?: Partial<Record<string, number>>;
  /** Başlangıç süzgeçleri (içgörü bağlantıları); depo seçimi `selectedRepo` ile gelir. */
  initialFilters?: DebtLinkFilters;
}

/**
 * Sunucu tarafında filtreleme/arama/sıralama/sayfalama yapan borç gezgini.
 * Hem "Tüm Borçlar" sayfası hem depo ayrıntı sayfası bunu kullanır.
 * Parçalar: `DebtFilterBar`, `DebtBulkBar`, `DebtTable`, `DebtPagination`, `DebtDetailDialog`.
 */
export function DebtExplorer({
  fixedRepoId,
  fixedRepoName = "",
  repos = [],
  selectedRepo = "",
  onRepoChange,
  labelCounts,
  initialFilters = {},
}: DebtExplorerProps) {
  const { t } = useI18n();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState<number>(20);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<DebtStatusFilter>("open");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("detectedAt");
  const [dir, setDir] = useState<SortDirection>("desc");
  const [groupByRepo, setGroupByRepo] = useState(false);
  const [author, setAuthor] = useState("");
  const [olderThanDays, setOlderThanDays] = useState(initialFilters.olderThanDays ?? 0);
  const [priority, setPriority] = useState<string>(initialFilters.priority ?? "");
  const [secretOnly, setSecretOnly] = useState(initialFilters.secret ?? false);
  const [debtOnly, setDebtOnly] = useState(initialFilters.debtOnly ?? false);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [detail, setDetail] = useState<Debt | null>(null);

  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const repoId = fixedRepoId ?? selectedRepo;

  const filters: DebtFilters = useMemo(
    () => ({
      repoId: repoId || undefined,
      label: label || undefined,
      status: status || undefined,
      q: debouncedSearch || undefined,
      author: author || undefined,
      olderThanDays: olderThanDays || undefined,
      priority: priority || undefined,
      secret: secretOnly || undefined,
      debtOnly: debtOnly || undefined,
      sort,
      dir,
      page,
      size,
    }),
    [repoId, label, status, debouncedSearch, author, olderThanDays, priority, secretOnly, debtOnly, sort, dir, page, size]
  );

  const { data, isLoading, isFetching, isError, refetch } = useMappedDebts(filters, fixedRepoName);
  const bulk = useBulkTriage();
  const bulkIssues = useCreateDebtIssues();
  const exporter = useExportDebts();
  const authors = useDebtAuthors(repoId || undefined);

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

  const runBulk = (payload: { status?: TriageRequestStatus; assignee?: string }) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || bulk.isPending) return;
    bulk.mutate({ ids, payload }, { onSuccess: () => setSelectedIds(new Set()) });
  };

  const from = debts.length > 0 ? page * size + 1 : 0;
  const to = Math.min((page + 1) * size, totalElements);

  // Ayrıntı paneli, listede güncellenen en son hâliyle gösterilir
  const detailDebt = detail ? (debts.find((d) => d.id === detail.id) ?? detail) : null;

  if (isError) {
    return (
      <ErrorState
        title={t("debts.errorTitle")}
        description={t("debts.errorDescription")}
        retryLabel={t("common.retry")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <DebtFilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetView();
        }}
        showRepoFilter={!fixedRepoId}
        repos={repos}
        selectedRepo={selectedRepo}
        onRepoChange={(id) => {
          onRepoChange?.(id);
          resetView();
        }}
        groupByRepo={groupByRepo}
        onGroupByRepoChange={setGroupByRepo}
        label={label}
        onLabelChange={(value) => {
          setLabel(value);
          resetView();
        }}
        labelCounts={labelCounts}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          resetView();
        }}
        exportPending={exporter.isPending}
        onExport={(format) => exporter.mutate({ filters, format })}
        authors={authors.data ?? []}
        author={author}
        onAuthorChange={(value) => {
          setAuthor(value);
          resetView();
        }}
        olderThanDays={olderThanDays}
        onOlderThanDaysChange={(value) => {
          setOlderThanDays(value);
          resetView();
        }}
        priority={priority}
        onPriorityChange={(value) => {
          setPriority(value);
          resetView();
        }}
        secretOnly={secretOnly}
        onSecretOnlyChange={(value) => {
          setSecretOnly(value);
          resetView();
        }}
        debtOnly={debtOnly}
        onDebtOnlyChange={(value) => {
          setDebtOnly(value);
          resetView();
        }}
      />

      {selectedIds.size > 0 && (
        <DebtBulkBar
          count={selectedIds.size}
          pending={bulk.isPending || bulkIssues.isPending}
          onApply={runBulk}
          onClear={() => setSelectedIds(new Set())}
          onCreateIssues={() =>
            bulkIssues.mutate(Array.from(selectedIds), { onSuccess: () => setSelectedIds(new Set()) })
          }
          issuesPending={bulkIssues.isPending}
        />
      )}

      <Panel className="relative min-h-[240px] overflow-hidden" aria-busy={isFetching}>
        {isLoading ? (
          <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-hm-text-secondary">
            <Loader2 size={16} className="animate-spin text-hm-acc" aria-hidden="true" />
            {t("common.loading")}
          </div>
        ) : (
          <>
            {isFetching && (
              <div className="absolute inset-x-0 top-0 h-0.5 animate-pulse bg-hm-acc" aria-hidden="true" />
            )}
            <DebtTable
              debts={debts}
              showRepoColumn={!fixedRepoId}
              groupByRepo={groupByRepo && !fixedRepoId}
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

        <DebtPagination
          page={page}
          size={size}
          totalElements={totalElements}
          totalPages={totalPages}
          from={from}
          to={to}
          busy={isFetching}
          onPrev={() => {
            setPage((p) => Math.max(0, p - 1));
            setSelectedIds(new Set());
          }}
          onNext={() => {
            setPage((p) => p + 1);
            setSelectedIds(new Set());
          }}
          onSizeChange={(value) => {
            setSize(value);
            resetView();
          }}
        />
      </Panel>

      <DebtDetailDialog debt={detailDebt} onClose={() => setDetail(null)} />
    </div>
  );
}
