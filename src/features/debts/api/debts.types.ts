/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Yalnızca "Debts (Teknik Borçlar)" modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 * Backend'den gelen DTO (Data Transfer Object) nesneleri birebir bu şekilde temsil edilir.
 */

import type { TriageRequestStatus, TriageStatus } from "@/shared/types/debt.types";

// ── Response Types ──

/**
 * Spring Data PageResponse DTO
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * GET /debts, PATCH /debts/{id}
 * Backend DTO karşılığı: dev.hashmark.debt.dto.DebtDto
 */
export interface DebtResponse {
  id: number;
  repoId: number;
  repoFullName?: string;
  filePath: string;
  lineNo: number;
  label: "TODO" | "FIXME" | "HACK" | "XXX" | "NOTE" | "DOC" | "INFO" | string;
  content: string;
  detectedAt: string;
  resolvedAt: string | null;
  manuallyResolved?: boolean;

  commitSha?: string | null;
  permalink?: string | null;
  fingerprint?: string | null;
  triageStatus?: TriageStatus | string | null;
  assignee?: string | null;
  priority?: string | null;
  /** öncelik koddan yazılmadı, anahtar kelimeden çıkarıldı */
  priorityAuto?: boolean;
  /** yorumda sır bulundu ve maskelendi */
  secretDetected?: boolean;
  dueDate?: string | null;
  issueRef?: string | null;
  authorLogin?: string | null;
  authorName?: string | null;
  introducedAt?: string | null;
  githubIssueNumber?: number | null;
  githubIssueUrl?: string | null;
  githubIssueState?: "open" | "closed" | null;
}

/**
 * POST /debts/{id}/issue, POST /debts/issues
 * Backend karşılığı: dev.hashmark.issue.DebtIssueService.IssueResult
 */
export interface IssueResult {
  debtId: number;
  issueNumber: number | null;
  issueUrl: string | null;
  /** false: borçta zaten issue vardı (yenisi açılmadı) */
  created: boolean;
  /** toplu istekte bu borç için hata */
  error: string | null;
}

/**
 * GET /debts/stats
 * Backend DTO karşılığı: dev.hashmark.debt.dto.DebtStatsDto
 */
export interface DebtStatsResponse {
  total: number;
  addedThisWeek: number;
  resolvedThisWeek: number;
}

/**
 * GET /debts/{id}/context
 * Backend DTO karşılığı: dev.hashmark.debt.dto.DebtContextDto
 */
export interface DebtContextResponse {
  filePath: string;
  commitSha: string | null;
  /** `lines[0]` dosyanın bu satırıdır (1 tabanlı). */
  startLine: number;
  highlightLine: number;
  totalLines: number;
  lines: string[];
  tooLarge: boolean;
}

// ── Request Types ──

/** GET /debts ve GET /debts/export için ortak filtreler. */
export interface DebtFilters {
  repoId?: string;
  label?: string;
  /** "open" | "resolved" | "ignored"; boş = hepsi */
  status?: string;
  q?: string;
  assignee?: string;
  priority?: string;
  /** git blame yazarı (GitHub kullanıcı adı) */
  author?: string;
  /** en az bu kadar gündür açık (yaş) */
  olderThanDays?: number;
  /** yalnızca yorumunda sır bulunup maskelenenler */
  secret?: boolean;
  /** NOTE/DOC/INFO hariç (içgörü sayılarıyla aynı kapsam) */
  debtOnly?: boolean;
  /** dosya ya da klasör yolu (klasörse altındakiler) */
  path?: string;
  sort?: string;
  dir?: "asc" | "desc";
  page?: number;
  size?: number;
}

/** PATCH /debts/{id}: gönderilmeyen alan değişmez, assignee "" ise atama kaldırılır. */
export interface DebtTriageRequest {
  status?: TriageRequestStatus;
  assignee?: string;
}

export type ExportFormat = "csv" | "json" | "sarif";
