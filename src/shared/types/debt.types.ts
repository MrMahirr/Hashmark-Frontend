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
/** PATCH /debts/{id} durumları: ek olarak "RESOLVED" (elle çözüldü). */
export type TriageRequestStatus = TriageStatus | "RESOLVED";
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
  /** Kullanıcı "çözüldü" işaretledi; kod hâlâ duruyorsa sonraki tarama yeniden açar. */
  manuallyResolved?: boolean;

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
  /** Hashmark'ın bu borç için açtığı GitHub issue (kapanınca borç çözülür) */
  githubIssueNumber?: number | null;
  githubIssueUrl?: string | null;
  githubIssueState?: "open" | "closed" | null;
}
