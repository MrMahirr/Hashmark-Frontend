/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Yalnızca "Scanner" modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 * Backend'den gelen DTO (Data Transfer Object) nesneleri birebir bu şekilde temsil edilir.
 */

// ── Response Types ──

/** Backend `scan_jobs.status` değerleri (kalıcı kuyruk: PENDING → RUNNING → DONE | FAILED). */
export type ScanJobStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED";

/**
 * GET /scan/{repoId}/status
 * Backend model karşılığı: dev.hashmark.scanner.model.ScanJob
 */
export interface ScanStatusResponse {
  id: number;
  repoId: number;
  status: ScanJobStatus;
  /** Taranan dal; null = varsayılan dal */
  branch: string | null;
  commitSha: string | null;
  attempts: number;
  startedAt: string | null;
  finishedAt: string | null;
  debtFound: number;
  filesScanned: number;
  filesSkipped: number;
  filesFailed: number;
  /** Hata veya uyarı açıklaması ("Partial scan: ...", ".hashmark.yml: ..." gibi) */
  message: string | null;
  /** MANUAL (kullanıcı) | PUSH (GitHub webhook) */
  triggeredBy?: "MANUAL" | "PUSH";
  createdAt: string;
}

// ── Request Types ──
// POST /scan/{repoId} path variable ile çalıştığından ekstra bir JSON body tipine ihtiyaç yoktur.
