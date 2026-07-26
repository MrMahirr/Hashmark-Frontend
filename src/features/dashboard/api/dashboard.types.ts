/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Dashboard/Rapor ekranına özgü API Request ve Response modelleri burada tutulur.
 * Diğer sayfalardaki verileri gereksiz yere şişirmez. Backend tarafındaki SummaryResponse eşleşmesidir.
 */

// ── Response Types ──

export interface TrendDataPointDto {
  weekStart: string;
  totalDebts: number;
  newDebts: number;
  resolvedDebts: number;
}

export interface LabelStatsDto {
  todoCount: number;
  fixmeCount: number;
  hackCount: number;
  xxxCount: number;
}

export interface ModuleDebtInfoDto {
  modulePath: string;
  debtCount: number;
}

/** 
 * GET /report/summary
 * Backend DTO karşılığı: dev.hashmark.report.dto.SummaryResponse
 */
export interface ReportSummaryResponse {
  trendData: TrendDataPointDto[];
  labelStats: LabelStatsDto;
  topModules: ModuleDebtInfoDto[];
}

// ── Request Types ──
// Sadece GET isteği yapıldığından (Query Params üzerinden filtreleme olabildiğinden)
// ekstra bir JSON body tipine şu an için ihtiyaç yoktur.
