"use client";

import { useState } from "react";
import { ExternalLink, GitPullRequestArrow, Loader2 } from "lucide-react";
import { Dialog } from "@/shared/components/Dialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { TRIAGE_STATUSES, type Debt, type TriageStatus } from "@/shared/types/debt.types";
import { useToastStore } from "@/shared/store/toast.store";
import { useDebtContext, useTriageDebt } from "../hooks/useDebts";
import { buildIssueUrl } from "../utils/issue-url";
import { LabelBadge } from "./LabelBadge";

interface DebtDetailDialogProps {
  debt: Debt | null;
  onClose: () => void;
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1.5 text-[12px]">
      <dt className="text-hm-text-secondary">{label}</dt>
      <dd className="col-span-2 text-hm-text-primary break-words">{children}</dd>
    </div>
  );
}

/** Form durumu `debt` değişince (key ile) sıfırlanır. */
function DetailBody({ debt }: { debt: Debt }) {
  const { t, formatDate } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const triage = useTriageDebt();
  const context = useDebtContext(debt.id);

  const [status, setStatus] = useState<TriageStatus>(debt.triageStatus);
  const [assignee, setAssignee] = useState(debt.assignee ?? "");

  const issueUrl = buildIssueUrl(debt, t);
  const dirty = status !== debt.triageStatus || assignee.trim() !== (debt.assignee ?? "");

  const save = () => {
    triage.mutate(
      { id: debt.id, payload: { status, assignee: assignee.trim() } },
      {
        onSuccess: () => addToast({ title: t("debts.detail.saved"), type: "success" }),
        onError: () => addToast({ title: t("debts.detail.saveFailed"), type: "error" }),
      }
    );
  };

  const ctx = context.data;

  return (
    <div className="flex flex-col gap-5 p-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <LabelBadge type={debt.type} />
          <span className="font-mono text-[12px] text-hm-text-secondary break-all">
            {debt.filePath}:{debt.lineNumber}
          </span>
        </div>
        <p className="font-mono text-[13px] text-hm-text-primary break-words">{debt.message}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {debt.permalink && (
            <a
              href={debt.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border-[0.5px] border-hm-border px-2.5 py-1.5 text-[12px] text-hm-text-primary hover:bg-hm-bg"
            >
              <ExternalLink size={14} aria-hidden="true" />
              {t("debts.detail.github")}
            </a>
          )}
          {issueUrl && (
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border-[0.5px] border-hm-border px-2.5 py-1.5 text-[12px] text-hm-text-primary hover:bg-hm-bg"
            >
              <GitPullRequestArrow size={14} aria-hidden="true" />
              {t("debts.detail.createIssue")}
            </a>
          )}
        </div>
      </header>

      <section aria-labelledby="debt-context-heading">
        <h3 id="debt-context-heading" className="mb-2 text-[12px] font-medium text-hm-text-secondary">
          {t("debts.detail.context")}
        </h3>
        {context.isLoading ? (
          <p className="flex items-center gap-2 text-[12px] text-hm-text-secondary" role="status">
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            {t("debts.detail.contextLoading")}
          </p>
        ) : context.isError ? (
          <p role="alert" className="text-[12px] text-hm-danger">
            {t("debts.detail.contextError")}
          </p>
        ) : ctx?.tooLarge ? (
          <p className="text-[12px] text-hm-text-secondary">{t("debts.detail.contextTruncated")}</p>
        ) : ctx ? (
          <pre
            className="max-h-[260px] overflow-auto rounded-md border-[0.5px] border-hm-border bg-hm-bg py-2 font-mono text-[12px] leading-5"
            tabIndex={0}
            aria-label={t("debts.detail.context")}
          >
            {ctx.lines.map((line, index) => {
              const lineNumber = ctx.startLine + index;
              const highlighted = lineNumber === ctx.highlightLine;
              return (
                <div
                  key={lineNumber}
                  className={`flex px-3 ${highlighted ? "bg-hm-todo-bg text-hm-text-primary" : "text-hm-text-secondary"}`}
                >
                  <span className="w-10 shrink-0 select-none pr-3 text-right text-hm-text-muted">{lineNumber}</span>
                  <span className="whitespace-pre">{line || " "}</span>
                </div>
              );
            })}
          </pre>
        ) : null}
      </section>

      <section aria-labelledby="debt-meta-heading">
        <h3 id="debt-meta-heading" className="sr-only">
          {t("debts.detail.title")}
        </h3>
        <dl className="divide-y-[0.5px] divide-hm-border">
          <MetaRow label={t("debts.detail.repo")}>{debt.repoName}</MetaRow>
          <MetaRow label={t("debts.detail.author")}>
            {debt.authorLogin ?? debt.authorName ?? t("debts.detail.unknown")}
          </MetaRow>
          {debt.introducedAt && (
            <MetaRow label={t("debts.detail.introduced")}>{formatDate(debt.introducedAt)}</MetaRow>
          )}
          <MetaRow label={t("debts.detail.detected")}>{formatDate(debt.createdAt)}</MetaRow>
          {debt.resolvedAt && <MetaRow label={t("debts.detail.resolved")}>{formatDate(debt.resolvedAt)}</MetaRow>}
          {debt.priority && (
            <MetaRow label={t("debts.detail.priority")}>{t(`debts.priority.${debt.priority}` as const)}</MetaRow>
          )}
          {debt.dueDate && <MetaRow label={t("debts.detail.due")}>{formatDate(debt.dueDate)}</MetaRow>}
          {debt.issueRef && <MetaRow label={t("debts.detail.issue")}>{debt.issueRef}</MetaRow>}
          {debt.commitSha && (
            <MetaRow label={t("debts.detail.commit")}>
              <code className="font-mono">{debt.commitSha.slice(0, 7)}</code>
            </MetaRow>
          )}
        </dl>
      </section>

      <section aria-labelledby="debt-triage-heading" className="rounded-md border-[0.5px] border-hm-border p-3">
        <h3 id="debt-triage-heading" className="mb-3 text-[12px] font-medium text-hm-text-secondary">
          {t("debts.detail.triage")}
        </h3>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-[12px] text-hm-text-secondary">
            {t("debts.filter.status")}
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TriageStatus)}
              className="h-9 rounded-md border-[0.5px] border-hm-border bg-hm-surface px-2 text-[13px] text-hm-text-primary"
            >
              {TRIAGE_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t(`debts.triage.${value}` as const)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[12px] text-hm-text-secondary">
            {t("debts.detail.assignee")}
            <input
              type="text"
              value={assignee}
              maxLength={100}
              placeholder={t("debts.detail.assigneePlaceholder")}
              onChange={(event) => setAssignee(event.target.value)}
              className="h-9 rounded-md border-[0.5px] border-hm-border bg-hm-surface px-2 text-[13px] text-hm-text-primary"
            />
          </label>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || triage.isPending}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-md bg-hm-blue px-4 text-[13px] font-medium text-hm-text-inverse disabled:opacity-50"
          >
            {triage.isPending && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            {t("common.save")}
          </button>
        </div>
      </section>
    </div>
  );
}

export function DebtDetailDialog({ debt, onClose }: DebtDetailDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={!!debt} onClose={onClose} title={t("debts.detail.title")} placement="right">
      {debt ? <DetailBody key={debt.id} debt={debt} /> : null}
    </Dialog>
  );
}
