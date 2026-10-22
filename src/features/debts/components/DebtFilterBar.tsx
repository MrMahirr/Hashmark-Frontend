"use client";

import { Download, Loader2, Search, ShieldAlert } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { DebtType } from "@/shared/types/debt.types";
import { Chip, ChipGroup } from "@/shared/ui/Chip";
import { Field } from "@/shared/ui/Field";
import { tagColor } from "@/shared/ui/TagBadge";
import { cn } from "@/shared/ui/cn";
import type { ExportFormat } from "../api/debts.types";

export const DEBT_STATUSES = ["open", "resolved", "ignored", ""] as const;
export type DebtStatusFilter = (typeof DEBT_STATUSES)[number];

/** Bu sayıdan fazla depo varsa çipler yerine açılır liste kullanılır. */
const MAX_REPO_CHIPS = 8;

export interface RepoOption {
  id: string;
  name: string;
  /** Depo başına açık borç sayısı (varsa çipte gösterilir). */
  debtCount?: number;
}

interface DebtFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;

  /** Sabit depo verildiğinde depo süzgeci gizlenir. */
  showRepoFilter: boolean;
  repos: ReadonlyArray<RepoOption>;
  selectedRepo: string;
  onRepoChange: (repoId: string) => void;

  groupByRepo: boolean;
  onGroupByRepoChange: (value: boolean) => void;

  label: string;
  onLabelChange: (label: string) => void;
  labelCounts?: Partial<Record<string, number>>;

  status: DebtStatusFilter;
  onStatusChange: (status: DebtStatusFilter) => void;

  exportPending: boolean;
  onExport: (format: ExportFormat) => void;

  /** git blame yazarları; boşsa yazar süzgeci gizlenir. */
  authors?: ReadonlyArray<string>;
  author?: string;
  onAuthorChange?: (author: string) => void;
  /** 0 = her yaş */
  olderThanDays?: number;
  onOlderThanDaysChange?: (days: number) => void;
  /** "" = her öncelik */
  priority?: string;
  onPriorityChange?: (priority: string) => void;
  /** Yalnızca yorumunda sır bulunanlar */
  secretOnly?: boolean;
  onSecretOnlyChange?: (value: boolean) => void;
  /** NOTE/DOC/INFO hariç */
  debtOnly?: boolean;
  onDebtOnlyChange?: (value: boolean) => void;
}

/** Yaş süzgeci seçenekleri (gün); 0 = her yaş. 90+ gün "çürüyen" borçlardır. */
export const AGE_OPTIONS: readonly number[] = [0, 30, 90, 180, 365];

export const PRIORITY_OPTIONS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

const SELECT =
  "min-h-11 cursor-pointer rounded-pill border border-hm-border bg-hm-bg px-4 font-mono text-[13px] font-bold text-hm-text-primary";

function CountSuffix({ value }: { value?: number }) {
  if (value === undefined) return null;
  return (
    <>
      {" "}
      <span className="sr-only">({value})</span>
      <span aria-hidden="true" className="font-medium opacity-70">
        {value}
      </span>
    </>
  );
}

