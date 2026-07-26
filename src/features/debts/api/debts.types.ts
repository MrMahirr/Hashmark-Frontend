/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Yalnızca "Debts (Teknik Borçlar)" modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 * Backend'den gelen DTO (Data Transfer Object) nesneleri birebir bu şekilde temsil edilir.
 */

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
 * GET /debts
 * Backend DTO karşılığı: dev.hashmark.debt.dto.DebtDto
 */
export interface DebtResponse {
  id: number;
  repoId: number;
  repoFullName?: string;
  filePath: string;
  lineNo: number;
  label: "TODO" | "FIXME" | "HACK" | "XXX" | string;
  content: string;
  detectedAt: string;
  resolvedAt: string | null;
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

// ── Request Types ──
// GET endpointleri için URL Parametreleri (Query Params) kullanıldığından 
// JSON Request Body tanımlamasına şimdilik gerek yoktur.
