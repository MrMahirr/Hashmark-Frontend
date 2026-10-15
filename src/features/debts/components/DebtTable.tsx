"use client";

import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Eye, GitPullRequestArrow } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import type { MessageKey } from "@/shared/i18n";
import { DebtStatus, type Debt } from "@/shared/types/debt.types";
import { buildIssueUrl } from "../utils/issue-url";
import { LabelBadge } from "./LabelBadge";

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
  sort: string;
  dir: SortDirection;
  onSortChange: (sortKey: string) => void;
  selectedIds: ReadonlySet<string>;
  onToggleRow: (id: string) => void;
  onTogglePage: (selectAll: boolean) => void;
  onOpenDetails: (debt: Debt) => void;
  emptyMessage: string;
}

function StatusChip({ debt }: { debt: Debt }) {
  const { t } = useI18n();
  if (debt.status === DebtStatus.RESOLVED) {
    return (
      <span className="ml-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] bg-hm-success-bg text-hm-success">
        {t("debts.status.resolved")}
      </span>
    );
  }
  if (debt.triageStatus !== "OPEN") {
    return (
      <span className="ml-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] bg-hm-bg text-hm-text-secondary border-[0.5px] border-hm-border">
        {t(`debts.triage.${debt.triageStatus}` as const)}
      </span>
    );
  }
  return null;
}

function FileLink({ debt }: { debt: Debt }) {
  const text = `${debt.filePath}:${debt.lineNumber}`;
  if (!debt.permalink) {
    return <span className="font-mono text-[11px] text-hm-text-secondary truncate block" title={text}>{text}</span>;
  }
  return (
    <a
      href={debt.permalink}
      target="_blank"
      rel="noopener noreferrer"
      title={text}
      className="font-mono text-[11px] text-hm-text-secondary hover:text-hm-blue hover:underline truncate block"
    >
      {text}
    </a>
  );
}