/** Arama alanı, depo/etiket/durum çipleri, gruplama anahtarı ve dışa aktarma menüsü. */
export function DebtFilterBar(props: DebtFilterBarProps) {
  const { t } = useI18n();
  const {
    search,
    onSearchChange,
    showRepoFilter,
    repos,
    selectedRepo,
    onRepoChange,
    groupByRepo,
    onGroupByRepoChange,
    label,
    onLabelChange,
    labelCounts,
    status,
    onStatusChange,
    exportPending,
    onExport,
    authors = [],
    author = "",
    onAuthorChange,
    olderThanDays = 0,
    onOlderThanDaysChange,
    priority = "",
    onPriorityChange,
    secretOnly = false,
    onSecretOnlyChange,
    debtOnly = false,
    onDebtOnlyChange,
  } = props;

  // URL'den gelen, listede olmayan yaş da seçili görünsün
  const ageOptions = AGE_OPTIONS.includes(olderThanDays) ? AGE_OPTIONS : [...AGE_OPTIONS, olderThanDays];

  const useRepoChips = repos.length <= MAX_REPO_CHIPS;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-[240px] max-w-[560px] flex-1">
          <Field
            type="search"
            aria-label={t("debts.filter.search")}
            placeholder={t("debts.filter.searchPlaceholder")}
            icon={<Search size={18} />}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <details className="relative">
          <summary
            aria-label={t("debts.export")}
            className="inline-flex min-h-12 cursor-pointer list-none select-none items-center gap-2 rounded-control border border-hm-border px-[18px] text-sm font-semibold text-hm-text-primary hover:border-hm-text-primary"
          >
            {exportPending ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Download size={16} aria-hidden="true" />
            )}
            {t("debts.export")}
          </summary>
          <div className="absolute right-0 z-20 mt-1.5 flex w-36 flex-col rounded-[14px] border border-hm-border bg-hm-surface p-2 shadow-[6px_6px_0_var(--hm-border)]">
            {(["csv", "json", "sarif"] as ExportFormat[]).map((format) => (
              <button
                key={format}
                type="button"
                disabled={exportPending}
                onClick={(event) => {
                  onExport(format);
                  (event.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
                }}
                className="min-h-11 w-full cursor-pointer rounded-[10px] px-3.5 text-left text-sm font-semibold text-hm-text-primary hover:bg-[color-mix(in_srgb,var(--hm-text-primary)_8%,transparent)] disabled:opacity-50"
              >
                {t(`debts.export.${format}` as const)}
              </button>
            ))}
          </div>
        </details>
      </div>

      {showRepoFilter && (
        <div className="flex flex-wrap items-center gap-2.5">
          {useRepoChips ? (
            <ChipGroup aria-label={t("debts.filter.repo")} className="gap-2.5">
              <Chip pressed={!selectedRepo} onClick={() => onRepoChange("")}>
                {t("debts.filter.allRepos")}
              </Chip>
              {repos.map((repo) => (
                <Chip key={repo.id} pressed={selectedRepo === repo.id} onClick={() => onRepoChange(repo.id)}>
                  {repo.name}
                  <CountSuffix value={repo.debtCount} />
                </Chip>
              ))}
            </ChipGroup>
          ) : (
            <label className="flex items-center">
              <span className="sr-only">{t("debts.filter.repo")}</span>
              <select
                value={selectedRepo}
                onChange={(event) => onRepoChange(event.target.value)}
                className="min-h-11 w-full cursor-pointer rounded-pill border border-hm-border bg-hm-bg px-4 font-mono text-[13px] font-bold text-hm-text-primary sm:w-[240px]"
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
          <Chip className="ml-auto" pressed={groupByRepo} onClick={() => onGroupByRepoChange(!groupByRepo)}>
            {t("debts.filter.groupByRepo")}
          </Chip>
        </div>
      )}

      <ChipGroup aria-label={t("debts.filter.label")} className="gap-2.5">
        <Chip pressed={!label} onClick={() => onLabelChange("")}>
          {t("debts.filter.allLabels")}
        </Chip>
        {Object.values(DebtType).map((type) => {
          const selected = label === type;
          return (
            <Chip
              key={type}
              pressed={selected}
              onClick={() => onLabelChange(selected ? "" : type)}
              className={cn(!selected && "text-[var(--c)]")}
              style={{ "--c": tagColor(type) } as React.CSSProperties}
            >
              {type}
              <CountSuffix value={labelCounts?.[type]} />
            </Chip>
          );
        })}
      </ChipGroup>

      <div className="flex flex-wrap items-center gap-2.5">
        <ChipGroup aria-label={t("debts.filter.status")} className="gap-2.5">
          {DEBT_STATUSES.map((value) => {
            const key = value === "" ? "all" : value;
            return (
              <Chip key={key} pressed={status === value} onClick={() => onStatusChange(value)}>
                {t(`debts.status.${key}` as const)}
              </Chip>
            );
          })}
        </ChipGroup>

        {onOlderThanDaysChange && (
          <label className="flex items-center">
            <span className="sr-only">{t("debts.filter.age")}</span>
            <select
              value={olderThanDays}
              onChange={(event) => onOlderThanDaysChange(Number(event.target.value))}
              className={SELECT}
            >
              {ageOptions.map((days) => (
                <option key={days} value={days}>
                  {days === 0 ? t("debts.filter.anyAge") : t("debts.filter.olderThan", { days })}
                </option>
              ))}
            </select>
          </label>
        )}

        {onPriorityChange && (
          <label className="flex items-center">
            <span className="sr-only">{t("debts.filter.priority")}</span>
            <select value={priority} onChange={(event) => onPriorityChange(event.target.value)} className={SELECT}>
              <option value="">{t("debts.filter.anyPriority")}</option>
              {PRIORITY_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`debts.priority.${value}` as const)}
                </option>
              ))}
            </select>
          </label>
        )}

        {onDebtOnlyChange && (
          <Chip pressed={debtOnly} onClick={() => onDebtOnlyChange(!debtOnly)}>
            {t("debts.filter.debtOnly")}
          </Chip>
        )}

        {onSecretOnlyChange && (
          <Chip pressed={secretOnly} onClick={() => onSecretOnlyChange(!secretOnly)}>
            <ShieldAlert size={14} aria-hidden="true" />
            {t("debts.filter.secret")}
          </Chip>
        )}

        {onAuthorChange && (authors.length > 0 || author) && (
          <label className="flex items-center">
            <span className="sr-only">{t("debts.filter.author")}</span>
            <select value={author} onChange={(event) => onAuthorChange(event.target.value)} className={`${SELECT} max-w-[220px]`}>
              <option value="">{t("debts.filter.allAuthors")}</option>
              {authors.map((login) => (
                <option key={login} value={login}>
                  {login}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  );
}
