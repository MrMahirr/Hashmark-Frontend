"use client";

import { Fragment, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Eye, GitPullRequestArrow, ShieldAlert } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import type { MessageKey } from "@/shared/i18n";
import { DebtStatus, type Debt } from "@/shared/types/debt.types";
import { TagBadge } from "@/shared/ui/TagBadge";
import { cn } from "@/shared/ui/cn";
import { buildIssueUrl } from "../utils/issue-url";
import { STALE_DAYS, debtAgeDays } from "../utils/debt-age";

/** Bu sayıdan fazla satır varsa yalnızca görünür satırlar DOM'a basılır. */
export const VIRTUALIZE_THRESHOLD = 40;
const ROW_HEIGHT = 56;

export type SortDirection = "asc" | "desc";

interface SortableColumn {
  key: string;
  labelKey: MessageKey;
}

const SORTABLE: Record<string, SortableColumn> = {
  label: { key: "label", labelKey: "debts.col.label" },
  filePath: { key: "filePath", labelKey: "debts.col.file" },
  detectedAt: { key: "detectedAt", labelKey: "debts.col.detected" },
};

interface DebtTableProps {
  debts: Debt[];
  showRepoColumn: boolean;
  /** Satırları depoya göre gruplar (yalnızca yüklü sayfa; sanallaştırma kapanır). */
  groupByRepo?: boolean;
  sort: string;
  dir: SortDirection;
  onSortChange: (sortKey: string) => void;
  selectedIds: ReadonlySet<string>;
  onToggleRow: (id: string) => void;
  onTogglePage: (selectAll: boolean) => void;
  onOpenDetails: (debt: Debt) => void;
  emptyMessage: string;
}

const HEAD_CELL =
  "whitespace-nowrap bg-[color-mix(in_srgb,var(--hm-text-primary)_4%,transparent)] px-4 py-3 text-left font-mono text-xs font-normal uppercase tracking-[0.06em] text-hm-text-secondary";
const ROW_ICON =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-hm-text-secondary hover:bg-[color-mix(in_srgb,var(--hm-text-primary)_8%,transparent)] hover:text-hm-acc";

function StatusChip({ debt }: { debt: Debt }) {
  const { t } = useI18n();
  if (debt.status === DebtStatus.RESOLVED) {
    return (
      <span className="ml-1.5 inline-block rounded-[6px] border border-hm-success bg-hm-success-bg px-1.5 py-px font-mono text-[11px] font-bold text-hm-success">
        {t("debts.status.resolved")}
      </span>
    );
  }
  if (debt.triageStatus !== "OPEN") {
    return (
      <span className="ml-1.5 inline-block rounded-[6px] border border-hm-border px-1.5 py-px font-mono text-[11px] font-bold text-hm-text-secondary">
        {t(`debts.triage.${debt.triageStatus}` as const)}
      </span>
    );
  }
  return null;
}

const URGENT_PRIORITIES = new Set(["CRITICAL", "HIGH"]);

/** Açık borçta sızan sır ve kritik/yüksek öncelik işaretleri. */
function InsightChips({ debt }: { debt: Debt }) {
  const { t } = useI18n();
  if (debt.status === DebtStatus.RESOLVED) return null;
  return (
    <>
      {debt.secretDetected && (
        <span
          title={t("debts.secret.hint")}
          className="ml-1.5 inline-flex items-center gap-1 rounded-[6px] border border-hm-danger bg-hm-danger-bg px-1.5 py-px align-middle font-mono text-[11px] font-bold text-hm-danger"
        >
          <ShieldAlert size={12} aria-hidden="true" />
          {t("debts.secret.label")}
        </span>
      )}
      {debt.priority && URGENT_PRIORITIES.has(debt.priority) && (
        <span
          title={debt.priorityAuto ? t("debts.priority.autoHint") : undefined}
          className="ml-1.5 inline-block rounded-[6px] border border-hm-warning bg-hm-warning-bg px-1.5 py-px font-mono text-[11px] font-bold text-hm-warning"
        >
          {t(`debts.priority.${debt.priority}` as const)}
          {debt.priorityAuto && <span className="sr-only"> ({t("debts.priority.auto")})</span>}
        </span>
      )}
    </>
  );
}

/** Tarih; 90+ gündür açık borçta "çürüyen" işareti. */
function DebtDate({ debt }: { debt: Debt }) {
  const { t, formatDate } = useI18n();
  const age = debt.status === DebtStatus.ACTIVE ? debtAgeDays(debt) : null;
  return (
    <>
      <span className="font-mono text-[13px] text-hm-text-secondary">{formatDate(debt.createdAt)}</span>
      {age !== null && age >= STALE_DAYS && (
        <span
          title={t("debts.stale.hint", { days: age })}
          className="ml-2 inline-block rounded-[6px] border border-hm-danger px-1.5 py-px font-mono text-[11px] font-bold text-hm-danger"
        >
          {t("debts.stale.label", { days: age })}
        </span>
      )}
    </>
  );
}

