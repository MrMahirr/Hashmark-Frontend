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
  noteCount?: number;
  docCount?: number;
  infoCount?: number;
  /** `.hashmark.yml` özel etiketleri: etiket → açık borç sayısı. Hepsi borç sayılır. */
  customCounts?: Record<string, number>;
}

export interface ModuleDebtInfoDto {
  modulePath: string;
  debtCount: number;
}

/** Yaş aralığı: `minDays <= yaş < maxDays`; `maxDays` null ise üst sınır yok. */
export interface AgeBucketDto {
  key: string;
  minDays: number;
  maxDays: number | null;
  count: number;
}

/**
 * Açık borçların (NOTE/DOC/INFO hariç) yaş, öncelik, sır ve maliyet özeti.
 * Backend DTO karşılığı: dev.hashmark.report.dto.DebtInsights
 */
export interface DebtInsightsDto {
  openDebts: number;
  ageBuckets: AgeBucketDto[];
  /** 90+ gündür açık */
  staleCount: number;
  /** 0–100: ortalama yaşın bir yıla oranı */
  rotScore: number;
  averageAgeDays: number;
  /** CRITICAL, HIGH, MEDIUM, LOW, NONE */
  priorityCounts: Record<string, number>;
  autoPriorityCount: number;
  secretCount: number;
  /** Sağlık skorunun girdisi: etiket ağırlığı × öncelik çarpanı */
  weightedDebt: number;
  estimatedHours: number;
  /** Ücret ayarlanmadıysa null */
  hourlyRate: number | null;
  currency: string | null;
  estimatedCost: number | null;
}

/** 
 * GET /report/summary
 * Backend DTO karşılığı: dev.hashmark.report.dto.SummaryResponse
 */
export interface ReportSummaryResponse {
  trendData: TrendDataPointDto[];
  labelStats: LabelStatsDto;
  topModules: ModuleDebtInfoDto[];
  /** Eski sunucularda yok */
  insights?: DebtInsightsDto;
}

/** Isı haritası öğesi. Backend: dev.hashmark.report.dto.HotspotResponse.Node */
export interface HotspotNodeDto {
  name: string;
  /** Depo köküne göre tam yol */
  path: string;
  directory: boolean;
  debts: number;
  weightedDebt: number;
  staleCount: number;
  /** Klasörse altındaki borçlu dosya sayısı */
  files: number;
}

/**
 * GET /report/hotspots?repoId=&path=
 * Backend DTO karşılığı: dev.hashmark.report.dto.HotspotResponse
 */
export interface HotspotResponse {
  /** "" = depo kökü */
  path: string;
  debts: number;
  weightedDebt: number;
  staleCount: number;
  children: HotspotNodeDto[];
  /** 50'den fazla alt öğe varsa gösterilmeyenlerin sayısı */
  hiddenChildren: number;
  topFiles: HotspotNodeDto[];
  /** Çok büyük depoda sayılar eksik olabilir */
  truncated: boolean;
}

/**
 * GET /report/repos
 * Backend DTO karşılığı: dev.hashmark.report.dto.RepoInsightsRow
 */
export interface RepoInsightsRowDto {
  repoId: number;
  fullName: string;
  /** Hiç taranmadıysa null */
  lastScannedAt: string | null;
  insights: DebtInsightsDto;
}

// ── Request Types ──
// Sadece GET isteği yapıldığından (Query Params üzerinden filtreleme olabildiğinden)
// ekstra bir JSON body tipine şu an için ihtiyaç yoktur.
