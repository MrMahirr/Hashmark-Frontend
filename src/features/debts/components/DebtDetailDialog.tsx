"use client";

import { useState } from "react";
import { CheckCircle2, Copy, ExternalLink, GitPullRequestArrow, Loader2, RotateCcw } from "lucide-react";
import { Dialog } from "@/shared/components/Dialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { DebtStatus, TRIAGE_STATUSES, type Debt, type TriageRequestStatus, type TriageStatus } from "@/shared/types/debt.types";
import { useToastStore } from "@/shared/store/toast.store";
import { Button, ButtonLink } from "@/shared/ui/Button";
import { TagBadge, tagColor } from "@/shared/ui/TagBadge";
import { useCreateDebtIssue, useDebtContext, useTriageDebt } from "../hooks/useDebts";

interface DebtDetailDialogProps {
  debt: Debt | null;
  onClose: () => void;
}

const FIELD_LABEL = "font-mono text-xs uppercase tracking-[0.06em] text-hm-text-secondary";
const CONTROL =
  "min-h-12 rounded-control border border-hm-border bg-hm-bg px-3 text-base font-medium text-hm-text-primary";

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-t border-hm-border py-2.5 text-[13px] first:border-t-0">
      <dt className={FIELD_LABEL}>{label}</dt>
      <dd className="col-span-2 m-0 break-words font-mono text-hm-text-primary">{children}</dd>
    </div>
  );
}