function FileLink({ debt }: { debt: Debt }) {
  const text = `${debt.filePath}:${debt.lineNumber}`;
  if (!debt.permalink) {
    return (
      <span className="block truncate font-mono text-[13px] text-hm-text-secondary" title={text}>
        {text}
      </span>
    );
  }
  return (
    <a
      href={debt.permalink}
      target="_blank"
      rel="noopener noreferrer"
      title={text}
      className="block truncate font-mono text-[13px] text-hm-text-secondary hover:text-hm-acc hover:underline"
    >
      {text}
    </a>
  );
}

/** Aynı depoya ait satırları, ilk görülme sırasını koruyarak bitişik hâle getirir. */
function groupDebts(debts: Debt[]): Array<{ repoName: string; items: Debt[] }> {
  const groups = new Map<string, Debt[]>();
  for (const debt of debts) {
    const list = groups.get(debt.repoName) ?? [];
    list.push(debt);
    groups.set(debt.repoName, list);
  }
  return Array.from(groups, ([repoName, items]) => ({ repoName, items }));
}

export function DebtTable({
  debts,
  showRepoColumn,
  groupByRepo = false,
  sort,
  dir,
  onSortChange,
  selectedIds,
  onToggleRow,
  onTogglePage,
  onOpenDetails,
  emptyMessage,
}: DebtTableProps) {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const selectedOnPage = debts.filter((d) => selectedIds.has(d.id)).length;
  const allSelected = debts.length > 0 && selectedOnPage === debts.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedOnPage > 0 && !allSelected;
    }
  }, [selectedOnPage, allSelected]);

  const virtualize = !groupByRepo && debts.length > VIRTUALIZE_THRESHOLD;
  const virtualizer = useVirtualizer({
    count: virtualize ? debts.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    initialRect: { width: 1000, height: 600 },
  });

  const virtualItems = virtualize ? virtualizer.getVirtualItems() : null;
  const rows = virtualItems ? virtualItems.map((item) => debts[item.index]).filter(Boolean) : debts;
  const paddingTop = virtualItems && virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems && virtualItems.length > 0
      ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
      : 0;

  const columnCount = 7 + (showRepoColumn ? 1 : 0);

  const sortHeader = (column: SortableColumn) => {
    const active = sort === column.key;
    const label = t(column.labelKey);
    const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
    return (
      <th
        scope="col"
        aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
        className={HEAD_CELL}
      >
        <button
          type="button"
          onClick={() => onSortChange(column.key)}
          aria-label={t("debts.sortBy", { column: label })}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center gap-1 font-mono text-xs uppercase tracking-[0.06em] hover:text-hm-text-primary",
            active && "text-hm-text-primary",
          )}
        >
          {label}
          <Icon size={12} aria-hidden="true" />
        </button>
      </th>
    );
  };

  const plainHeader = (key: MessageKey, className = "") => (
    <th scope="col" className={cn(HEAD_CELL, className)}>
      {t(key)}
    </th>
  );

  if (debts.length === 0) {
    return <div className="px-6 py-10 text-center text-sm text-hm-text-secondary">{emptyMessage}</div>;
  }

  const renderRow = (debt: Debt) => {
    const issueUrl = buildIssueUrl(debt, t);
    const owner = debt.assignee ?? debt.authorLogin ?? debt.authorName;
    return (
      <tr
        key={debt.id}
        style={{ height: ROW_HEIGHT }}
        className="border-t border-hm-border hover:bg-[color-mix(in_srgb,var(--hm-text-primary)_6%,transparent)]"
        aria-selected={selectedIds.has(debt.id)}
      >
        <td className="px-4 align-middle">
          <input
            type="checkbox"
            checked={selectedIds.has(debt.id)}
            onChange={() => onToggleRow(debt.id)}
            aria-label={t("debts.selectRow", { file: debt.filePath, line: debt.lineNumber })}
            className="h-[18px] w-[18px] cursor-pointer accent-[var(--hm-acc)]"
          />
        </td>
        <td className="whitespace-nowrap px-4 align-middle">
          <TagBadge tag={debt.type} />
          <StatusChip debt={debt} />
          <InsightChips debt={debt} />
        </td>
        {showRepoColumn && (
          <td className="px-4 align-middle">
            <span className="block max-w-[160px] truncate font-mono text-[13px]" title={debt.repoName}>
              {debt.repoName}
            </span>
          </td>
        )}
        <td className="max-w-[240px] px-4 align-middle">
          <FileLink debt={debt} />
        </td>
        <td className="max-w-[320px] px-4 align-middle">
          <span className="block truncate text-[15px]" title={debt.message}>
            {debt.message}
          </span>
        </td>
        <td className="px-4 align-middle">
          <span className="block max-w-[120px] truncate text-[13px] text-hm-text-secondary">
            {owner ?? t("common.dash")}
          </span>
        </td>
        <td className="whitespace-nowrap px-4 align-middle">
          <DebtDate debt={debt} />
        </td>
        <td className="px-2 align-middle">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => onOpenDetails(debt)}
              aria-label={`${t("debts.detail.open")}: ${debt.filePath}:${debt.lineNumber}`}
              title={t("debts.detail.open")}
              className={ROW_ICON}
            >
              <Eye size={16} aria-hidden="true" />
            </button>
            {debt.permalink && (
              <a
                href={debt.permalink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("debts.detail.github")}: ${debt.filePath}:${debt.lineNumber}`}
                title={t("debts.detail.github")}
                className={ROW_ICON}
              >
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
            {issueUrl && (
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("debts.detail.createIssue")}: ${debt.filePath}:${debt.lineNumber}`}
                title={t("debts.detail.createIssue")}
                className={ROW_ICON}
              >
                <GitPullRequestArrow size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      {/* Masaüstü: tablo */}
      <div
        ref={scrollRef}
        className={cn("hidden overflow-auto md:block", virtualize && "max-h-[640px]")}
        data-testid="debt-table-scroll"
      >
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-hm-surface">
            <tr>
              <th scope="col" className={cn(HEAD_CELL, "w-10")}>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => onTogglePage(event.target.checked)}
                  aria-label={t("debts.selectAllPage")}
                  className="h-[18px] w-[18px] cursor-pointer accent-[var(--hm-acc)]"
                />
              </th>
              {sortHeader(SORTABLE.label)}
              {showRepoColumn && plainHeader("debts.col.repo")}
              {sortHeader(SORTABLE.filePath)}
              {plainHeader("debts.col.content")}
              {plainHeader("debts.col.owner")}
              {sortHeader(SORTABLE.detectedAt)}
              {plainHeader("debts.col.actions", "text-right")}
            </tr>
          </thead>
          <tbody className="text-hm-text-primary">
            {paddingTop > 0 && (
              <tr aria-hidden="true" style={{ height: paddingTop }}>
                <td colSpan={columnCount} />
              </tr>
            )}
            {groupByRepo
              ? groupDebts(rows).map((group) => (
                  <Fragment key={group.repoName}>
                    <tr className="border-t border-hm-border bg-[color-mix(in_srgb,var(--hm-text-primary)_6%,transparent)]">
                      <th scope="colgroup" colSpan={columnCount} className="px-6 py-3 text-left font-normal">
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-mono text-sm font-bold">{group.repoName}</span>
                          <span className="font-mono text-xs text-hm-text-secondary">
                            {t("debts.group.count", { count: group.items.length })}
                          </span>
                        </span>
                      </th>
                    </tr>
                    {group.items.map(renderRow)}
                  </Fragment>
                ))
              : rows.map(renderRow)}
            {paddingBottom > 0 && (
              <tr aria-hidden="true" style={{ height: paddingBottom }}>
                <td colSpan={columnCount} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobil: kart listesi */}
      <ul className="m-0 list-none p-0 md:hidden">
        {debts.map((debt) => {
          const owner = debt.assignee ?? debt.authorLogin ?? debt.authorName;
          return (
            <li key={debt.id} className="flex flex-col gap-2 border-t border-hm-border p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center">
                  <label className="mr-3 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(debt.id)}
                      onChange={() => onToggleRow(debt.id)}
                      aria-label={t("debts.selectRow", { file: debt.filePath, line: debt.lineNumber })}
                      className="h-[18px] w-[18px] accent-[var(--hm-acc)]"
                    />
                  </label>
                  <TagBadge tag={debt.type} />
                  <StatusChip debt={debt} />
                  <InsightChips debt={debt} />
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDetails(debt)}
                  aria-label={`${t("debts.detail.open")}: ${debt.filePath}:${debt.lineNumber}`}
                  className={ROW_ICON}
                >
                  <Eye size={18} aria-hidden="true" />
                </button>
              </div>
              <p className="m-0 break-words text-[15px]">{debt.message}</p>
              <FileLink debt={debt} />
              <p className="m-0 font-mono text-xs text-hm-text-secondary">
                {owner ?? t("common.dash")} · <DebtDate debt={debt} />
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