export function DebtTable({
  debts,
  showRepoColumn,
  sort,
  dir,
  onSortChange,
  selectedIds,
  onToggleRow,
  onTogglePage,
  onOpenDetails,
  emptyMessage,
}: DebtTableProps) {
  const { t, formatDate } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const selectedOnPage = debts.filter((d) => selectedIds.has(d.id)).length;
  const allSelected = debts.length > 0 && selectedOnPage === debts.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedOnPage > 0 && !allSelected;
    }
  }, [selectedOnPage, allSelected]);

  const virtualize = debts.length > VIRTUALIZE_THRESHOLD;
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
        className="font-sans text-[11px] text-hm-text-secondary font-medium py-2 px-4 bg-hm-bg border-b-[0.5px] border-hm-border whitespace-nowrap"
      >
        <button
          type="button"
          onClick={() => onSortChange(column.key)}
          aria-label={t("debts.sortBy", { column: label })}
          className="inline-flex items-center gap-1 hover:text-hm-text-primary"
        >
          {label}
          <Icon size={12} aria-hidden="true" />
        </button>
      </th>
    );
  };

  const plainHeader = (key: MessageKey, className = "") => (
    <th
      scope="col"
      className={`font-sans text-[11px] text-hm-text-secondary font-medium py-2 px-4 bg-hm-bg border-b-[0.5px] border-hm-border whitespace-nowrap ${className}`}
    >
      {t(key)}
    </th>
  );

  if (debts.length === 0) {
    return (
      <div className="py-12 px-4 text-center text-hm-text-secondary font-sans text-xs">{emptyMessage}</div>
    );
  }

  return (
    <>
      {/* Masaüstü: tablo */}
      <div
        ref={scrollRef}
        className={`hidden md:block overflow-auto ${virtualize ? "max-h-[640px]" : ""}`}
        data-testid="debt-table-scroll"
      >
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead className="sticky top-0 z-10">
            <tr>
              <th scope="col" className="w-10 py-2 px-4 bg-hm-bg border-b-[0.5px] border-hm-border">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => onTogglePage(event.target.checked)}
                  aria-label={t("debts.selectAllPage")}
                  className="cursor-pointer"
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
          <tbody className="font-sans text-hm-text-primary bg-hm-surface">
            {paddingTop > 0 && (
              <tr aria-hidden="true" style={{ height: paddingTop }}>
                <td colSpan={columnCount} />
              </tr>
            )}
            {rows.map((debt) => {
              const issueUrl = buildIssueUrl(debt, t);
              const owner = debt.assignee ?? debt.authorLogin ?? debt.authorName;
              return (
                <tr
                  key={debt.id}
                  style={{ height: ROW_HEIGHT }}
                  className="hover:bg-hm-bg/50 transition-colors border-b-[0.5px] border-hm-border"
                  aria-selected={selectedIds.has(debt.id)}
                >
                  <td className="px-4 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(debt.id)}
                      onChange={() => onToggleRow(debt.id)}
                      aria-label={t("debts.selectRow", { file: debt.filePath, line: debt.lineNumber })}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 align-middle whitespace-nowrap">
                    <LabelBadge type={debt.type} />
                    <StatusChip debt={debt} />
                  </td>
                  {showRepoColumn && (
                    <td className="px-4 align-middle">
                      <span className="text-[13px] truncate block max-w-[160px]" title={debt.repoName}>
                        {debt.repoName}
                      </span>
                    </td>
                  )}
                  <td className="px-4 align-middle max-w-[240px]">
                    <FileLink debt={debt} />
                  </td>
                  <td className="px-4 align-middle max-w-[320px]">
                    <span className="font-mono text-[12px] truncate block" title={debt.message}>
                      {debt.message}
                    </span>
                  </td>
                  <td className="px-4 align-middle">
                    <span className="text-[12px] text-hm-text-secondary truncate block max-w-[120px]">
                      {owner ?? t("common.dash")}
                    </span>
                  </td>
                  <td className="px-4 align-middle whitespace-nowrap">
                    <span className="text-[12px] text-hm-text-secondary">{formatDate(debt.createdAt)}</span>
                  </td>
                  <td className="px-4 align-middle">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenDetails(debt)}
                        aria-label={`${t("debts.detail.open")}: ${debt.filePath}:${debt.lineNumber}`}
                        title={t("debts.detail.open")}
                        className="p-1.5 rounded text-hm-text-secondary hover:text-hm-blue hover:bg-hm-bg"
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
                          className="p-1.5 rounded text-hm-text-secondary hover:text-hm-blue hover:bg-hm-bg"
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
                          className="p-1.5 rounded text-hm-text-secondary hover:text-hm-blue hover:bg-hm-bg"
                        >
                          <GitPullRequestArrow size={16} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr aria-hidden="true" style={{ height: paddingBottom }}>
                <td colSpan={columnCount} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobil: kart listesi */}
      <ul className="md:hidden divide-y-[0.5px] divide-hm-border">
        {debts.map((debt) => {
          const owner = debt.assignee ?? debt.authorLogin ?? debt.authorName;
          return (
            <li key={debt.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center">
                  <label className="mr-3 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(debt.id)}
                      onChange={() => onToggleRow(debt.id)}
                      aria-label={t("debts.selectRow", { file: debt.filePath, line: debt.lineNumber })}
                    />
                  </label>
                  <LabelBadge type={debt.type} />
                  <StatusChip debt={debt} />
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDetails(debt)}
                  aria-label={`${t("debts.detail.open")}: ${debt.filePath}:${debt.lineNumber}`}
                  className="p-1.5 rounded text-hm-text-secondary hover:text-hm-blue"
                >
                  <Eye size={18} aria-hidden="true" />
                </button>
              </div>
              <p className="font-mono text-[12px] break-words">{debt.message}</p>
              <FileLink debt={debt} />
              <p className="text-[11px] text-hm-text-secondary">
                {owner ?? t("common.dash")} · {formatDate(debt.createdAt)}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
