export enum DebtType {
  TODO = "TODO",
  FIXME = "FIXME",
  HACK = "HACK",
  XXX = "XXX",
  NOTE = "NOTE",
  DOC = "DOC",
  INFO = "INFO",
}

export enum DebtStatus {
  ACTIVE = "ACTIVE",
  RESOLVED = "RESOLVED",
}

/** Kullanıcının borç üzerindeki kararı (taramalar bunu değiştirmez). */
export type TriageStatus = "OPEN" | "IGNORED" | "WONT_FIX";
export const TRIAGE_STATUSES: readonly TriageStatus[] = ["OPEN", "IGNORED", "WONT_FIX"];

export type DebtPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Debt {
  id: string;
  type: DebtType;
  message: string;
  filePath: string;
  lineNumber: number;
  repoId: string;
  repoName: string;
  status: DebtStatus;
  /** ISO tarih; ekranda kullanıcının diline göre biçimlendirilir. */
  createdAt: string;
  resolvedAt: string | null;

  triageStatus: TriageStatus;
  /** GitHub'daki satırın kalıcı bağlantısı (son görüldüğü commit). */
  permalink: string | null;
  commitSha: string | null;
  /** Etkin atanan: elle atama veya koddaki TODO(kisi). */
  assignee: string | null;
  priority: DebtPriority | null;
  dueDate: string | null;
  issueRef: string | null;
  /** git blame (en iyi çaba) */
  authorLogin: string | null;
  authorName: string | null;
  introducedAt: string | null;
}

/**
 * Debt type'a göre CSS pill class döndüren yardımcı mapping.
 * Tailwind token'ları globals.css'de tanımlı.
 */
export const DEBT_TYPE_CONFIG: Record<
  DebtType,
  { label: string; pillClass: string; colorClass: string; bgClass: string }
> = {
  [DebtType.TODO]: {
    label: "TODO",
    pillClass: "bg-hm-todo-bg text-hm-todo",
    colorClass: "text-hm-todo",
    bgClass: "bg-hm-todo-bg",
  },
  [DebtType.FIXME]: {
    label: "FIXME",
    pillClass: "bg-hm-fixme-bg text-hm-fixme",
    colorClass: "text-hm-fixme",
    bgClass: "bg-hm-fixme-bg",
  },
  [DebtType.HACK]: {
    label: "HACK",
    pillClass: "bg-hm-hack-bg text-hm-hack",
    colorClass: "text-hm-hack",
    bgClass: "bg-hm-hack-bg",
  },
  [DebtType.XXX]: {
    label: "XXX",
    pillClass: "bg-hm-xxx-bg text-hm-xxx",
    colorClass: "text-hm-xxx",
    bgClass: "bg-hm-xxx-bg",
  },
  [DebtType.NOTE]: {
    label: "NOTE",
    pillClass: "bg-hm-note-bg text-hm-note",
    colorClass: "text-hm-note",
    bgClass: "bg-hm-note-bg",
  },
  [DebtType.DOC]: {
    label: "DOC",
    pillClass: "bg-hm-doc-bg text-hm-doc",
    colorClass: "text-hm-doc",
    bgClass: "bg-hm-doc-bg",
  },
  [DebtType.INFO]: {
    label: "INFO",
    pillClass: "bg-hm-info-bg text-hm-info",
    colorClass: "text-hm-info",
    bgClass: "bg-hm-info-bg",
  },
};
