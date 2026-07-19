/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Yalnızca "Scanner" modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 * Backend'den gelen DTO (Data Transfer Object) nesneleri birebir bu şekilde temsil edilir.
 */

// ── Response Types ──

/** 
 * GET /scan/{repoId}/status
 * Backend DTO karşılığı: dev.hashmark.scanner.dto.ScanStatusDto
 */
export interface ScanStatusResponse {
  repoId: number;
  // Durum makinesi tipleri (Union types)
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  message: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

// ── Request Types ──
// POST /scan endpoint'i path variable ile çalıştığından (POST /scan/{repoId}) 
// ekstra bir JSON body tipine şu an için ihtiyaç yoktur.
