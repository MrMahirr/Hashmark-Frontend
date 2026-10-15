import type { Debt } from "@/shared/types/debt.types";
import type { Translator } from "@/shared/i18n";

const MAX_TITLE_LENGTH = 120;
const MAX_BODY_LENGTH = 1500;

function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/**
 * GitHub'ın "yeni issue" sayfasına, başlık ve gövde önceden doldurulmuş bir bağlantı üretir.
 * Issue kullanıcının kendi hesabıyla GitHub'da oluşturulur; Hashmark'ın ek yetkiye ihtiyacı olmaz.
 */
export function buildIssueUrl(debt: Debt, t: Translator): string | null {
  if (!debt.repoName.includes("/")) return null;

  const content = debt.message.replace(/\s+/g, " ").trim();
  const title = clip(
    t("debts.issue.title", { label: debt.type, content }),
    MAX_TITLE_LENGTH
  );
  const permalink =
    debt.permalink ?? `https://github.com/${debt.repoName}/blob/HEAD/${debt.filePath}#L${debt.lineNumber}`;
  const body = clip(
    t("debts.issue.body", { label: debt.type, permalink, content }),
    MAX_BODY_LENGTH
  );

  const params = new URLSearchParams({ title, body });
  if (debt.assignee && /^[A-Za-z0-9-]+$/.test(debt.assignee)) {
    params.set("assignees", debt.assignee);
  }
  return `https://github.com/${debt.repoName}/issues/new?${params.toString()}`;
}
