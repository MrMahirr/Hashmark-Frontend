/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Dashboard/Rapor ekranına özgü API Request ve Response modelleri burada tutulur.
 * Diğer sayfalardaki verileri gereksiz yere şişirmez. Backend tarafındaki ReportSummaryDto eşleşmesidir.
 */

// ── Response Types ──

/** 
 * GET /report/summary
 * Backend DTO karşılığı: dev.hashmark.report.dto.ReportSummaryDto
 */
export interface ReportSummaryResponse {
  totalRepos: number;
  totalDebts: number;
  criticalDebts: number;
  highDebts: number;
  mediumDebts: number;
  lowDebts: number;
  // Reponun veya genel projenin sağlığını gösteren puan
  healthScore: number; 
  // A'dan F'ye kadar kalite notu
  grade: "A" | "B" | "C" | "D" | "F";
}

// ── Request Types ──
// Sadece GET isteği yapıldığından (Query Params üzerinden filtreleme olabildiğinden)
// ekstra bir JSON body tipine şu an için ihtiyaç yoktur.
