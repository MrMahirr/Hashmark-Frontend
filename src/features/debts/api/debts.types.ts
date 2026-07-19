/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Yalnızca "Debts (Teknik Borçlar)" modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 * Backend'den gelen DTO (Data Transfer Object) nesneleri birebir bu şekilde temsil edilir.
 */

// ── Response Types ──

/** 
 * GET /debts
 * Backend DTO karşılığı: dev.hashmark.debt.dto.DebtDto
 */
export interface DebtResponse {
  id: number;
  repoId: number;
  filePath: string;
  lineNumber: number;
  // Severity (Önem Derecesi)
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  // Borç Tipi
  type: "TODO" | "FIXME" | "HACK" | "DEPRECATED";
  message: string;
  author: string | null;
  commitHash: string | null;
  createdAt: string;
}

/** 
 * GET /debts/stats
 * Backend DTO karşılığı: dev.hashmark.debt.dto.DebtStatsDto
 */
export interface DebtStatsResponse {
  totalDebts: number;
  criticalDebts: number;
  highDebts: number;
  mediumDebts: number;
  lowDebts: number;
}

// ── Request Types ──
// GET endpointleri için URL Parametreleri (Query Params) kullanıldığından 
// JSON Request Body tanımlamasına şimdilik gerek yoktur.