/** Form durumu `debt` değişince (key ile) sıfırlanır. */
function DetailBody({ debt }: { debt: Debt }) {
  const { t, formatDate } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const triage = useTriageDebt();
  const createIssue = useCreateDebtIssue();
  const context = useDebtContext(debt.id);

  const [status, setStatus] = useState<TriageStatus>(debt.triageStatus);
  const [assignee, setAssignee] = useState(debt.assignee ?? "");

  const dirty = status !== debt.triageStatus || assignee.trim() !== (debt.assignee ?? "");
  const location = `${debt.filePath}:${debt.lineNumber}`;

  const save = () => {
    triage.mutate(
      { id: debt.id, payload: { status, assignee: assignee.trim() } },
      {
        onSuccess: () => addToast({ title: t("debts.detail.saved"), type: "success" }),
        onError: () => addToast({ title: t("debts.detail.saveFailed"), type: "error" }),
      }
    );
  };

  const isResolved = debt.status === DebtStatus.RESOLVED;
  // Yalnızca kullanıcının çözdüğü kayıt geri açılabilir; taramayla çözülen kod silindiği için kapalı kalır.
  const canReopen = isResolved && debt.manuallyResolved === true;
  const canResolve = !isResolved;

  const setResolved = (status: TriageRequestStatus) => {
    triage.mutate(
      { id: debt.id, payload: { status } },
      {
        onSuccess: () => addToast({ title: t("debts.detail.saved"), type: "success" }),
        onError: () => addToast({ title: t("debts.detail.saveFailed"), type: "error" }),
      }
    );
  };

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(debt.filePath);
      addToast({ title: t("debts.detail.copied"), type: "success" });
    } catch {
      // Pano erişimi yoksa sessizce vazgeç (yol zaten ekranda görünür)
    }
  };

  const ctx = context.data;

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-3">
        <TagBadge tag={debt.type} className="self-start !px-3 !py-0.5 !text-sm" />
        <p className="m-0 text-xl leading-[1.4] text-hm-text-primary">{debt.message}</p>
        <span className="break-all font-mono text-sm text-hm-text-secondary">{location}</span>
        <div className="flex flex-wrap gap-2 pt-1">
          {debt.permalink && (
            <ButtonLink
              href={debt.permalink}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<ExternalLink size={14} aria-hidden="true" />}
            >
              {t("debts.detail.github")}
            </ButtonLink>
          )}
          {debt.githubIssueUrl && debt.githubIssueNumber ? (
            <ButtonLink
              href={debt.githubIssueUrl}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<GitPullRequestArrow size={14} aria-hidden="true" />}
            >
              {t(debt.githubIssueState === "closed" ? "debts.issue.linkClosed" : "debts.issue.link", {
                number: debt.githubIssueNumber,
              })}
            </ButtonLink>
          ) : (
            !isResolved && (
              <Button
                variant="outline"
                onClick={() => createIssue.mutate(debt.id)}
                isLoading={createIssue.isPending}
                leftIcon={<GitPullRequestArrow size={14} aria-hidden="true" />}
              >
                {t("debts.detail.createIssue")}
              </Button>
            )
          )}
          <Button variant="outline" onClick={copyPath} leftIcon={<Copy size={14} aria-hidden="true" />}>
            {t("debts.detail.copyPath")}
          </Button>
        </div>
        {(debt.githubIssueNumber || !isResolved) && (
          <p className="m-0 font-mono text-xs text-hm-text-secondary">{t("debts.issue.hint")}</p>
        )}
        {(canResolve || canReopen) && (
          <div className="flex flex-col gap-2 pt-1">
            {canResolve ? (
              <Button
                className="self-start"
                onClick={() => setResolved("RESOLVED")}
                isLoading={triage.isPending}
                leftIcon={<CheckCircle2 size={16} aria-hidden="true" />}
              >
                {t("debts.detail.markResolved")}
              </Button>
            ) : (
              <Button
                className="self-start"
                variant="outline"
                onClick={() => setResolved("OPEN")}
                isLoading={triage.isPending}
                leftIcon={<RotateCcw size={16} aria-hidden="true" />}
              >
                {t("debts.detail.reopen")}
              </Button>
            )}
            {canResolve && (
              <p className="m-0 font-mono text-xs text-hm-text-secondary">{t("debts.detail.resolvedHint")}</p>
            )}
          </div>
        )}
      </header>

      <section aria-labelledby="debt-context-heading">
        <h3 id="debt-context-heading" className={`mb-2 mt-0 ${FIELD_LABEL}`}>
          {t("debts.detail.context")}
        </h3>
        {context.isLoading ? (
          <p className="m-0 flex items-center gap-2 text-sm text-hm-text-secondary" role="status">
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            {t("debts.detail.contextLoading")}
          </p>
        ) : context.isError ? (
          <p role="alert" className="m-0 text-sm text-hm-danger">
            {t("debts.detail.contextError")}
          </p>
        ) : ctx?.tooLarge ? (
          <p className="m-0 text-sm text-hm-text-secondary">{t("debts.detail.contextTruncated")}</p>
        ) : ctx ? (
          <pre
            className="m-0 max-h-[260px] overflow-auto rounded-control border border-hm-border bg-hm-bg py-2 font-mono text-[13px] leading-6"
            tabIndex={0}
            aria-label={t("debts.detail.context")}
          >
            {ctx.lines.map((line, index) => {
              const lineNumber = ctx.startLine + index;
              const highlighted = lineNumber === ctx.highlightLine;
              return (
                <div
                  key={lineNumber}
                  style={highlighted ? { background: `color-mix(in srgb, ${tagColor(debt.type)} 12%, transparent)` } : undefined}
                  className={`flex px-3 ${highlighted ? "text-hm-text-primary" : "text-hm-text-secondary"}`}
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
        <dl className="m-0">
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

      <section aria-labelledby="debt-triage-heading" className="rounded-card border border-hm-border p-4">
        <h3 id="debt-triage-heading" className={`mb-3 mt-0 ${FIELD_LABEL}`}>
          {t("debts.detail.triage")}
        </h3>
        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-hm-text-primary">
            {t("debts.filter.status")}
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TriageStatus)}
              className={`${CONTROL} cursor-pointer`}
            >
              {TRIAGE_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t(`debts.triage.${value}` as const)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-hm-text-primary">
            {t("debts.detail.assignee")}
            <input
              type="text"
              value={assignee}
              maxLength={100}
              placeholder={t("debts.detail.assigneePlaceholder")}
              onChange={(event) => setAssignee(event.target.value)}
              className={CONTROL}
            />
          </label>
          <Button className="self-start" onClick={save} disabled={!dirty} isLoading={triage.isPending}>
            {t("common.save")}
          </Button>
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
